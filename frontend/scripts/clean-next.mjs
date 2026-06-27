import { rmSync } from "node:fs";
import { join } from "node:path";

const nextDir = join(process.cwd(), ".next");

try {
  rmSync(nextDir, { recursive: true, force: true });
  console.log("[daedalus] cleared .next cache");
} catch (error) {
  console.warn("[daedalus] could not clear .next cache", error);
}
