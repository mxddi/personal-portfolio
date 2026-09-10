import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec, spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const TRAVEL = path.join(ROOT, "public/travel");
const GALLERIES_TS = path.join(ROOT, "lib/data/travel-galleries.ts");
const INDEX = path.join(__dirname, "index.html");
const HOST = "127.0.0.1";
const PORT = 3333;

const MEDIA_RE = /^\d{2}\.(jpe?g|png|webp|mp4|mov|webm|m4v)$/i;
const SLUG_RE = /^[a-z0-9-]+$/;
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".m4v"]);
const HEIF_BRANDS = new Set([
  "heic",
  "heix",
  "hevc",
  "hevx",
  "mif1",
  "msf1",
  "heif",
  "heim",
  "heis",
]);
const ICLOUD_THUMB_RE = /_4_\d+_c\./i;
const MIN_PHOTO_EDGE = 640;

function listMedia(slug) {
  const dir = path.join(TRAVEL, slug);
  return fs
    .readdirSync(dir)
    .filter((name) => MEDIA_RE.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function loadLocations() {
  const src = fs.readFileSync(GALLERIES_TS, "utf8");
  const names = new Map(
    [...src.matchAll(/slug:\s*"([^"]+)",\s*location:\s*"([^"]+)"/g)].map(
      (m) => [m[1], m[2]]
    )
  );
  return fs
    .readdirSync(TRAVEL)
    .filter((slug) => {
      const dir = path.join(TRAVEL, slug);
      return fs.statSync(dir).isDirectory() && SLUG_RE.test(slug);
    })
    .map((slug) => ({
      slug,
      location: names.get(slug) ?? slug.replace(/-/g, " "),
      count: listMedia(slug).length,
    }))
    .sort((a, b) => a.location.localeCompare(b.location));
}

function reorderFiles(slug, order) {
  const dir = path.join(TRAVEL, slug);
  const current = listMedia(slug);
  const currentSet = new Set(current);
  for (const name of order) {
    if (!currentSet.has(name) || !MEDIA_RE.test(name)) {
      throw new Error(`Unexpected file: ${name}`);
    }
  }
  if (new Set(order).size !== order.length) {
    throw new Error("Duplicate filenames in order.");
  }

  const keep = new Set(order);
  for (const name of current) {
    if (!keep.has(name)) fs.unlinkSync(path.join(dir, name));
  }

  if (order.length === 0) return [];

  const tmp = order.map((name, i) => {
    const ext = path.extname(name).toLowerCase();
    const tmpName = `__reorder_${String(i + 1).padStart(2, "0")}${ext}`;
    fs.renameSync(path.join(dir, name), path.join(dir, tmpName));
    return tmpName;
  });

  return tmp.map((name, i) => {
    const ext = path.extname(name);
    const finalName = `${String(i + 1).padStart(2, "0")}${ext}`;
    fs.renameSync(path.join(dir, name), path.join(dir, finalName));
    return finalName;
  });
}

function patchGalleriesTs(slug, files) {
  const ts = fs.readFileSync(GALLERIES_TS, "utf8");
  const allJpg = files.length > 0 && files.every((f) => /\.jpe?g$/i.test(f));
  const replacement = allJpg
    ? `buildImages("${slug}", ${files.length})`
    : `[\n      ${files
        .map((f) => `"\/travel/${slug}/${f}"`)
        .join(",\n      ")}\n    ]`;
  const re = new RegExp(
    `(slug:\\s*"${slug}",\\s*location:\\s*"[^"]+",\\s*images:\\s*)(?:buildImages\\([^)]+\\)|\\[[\\s\\S]*?\\])`
  );
  if (!re.test(ts)) {
    throw new Error(`Could not find ${slug} in travel-galleries.ts`);
  }
  fs.writeFileSync(GALLERIES_TS, ts.replace(re, `$1${replacement}`));
}

function parseMultipart(buf, contentType) {
  const m = String(contentType || "").match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!m) throw new Error("Missing multipart boundary");
  const boundary = m[1] || m[2];
  const sep = Buffer.from(`--${boundary}`);
  const files = [];
  let start = buf.indexOf(sep);
  while (start !== -1) {
    let i = start + sep.length;
    if (buf.slice(i, i + 2).toString() === "--") break;
    if (buf[i] === 13 && buf[i + 1] === 10) i += 2;
    const headerEnd = buf.indexOf("\r\n\r\n", i);
    if (headerEnd === -1) break;
    const headers = buf.slice(i, headerEnd).toString("utf8");
    const next = buf.indexOf(sep, headerEnd + 4);
    let bodyEnd = next === -1 ? buf.length : next;
    if (bodyEnd >= 2 && buf[bodyEnd - 2] === 13 && buf[bodyEnd - 1] === 10) {
      bodyEnd -= 2;
    }
    const filename = parseFilename(headers);
    const mime = parsePartMime(headers);
    const buffer = buf.slice(headerEnd + 4, bodyEnd);
    if (filename || buffer.length) {
      files.push({ filename, mime, buffer });
    }
    start = next;
  }
  return files;
}

function nextIndex(slug) {
  const files = listMedia(slug);
  if (!files.length) return 1;
  return Math.max(...files.map((f) => parseInt(f, 10))) + 1;
}

function parseFilename(headers) {
  const star = headers.match(/filename\*\s*=\s*UTF-8''([^;\r\n]+)/i);
  if (star) return decodeURIComponent(star[1].trim().replace(/"/g, ""));
  const quoted = headers.match(/filename\s*=\s*"((?:\\.|[^"\\])*)"/i);
  if (quoted) return quoted[1].replace(/\\"/g, '"');
  const plain = headers.match(/filename\s*=\s*([^;\r\n]+)/i);
  if (plain) return plain[1].trim().replace(/"/g, "");
  return "";
}

function parsePartMime(headers) {
  const m = headers.match(/Content-Type:\s*([^;\r\n]+)/i);
  return m ? m[1].trim() : "";
}

function sniffKind(buf, filename, mime) {
  const ext = path.extname(filename || "").toLowerCase();
  const mimeL = (mime || "").toLowerCase();

  if (buf.length >= 12 && buf.slice(4, 8).toString("ascii") === "ftyp") {
    const brand = buf
      .slice(8, 12)
      .toString("ascii")
      .replace(/\0/g, "")
      .trim()
      .toLowerCase();
    if (HEIF_BRANDS.has(brand)) return { kind: "image", ext: ".heic" };
    return { kind: "video", ext: ext === ".mov" ? ".mov" : ".mp4" };
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8) {
    return { kind: "image", ext: ".jpg" };
  }
  if (
    buf.length >= 12 &&
    buf.slice(0, 4).toString("ascii") === "RIFF" &&
    buf.slice(8, 12).toString("ascii") === "WEBP"
  ) {
    return { kind: "image", ext: ".webp" };
  }
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf.slice(1, 4).toString("ascii") === "PNG"
  ) {
    return { kind: "image", ext: ".png" };
  }
  if (buf.length >= 4 && buf[0] === 0x1a && buf[1] === 0x45) {
    return { kind: "video", ext: ".webm" };
  }

  if (
    mimeL.startsWith("video/") ||
    mimeL.includes("quicktime") ||
    VIDEO_EXT.has(ext)
  ) {
    if (ext === ".webm" || mimeL.includes("webm")) {
      return { kind: "video", ext: ".webm" };
    }
    if (ext === ".mov" || mimeL.includes("quicktime")) {
      return { kind: "video", ext: ".mov" };
    }
    return { kind: "video", ext: ".mp4" };
  }
  if (mimeL.startsWith("image/") || IMAGE_EXT.has(ext)) {
    return { kind: "image", ext: IMAGE_EXT.has(ext) ? ext : ".jpg" };
  }
  return null;
}

function imageSize(filePath) {
  const result = spawnSync(
    "sips",
    ["-g", "pixelWidth", "-g", "pixelHeight", filePath],
    { encoding: "utf8" }
  );
  const width = Number((result.stdout.match(/pixelWidth:\s+(\d+)/) || [])[1]);
  const height = Number((result.stdout.match(/pixelHeight:\s+(\d+)/) || [])[1]);
  return { width, height };
}

function convertImage(src, dest) {
  const result = spawnSync(
    "sips",
    ["-s", "format", "jpeg", "-s", "formatOptions", "95", src, "--out", dest],
    { encoding: "utf8" }
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || `Could not convert ${path.basename(src)}`);
  }
}

function writeVideo(buffer, srcExt, destBase) {
  const inExt = VIDEO_EXT.has(srcExt) ? srcExt : ".mov";
  if (inExt === ".mp4" || inExt === ".webm") {
    const dest = `${destBase}${inExt}`;
    fs.writeFileSync(dest, buffer);
    return path.basename(dest);
  }

  const tmp = path.join(os.tmpdir(), `gallery-vid-${Date.now()}${inExt}`);
  fs.writeFileSync(tmp, buffer);
  const dest = `${destBase}.mp4`;
  const converted = spawnSync(
    "avconvert",
    [
      "--source",
      tmp,
      "--output",
      dest,
      "--preset",
      "PresetHighestQuality",
      "--replace",
    ],
    { encoding: "utf8" }
  );
  try {
    fs.unlinkSync(tmp);
  } catch {
    /* ignore */
  }
  if (converted.status === 0 && fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    return path.basename(dest);
  }
  const fallback = `${destBase}${inExt}`;
  fs.writeFileSync(fallback, buffer);
  return path.basename(fallback);
}

function addUploads(slug, uploads) {
  const dir = path.join(TRAVEL, slug);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new Error("Unknown gallery");
  }
  let n = nextIndex(slug);
  const skipped = [];
  for (const file of uploads) {
    const label = file.filename || "untitled";
    if (ICLOUD_THUMB_RE.test(label)) {
      skipped.push(`${label} (iCloud thumbnail)`);
      continue;
    }
    const kind = sniffKind(file.buffer, file.filename, file.mime);
    if (!kind) {
      skipped.push(`${label} (unsupported)`);
      continue;
    }
    const destBase = path.join(dir, String(n).padStart(2, "0"));
    if (kind.kind === "video") {
      writeVideo(file.buffer, kind.ext, destBase);
    } else {
      const tmp = path.join(
        os.tmpdir(),
        `gallery-add-${Date.now()}-${n}${kind.ext}`
      );
      fs.writeFileSync(tmp, file.buffer);
      const dest = `${destBase}.jpg`;
      try {
        convertImage(tmp, dest);
        const { width, height } = imageSize(dest);
        if (Math.max(width, height) < MIN_PHOTO_EDGE) {
          fs.unlinkSync(dest);
          skipped.push(`${label} (too small to use at full quality)`);
          continue;
        }
      } finally {
        try {
          fs.unlinkSync(tmp);
        } catch {
          /* ignore */
        }
      }
    }
    n += 1;
  }
  const files = listMedia(slug);
  patchGalleriesTs(slug, files);
  return { files, skipped };
}

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

function sendJson(res, data) {
  send(res, 200, JSON.stringify(data), "application/json; charset=utf-8");
}

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".m4v": "video/mp4",
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${HOST}:${PORT}`);

    if (req.method === "GET" && url.pathname === "/") {
      return send(res, 200, fs.readFileSync(INDEX), TYPES[".html"]);
    }

    if (req.method === "GET" && url.pathname === "/api/locations") {
      return sendJson(res, loadLocations());
    }

    const galleryMatch = url.pathname.match(/^\/api\/gallery\/([a-z0-9-]+)$/);
    if (req.method === "GET" && galleryMatch) {
      return sendJson(res, listMedia(galleryMatch[1]));
    }

    const reorderMatch = url.pathname.match(
      /^\/api\/gallery\/([a-z0-9-]+)\/reorder$/
    );
    if (req.method === "POST" && reorderMatch) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const { order } = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      const files = reorderFiles(reorderMatch[1], order);
      patchGalleriesTs(reorderMatch[1], files);
      return sendJson(res, { ok: true, files });
    }

    const addMatch = url.pathname.match(/^\/api\/gallery\/([a-z0-9-]+)\/add$/);
    if (req.method === "POST" && addMatch) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const uploads = parseMultipart(
        Buffer.concat(chunks),
        req.headers["content-type"]
      );
      if (!uploads.length) throw new Error("No files received");
      const { files, skipped } = addUploads(addMatch[1], uploads);
      return sendJson(res, { ok: true, files, skipped });
    }

    const mediaMatch = url.pathname.match(
      /^\/media\/([a-z0-9-]+)\/(\d{2}\.[A-Za-z0-9]+)$/
    );
    if (req.method === "GET" && mediaMatch) {
      const filePath = path.join(TRAVEL, mediaMatch[1], mediaMatch[2]);
      if (!fs.existsSync(filePath)) return send(res, 404, "Not found");
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        "Content-Type": TYPES[ext] || "application/octet-stream",
      });
      return fs.createReadStream(filePath).pipe(res);
    }

    send(res, 404, "Not found");
  } catch (err) {
    send(res, 500, err instanceof Error ? err.message : "Error");
  }
});

server.listen(PORT, HOST, () => {
  const href = `http://${HOST}:${PORT}`;
  console.log(`Gallery sorter (local only): ${href}`);
  exec(`open "${href}"`);
});
