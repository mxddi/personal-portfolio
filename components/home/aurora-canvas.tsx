"use client";

import { useEffect, useRef, useState } from "react";
import type * as Three from "three";

/**
 * "Aurora Borealis from Space" — a real-time WebGL shader scene layered
 * behind the hero, dark mode only, modeled on real ISS aurora photography
 * (bright filamentary green curtain hugging the limb, a soft diffuse red
 * glow higher up, a thin bright atmospheric rim, and a dense starfield). A
 * single full-viewport plane, one fragment shader, three concerns:
 *   1. deep-space background + dense twinkling starfield
 *   2. Earth's limb across the lower third, with a thin bright rim plus
 *      broader atmospheric (Fresnel-style) scattering along the curve
 *   3. a fine-grained, ray/finger-textured green aurora curtain hugging
 *      the limb, fading into a softer, less structured red/crimson glow
 *      higher up — driven by fbm(simplex) noise in time
 *
 * Perf strategy (see inline comments below for each):
 *   - capped device pixel ratio
 *   - fewer noise octaves / lower star density / lower target FPS on mobile
 *   - IntersectionObserver pauses the rAF loop when scrolled out of view
 *     (desktop only — iOS IO is unreliable on absolutely positioned layers)
 *   - missing WebGL skips the scene entirely
 */
export function AuroraCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeRef = useRef<typeof Three | null>(null);
  const [threeReady, setThreeReady] = useState(false);
  const [useFallback, setUseFallback] = useState<boolean | null>(null);

  // Use the same npm `three` as react-globe.gl — loading an older CDN build
  // into `window.THREE` breaks three-render-objects' `new Timer()` on /world.
  useEffect(() => {
    if (useFallback !== false) return;
    let cancelled = false;
    import("three").then((THREE) => {
      if (cancelled) return;
      threeRef.current = THREE;
      setThreeReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [useFallback]);

  // Decide once, up front, whether it's even worth attempting WebGL.
  useEffect(() => {
    const hasWebGL = (() => {
      try {
        const probe = (id: string) => {
          const c = document.createElement("canvas");
          const gl = c.getContext(id, { failIfMajorPerformanceCaveat: false });
          if (gl && "getExtension" in gl) {
            gl.getExtension("WEBGL_lose_context")?.loseContext();
          }
          return !!gl;
        };
        // Probe on separate canvases — Safari will not allow a second
        // context type on the same canvas after a failed webgl2 request.
        return probe("webgl") || probe("experimental-webgl") || probe("webgl2");
      } catch {
        return false;
      }
    })();

    // iOS "Reduce Motion" is commonly on and was hiding the aurora
    // entirely. This scene is decorative and already capped on mobile,
    // so we only skip when WebGL itself is unavailable.
    setUseFallback(!hasWebGL);
  }, []);

  useEffect(() => {
    if (useFallback !== false || !threeReady) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const THREE = threeRef.current;
    if (!container || !canvas || !THREE) return;

    // ---- device / quality tier ------------------------------------------
    const isMobile = window.innerWidth < 768;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      // Opaque canvas — iOS Safari often composites an alpha WebGL
      // canvas as a blank/grey hole.
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: isMobile ? "default" : "high-performance",
      failIfMajorPerformanceCaveat: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    });
    renderer.setClearColor(0x09090b, 1);
    // Adaptive DPR cap — stops a 3x-DPR phone from rendering at full
    // Retina resolution and overloading its GPU/thermal budget.
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5)
    );
    renderer.setSize(
      Math.max(container.clientWidth, 1),
      Math.max(container.clientHeight, 1)
    );

    const uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(container.clientWidth, container.clientHeight),
      },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      // Dynamic feature scaling: mobile gets fewer fbm octaves and a
      // sparser starfield baked directly into the shader source (cheaper
      // than a uniform-driven loop, and avoids variable loop bounds).
      fragmentShader: buildFragmentShader(!isMobile),
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    function frustumSizeAt(distance: number) {
      const vFov = (camera.fov * Math.PI) / 180;
      const height = 2 * Math.tan(vFov / 2) * distance;
      const width = height * camera.aspect;
      return { width, height };
    }

    let { width, height } = frustumSizeAt(camera.position.z);
    let geometry = new THREE.PlaneGeometry(width * 1.3, height * 1.3);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ---- subtle mouse / touch camera parallax ---------------------------
    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };

    function updateMouseFromClient(clientX: number, clientY: number) {
      const rect = container!.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
      // Clamp so the cursor outside the hero (e.g. the page footer)
      // can't yank the aurora out of its resting frame.
      mouseTarget.x = Math.max(-1, Math.min(1, nx));
      // Bottom of the page is ny < 0 — keep that lift much smaller than
      // the sideways / upward parallax so the curtain stays under the stats.
      const clampedY = Math.max(-1, Math.min(1, ny));
      mouseTarget.y = clampedY < 0 ? clampedY * 0.22 : clampedY * 0.55;
    }
    const onMouseMove = (e: MouseEvent) =>
      updateMouseFromClient(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) updateMouseFromClient(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // ---- resize ------------------------------------------------------------
    function handleResize() {
      if (!THREE) return;
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
      const size = frustumSizeAt(camera.position.z);
      geometry.dispose();
      geometry = new THREE.PlaneGeometry(size.width * 1.3, size.height * 1.3);
      mesh.geometry = geometry;
      mesh.position.y = 0;
    }
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // iOS IntersectionObserver is flaky on `position: absolute` layers and
    // can report "not intersecting" forever, which froze the aurora.
    let isVisible = true;
    let intersectionObserver: IntersectionObserver | null = null;
    if (!isMobile) {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0 }
      );
      intersectionObserver.observe(container);
    }

    handleResize();
    requestAnimationFrame(handleResize);

    // ---- render loop, frame-rate capped, paused when offscreen ----------
    let rafId = 0;
    let lastFrameTime = 0;
    const clockStart = performance.now();

    function tick(now: number) {
      rafId = requestAnimationFrame(tick);
      if (document.hidden || !isVisible) return;

      const elapsed = now - lastFrameTime;
      if (elapsed < frameInterval) return;
      lastFrameTime = now - (elapsed % frameInterval);

      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.04;
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.04;
      camera.position.x = mouseCurrent.x * 0.3;
      camera.position.y = mouseCurrent.y * 0.08 + 0.1;
      camera.lookAt(0, 0.1, 0);
      uniforms.uMouse.value.set(mouseCurrent.x, mouseCurrent.y);
      uniforms.uTime.value = (now - clockStart) / 1000;

      renderer.render(scene, camera);
    }
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [threeReady, useFallback]);

  // Still deciding (first client render) — render nothing rather than
  // flashing the fallback then swapping to canvas.
  if (useFallback === null) return null;

  if (useFallback) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
    >
      <canvas ref={canvasRef} className="h-full w-full" />

      {/*
        Light-asset / video fallback slot — on devices where an autoplaying
        video loop is cheaper than a WebGL context (older touch devices,
        Data Saver / `prefers-reduced-data`, or a detected low GPU tier),
        swap the <canvas> above for something like:

        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/aurora-poster.jpg"
        >
          <source src="/aurora-loop.webm" type="video/webm" />
          <source src="/aurora-loop.mp4" type="video/mp4" />
        </video>

        A compressed ~1080p WebM/MP4 loop of this exact shader (screen-
        recorded once, offline) costs far less CPU/GPU/battery than the
        live shader and is a drop-in replacement for this element.
      */}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shaders
// ---------------------------------------------------------------------------

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function buildFragmentShader(highQuality: boolean) {
  // Dynamic feature scaling: fewer fbm octaves and a sparser starfield on
  // mobile/low-tier devices. Baked into the shader source (rather than a
  // uniform-controlled loop) so the loop bound stays a compile-time
  // constant, which is both faster and safer across GPU drivers.
  const octaves = highQuality ? 5 : 2;
  const starDensity = highQuality ? 220.0 : 110.0;
  const earthCenterY = highQuality ? -2.02 : -2.16;
  const ceilingLo = highQuality ? 0.13 : 0.06;
  const ceilingHi = highQuality ? 0.24 : 0.15;

  return `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;

    // 2D simplex noise — Ashima Arts / Stefan Gustavson (MIT), the
    // standard compact GLSL implementation used across countless shaders.
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                          -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
              + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    // Fractional Brownian motion — layered noise for organic, fluid motion.
    float fbm(vec2 p) {
      float total = 0.0;
      float amp = 0.5;
      for (int i = 0; i < ${octaves}; i++) {
        total += snoise(p) * amp;
        p *= 2.02;
        amp *= 0.5;
      }
      return total;
    }

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      vec2 p = (uv - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);

      // subtle parallax offset, driven by the damped mouse position
      p += vec2(uMouse.x * 0.03, uMouse.y * 0.012);

      // ---- deep space base ----
      vec3 col = vec3(0.008, 0.01, 0.018);

      // ---- dense, static starfield (no twinkle — brightness is fixed
      // per star, just a per-cell random variation, not time-driven) ----
      vec2 starUv = uv * ${starDensity.toFixed(1)};
      vec2 starCell = floor(starUv);
      float starRand = hash(starCell);
      if (starRand > 0.978) {
        float brightness = 0.55 + 0.45 * fract(starRand * 17.0);
        // small, sharp pinpoints rather than soft glowing orbs — most are
        // tiny, a few slightly larger/brighter, like real star magnitudes
        float starSize = 0.045 + 0.09 * fract(starRand * 31.0);
        float d = length(fract(starUv) - 0.5);
        col += vec3(0.9, 0.95, 1.0) * smoothstep(starSize, 0.0, d) * brightness * 0.95;
      }

      // ---- Earth's limb — aurora sits under the stats row ----
      float earthR = 1.7;
      vec2 earthCenter = vec2(0.0, ${earthCenterY.toFixed(2)});
      float distToEarth = length(p - earthCenter) - earthR; // > 0 above the surface

      // thin, bright atmospheric rim — the electric blue-white edge seen
      // from orbit, kept mostly even so it reads as atmosphere, not aurora
      float limbRim = smoothstep(0.028, 0.0, abs(distToEarth));
      col += vec3(0.78, 0.9, 1.0) * limbRim * 0.72;

      // broader, softer blue scatter just outside the rim
      float limbGlow = smoothstep(0.18, 0.0, abs(distToEarth));
      col += vec3(0.28, 0.48, 0.85) * limbGlow * 0.16;

      // dark planet silhouette below the limb
      float planetMask = smoothstep(0.04, -0.12, distToEarth);
      vec3 planetColor = vec3(0.01, 0.02, 0.035);
      col = mix(col, planetColor, planetMask);

      // ---- aurora, modeled on ISS photography: a continuous green
      // ribbon hugging the atmosphere, with a few vertical pillars and a
      // soft magenta-to-red haze fading into space above it ----
      float h = max(distToEarth, -0.04);

      // height of the green ribbon along the limb — mostly even, with
      // occasional taller pillars (as in the reference photo)
      float curtainProfile = fbm(vec2(p.x * 1.15, 0.0));
      float pillar = smoothstep(0.35, 0.72, fbm(vec2(p.x * 2.4, 12.0)));
      float curtainTop = 0.11 + curtainProfile * 0.035 + pillar * 0.06;

      float hEnv = h * 2.95;

      // subtle vertical texture — enough to break a flat stripe, not so
      // much that the ribbon falls apart into neon streaks
      float rayWarp = sin(h * 2.4 + uTime * 0.07) * 0.22
        + fbm(vec2(p.x * 0.9, uTime * 0.014)) * 1.4;
      float rays = fbm(vec2(p.x * ${(highQuality ? 18.0 : 10.0).toFixed(
        1
      )} + rayWarp, uTime * 0.05));
      rays = smoothstep(-0.25, 0.5, rays);

      // green ribbon: classic ISS aurora green, brightest at the limb
      float greenFalloff = 1.0 - smoothstep(-0.02, curtainTop, hEnv);
      float green = greenFalloff * mix(0.48, 0.82, rays);
      vec3 greenColor = vec3(0.38, 0.95, 0.42);

      // magenta / pink sitting just above the green — the mid-altitude
      // glow in the reference, stronger where pillars punch upward
      float pinkBand = smoothstep(curtainTop * 0.15, curtainTop * 0.55, hEnv)
        * (1.0 - smoothstep(curtainTop * 0.7, curtainTop * 1.45 + pillar * 0.2, hEnv));
      vec3 pinkColor = vec3(0.85, 0.22, 0.62);

      // high, diffuse red/crimson fading into space
      float redProfile = fbm(vec2(p.x * 0.7, 40.0)) * 0.5 + 0.5;
      float redBand = smoothstep(curtainTop * 0.35, curtainTop * 0.85, hEnv)
        * (1.0 - smoothstep(curtainTop * 1.1, curtainTop * 1.85 + redProfile * 0.2, hEnv));
      vec3 redColor = vec3(0.72, 0.04, 0.22);

      vec3 auroraColor = greenColor * green
        + pinkColor * pinkBand * (0.32 + pillar * 0.2)
        + redColor * redBand * 0.42;

      // fade toward the heading above, and cap height so the top of the
      // glow sits below the Degree / Upcoming / Focus row (uv.y → 0 bottom)
      float auroraTopFade = 1.0 - smoothstep(0.48, 0.82, uv.y);
      float auroraCeiling = 1.0 - smoothstep(${ceilingLo.toFixed(2)}, ${ceilingHi.toFixed(2)}, uv.y);
      float auroraScreen = auroraTopFade * auroraCeiling;
      float auroraLimb = smoothstep(-0.16, 0.05, distToEarth);
      col += auroraColor * auroraLimb * auroraScreen;

      // gentle vignette so the frame edges recede into the dark
      float vig = smoothstep(1.15, 0.2, length(p));
      col *= mix(0.6, 1.0, vig);

      // narrow bottom trail into the page background — soft edge only
      vec3 bgColor = vec3(0.008, 0.01, 0.018);
      float bottomTrail = smoothstep(0.0, 0.11, uv.y);
      col = mix(bgColor, col, bottomTrail);

      gl_FragColor = vec4(col, 1.0);
    }
  `;
}
