import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const MEDIA_RE = /^\d{2}\.(jpe?g|png|webp|mp4|mov|webm|m4v)$/i;

export function listTravelMedia(slug: string) {
  const dir = path.join(process.cwd(), "public/travel", slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => MEDIA_RE.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => `/travel/${slug}/${name}`);
}

export function withMediaVersions(urls: string[]) {
  return urls.map((url) => {
    const pathname = url.split("?")[0];
    const filePath = path.join(process.cwd(), "public", pathname);
    try {
      const { size, mtimeMs } = fs.statSync(filePath);
      const version = createHash("sha1")
        .update(`${pathname}:${size}:${mtimeMs}`)
        .digest("hex")
        .slice(0, 10);
      return `${pathname}?v=${version}`;
    } catch {
      return pathname;
    }
  });
}
