import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

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
