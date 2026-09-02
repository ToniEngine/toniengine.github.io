// Copies the standalone GET 323 Quiz Rush game (its own repo in ./kahoot) into
// public/kahoot/, which Vite ships verbatim to dist/kahoot/. Run after editing
// the game so the portfolio copy stays in step: npm run sync:kahoot
import { cp, rm, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "kahoot");
const target = path.join(root, "public", "kahoot");

// Only the files the browser needs: no .git, tests, PDF source or package.json.
const assets = ["index.html", ".nojekyll", "css", "js"];

try {
  await access(source);
} catch {
  console.log(`No ./kahoot checkout found - keeping public/kahoot as is.`);
  process.exit(0);
}

await rm(target, { recursive: true, force: true });

for (const asset of assets) {
  await cp(path.join(source, asset), path.join(target, asset), { recursive: true });
}

console.log(`Synced ${assets.join(", ")} -> public/kahoot/`);
