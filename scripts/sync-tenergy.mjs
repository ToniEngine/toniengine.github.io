// Copies the standalone Tenergy Games app (its own repo in ./tenergy-games)
// into public/tenergy/, which Vite ships verbatim to dist/tenergy/. Run after
// editing the app so the portfolio copy stays in step: npm run sync:tenergy
import { cp, rm, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "tenergy-games");
const target = path.join(root, "public", "tenergy");

// Only the files the browser needs: no .git, tests, PDF source or package.json.
const assets = ["index.html", ".nojekyll", "css", "js"];

try {
  await access(source);
} catch {
  console.log("No ./tenergy-games checkout found - keeping public/tenergy as is.");
  process.exit(0);
}

await rm(target, { recursive: true, force: true });

for (const asset of assets) {
  await cp(path.join(source, asset), path.join(target, asset), { recursive: true });
}

console.log(`Synced ${assets.join(", ")} -> public/tenergy/`);
