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

const MEDIA_RE = /^\d{2}\.(jpe?g|png|webp|mp4|mov|webm)$/i;
const SLUG_RE = /^[a-z0-9-]+$/;
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".m4v"]);

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
    const nameMatch = headers.match(/filename\*?=(?:UTF-8''|")(.*?)(?:"|;|$)/i);
    const filename = nameMatch
      ? decodeURIComponent(nameMatch[1].replace(/"/g, ""))
      : "";
    if (filename) {
      files.push({ filename, buffer: buf.slice(headerEnd + 4, bodyEnd) });
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

function convertImage(src, dest) {
  const result = spawnSync(
    "sips",
    ["-s", "format", "jpeg", "-s", "formatOptions", "86", src, "--out", dest],
    { encoding: "utf8" }
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || `Could not convert ${path.basename(src)}`);
  }
}

function addUploads(slug, uploads) {
  const dir = path.join(TRAVEL, slug);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new Error("Unknown gallery");
  }
  let n = nextIndex(slug);
  for (const file of uploads) {
    const ext = path.extname(file.filename).toLowerCase();
    if (IMAGE_EXT.has(ext)) {
      const tmp = path.join(os.tmpdir(), `gallery-add-${Date.now()}-${n}${ext}`);
      fs.writeFileSync(tmp, file.buffer);
      try {
        convertImage(tmp, path.join(dir, `${String(n).padStart(2, "0")}.jpg`));
      } finally {
        fs.unlinkSync(tmp);
      }
    } else if (VIDEO_EXT.has(ext)) {
      const outExt = ext === ".m4v" ? ".mp4" : ext;
      fs.writeFileSync(
        path.join(dir, `${String(n).padStart(2, "0")}${outExt}`),
        file.buffer
      );
    } else {
      throw new Error(`Unsupported file: ${file.filename}`);
    }
    n += 1;
  }
  const files = listMedia(slug);
  patchGalleriesTs(slug, files);
  return files;
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
      const files = addUploads(addMatch[1], uploads);
      return sendJson(res, { ok: true, files });
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
