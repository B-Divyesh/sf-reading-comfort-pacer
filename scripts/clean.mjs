import { rm } from "node:fs/promises";
import { resolve } from "node:path";

for (const directory of ["dist", ".output"]) {
  await rm(resolve(process.cwd(), directory), { recursive: true, force: true });
}
