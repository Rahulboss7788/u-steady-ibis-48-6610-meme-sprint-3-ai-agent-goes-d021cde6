// Meme Sprint 3: AI Agent Goes Rogue — entrypoint (Node 22, standard library only).
//
// Writes the meme image to the output directory. The image is shipped in
// this repository as meme.png; the program simply copies it, so it needs no
// network and every run produces byte-identical output.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
copyFileSync(join(here, "meme.png"), join(outDir, "entry.png"));

// Read-back self-check: the written file must be a whole PNG within the gate.
const written = readFileSync(join(outDir, "entry.png"));
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!written.subarray(0, 8).equals(pngSignature)) throw new Error("entry.png is not a PNG");
if (written.length > 1048576) throw new Error("entry.png is over 1 MiB");
const width = written.readUInt32BE(16);
const height = written.readUInt32BE(20);
if (width > 1024 || height > 1024) throw new Error("entry.png is over 1024x1024");
console.log(`Wrote entry.png to ${outDir} (${width}x${height}, ${written.length} bytes, self-check passed)`);
