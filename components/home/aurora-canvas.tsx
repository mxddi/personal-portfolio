"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

// Three.js is intentionally loaded from a CDN as a classic global script
// (rather than the npm package) so the hero's WebGL scene ships as its own
// cacheable, deferred bundle instead of growing the app's first-party JS.
const THREE_CDN_URL = "https://unpkg.com/three@0.160.0/build/three.min.js";

declare global {
  interface Window {
    // Loaded from the CDN as a plain global (see THREE_CDN_URL below), not
    // the npm package, so we deliberately don't pull in `three`'s types
    // here — that would require the package as a type-only dependency.
    THREE?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

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
 *   - reduced-motion / no-WebGL / low-core devices get a static CSS fallback
 */
export function AuroraCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [threeReady, setThreeReady] = useState(false);
  const [useFallback, setUseFallback] = useState<boolean | null>(null);

  // Decide once, up front, whether it's even worth attempting WebGL.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const hasWebGL = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    })();

    // Crude low-power-device heuristic — a real product would also check
    // `navigator.connection?.saveData` and a GPU tier library, but core
    // count alone is enough to avoid the shader on the lowest tier.
    const lowEndDevice =
      typeof navigator !== "undefined" &&
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency > 0 &&
      navigator.hardwareConcurrency <= 2;

    setUseFallback(prefersReducedMotion || !hasWebGL || lowEndDevice);
  }, []);

  useEffect(() => {
    if (useFallback !== false || !threeReady) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const THREE = window.THREE;
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
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });
    // Adaptive DPR cap — stops a 3x-DPR phone from rendering at full
    // Retina resolution and overloading its GPU/thermal budget.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);

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
      mouseTarget.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseTarget.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
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
    }
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ---- offscreen pause: stop rendering entirely once scrolled away ----
    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(container);

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
      camera.position.y = mouseCurrent.y * 0.2 + 0.1;
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
      intersectionObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [threeReady, useFallback]);

  // Still deciding (first client render) — render nothing rather than
  // flashing the fallback then swapping to canvas.
  if (useFallback === null) return null;

  if (useFallback) {
    return <AuroraFallback />;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden dark:block"
    >
      <Script
        id="three-js-cdn"
        src={THREE_CDN_URL}
        strategy="afterInteractive"
        onReady={() => setThreeReady(true)}
      />
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

/**
 * Static, dependency-free fallback for `prefers-reduced-motion: reduce`,
 * missing WebGL support, or low-core-count devices — same green-hugging-
 * the-horizon-fading-to-red palette and framing, but a plain CSS radial
 * gradient instead of a running shader, so there's zero animation and
 * zero GPU cost.
 */
function AuroraFallback() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden dark:block"
      style={{
        background:
          "radial-gradient(ellipse 90% 45% at 50% 78%, rgba(60,255,110,0.22) 0%, transparent 65%), radial-gradient(ellipse 85% 55% at 50% 45%, rgba(210,15,75,0.16) 0%, transparent 70%)",
      }}
    />
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

  return `
    precision ${highQuality ? "highp" : "mediump"} float;

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
      p += uMouse * 0.03;

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

      // ---- Earth's limb, pushed further down so the aurora's colorful
      // tip stays low in the frame and the upper portion (behind the
      // hero heading/bio) is plain starfield ----
      float earthR = 1.7;
      vec2 earthCenter = vec2(0.0, -2.02);
      float distToEarth = length(p - earthCenter) - earthR; // > 0 above the surface

      // thin, bright atmospheric rim right at the horizon line — the
      // blue/white glow seen edge-on from orbit
      float limbRim = smoothstep(0.035, 0.0, abs(distToEarth));
      col += vec3(0.65, 0.82, 1.0) * limbRim * 0.9;

      // broader, softer cyan/blue atmospheric scattering a bit further out
      float limbGlow = smoothstep(0.22, 0.0, abs(distToEarth));
      col += vec3(0.15, 0.42, 0.7) * limbGlow * 0.3;

      // dark planet silhouette below the limb
      float planetMask = smoothstep(0.015, -0.02, distToEarth);
      vec3 planetColor = vec3(0.01, 0.02, 0.035);
      col = mix(col, planetColor, planetMask);

      // ---- aurora: bright filamentary green curtain hugging the limb,
      // fading into a softer red/crimson glow higher up — the two-color
      // structure seen in real ISS aurora photography ----
      float h = max(distToEarth, 0.0); // height above the horizon, 0 at the limb

      // low-frequency "height field" — how far up the green curtain
      // reaches at each position along the limb, drifting slowly over time
      float curtainProfile = fbm(vec2(p.x * 1.6, uTime * 0.02));
      float curtainTop = 0.10 + curtainProfile * 0.05;

      // compresses the whole aurora envelope (green + red band thresholds
      // below) toward the horizon, independent of curtainTop's own
      // definition — used to keep the entire glow, including its faint
      // upper red haze, well clear of the hero copy above it
      float hEnv = h * 3.4;

      // fine vertical ray striations ("fingers" of light), gently warped
      // so they drift and curl rather than sitting static — slow, lazy
      // motion rather than an active flicker
      float rayWarp = sin(h * 3.0 + uTime * 0.08) * 0.3
        + fbm(vec2(p.x * 1.1, uTime * 0.016)) * 2.0;
      float rays = fbm(vec2(p.x * ${(highQuality ? 26.0 : 13.0).toFixed(
        1
      )} + rayWarp, uTime * 0.06));
      rays = smoothstep(-0.1, 0.55, rays);

      // green: brightest right at the limb, tapering out toward
      // curtainTop, textured by the ray striations
      float greenFalloff = 1.0 - smoothstep(0.0, curtainTop, hEnv);
      float green = greenFalloff * mix(0.3, 1.0, rays);
      vec3 greenColor = vec3(0.32, 1.0, 0.28);

      // red/crimson: sits above the green, soft and diffuse (no fine
      // rays) — the classic high-altitude oxygen emission line. Kept
      // fairly compact so it fades to black well before the top of the
      // frame, rather than washing out the whole sky.
      // remapped to [0,1] so it only ever *adds* to the fade-out edge —
      // letting it go negative could push that edge below the fade-in
      // edge below, which is undefined for smoothstep and produced a
      // runaway bright spike at certain x positions
      float redProfile = fbm(vec2(p.x * 0.9, uTime * 0.01 + 40.0)) * 0.5 + 0.5;
      float redBand = smoothstep(0.0, curtainTop * 0.5, hEnv)
        * (1.0 - smoothstep(curtainTop * 0.8, curtainTop * 1.3 + redProfile * 0.15, hEnv));
      vec3 redColor = vec3(0.8, 0.05, 0.28);

      vec3 auroraColor = greenColor * green + redColor * redBand * 0.45;
      col += auroraColor * (1.0 - planetMask);

      // gentle vignette so the frame edges recede into the dark
      float vig = smoothstep(1.15, 0.2, length(p));
      col *= mix(0.6, 1.0, vig);

      gl_FragColor = vec4(col, 1.0);
    }
  `;
}
