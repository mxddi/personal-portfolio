import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const TRAVEL = path.join(ROOT, "public/travel");
const GALLERIES_TS = path.join(ROOT, "lib/data/travel-galleries.ts");
const INDEX = path.join(__dirname, "index.html");
const HOST = "127.0.0.1";
const PORT = 3333;

const MEDIA_RE = /^\d{2}\.(jpe?g|png|webp|mp4|mov|webm)$/i;
const SLUG_RE = /^[a-z0-9-]+$/;

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
  if (order.length !== current.length) {
    throw new Error("Order must include every current gallery file once.");
  }
  const currentSet = new Set(current);
  for (const name of order) {
    if (!currentSet.has(name) || !MEDIA_RE.test(name)) {
      throw new Error(`Unexpected file: ${name}`);
    }
  }
  if (new Set(order).size !== order.length) {
    throw new Error("Duplicate filenames in order.");
  }

  const tmp = order.map((name, i) => {
    const ext = path.extname(name).toLowerCase();
    const tmpName = `__reorder_${String(i + 1).padStart(2, "0")}${ext}`;
    fs.renameSync(path.join(dir, name), path.join(dir, tmpName));
    return tmpName;
  });

  const finalNames = tmp.map((name, i) => {
    const ext = path.extname(name);
    const finalName = `${String(i + 1).padStart(2, "0")}${ext}`;
    fs.renameSync(path.join(dir, name), path.join(dir, finalName));
    return finalName;
  });

  return finalNames;
}

function patchGalleriesTs(slug, files) {
  const ts = fs.readFileSync(GALLERIES_TS, "utf8");
  const allJpg = files.every((f) => /\.jpe?g$/i.test(f));
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

    const mediaMatch = url.pathname.match(
      /^\/media\/([a-z0-9-]+)\/(\d{2}\.[A-Za-z0-9]+)$/
    );
    if (req.method === "GET" && mediaMatch) {
      const filePath = path.join(TRAVEL, mediaMatch[1], mediaMatch[2]);
      if (!fs.existsSync(filePath)) return send(res, 404, "Not found");
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
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
