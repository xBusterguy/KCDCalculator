#!/usr/bin/env node
// Checks that the pages and the offline list agree, so a renamed or forgotten file is caught before it reaches the site.
//   1. every file the service worker saves for offline use (FILES in sw.js) exists
//   2. every local script and stylesheet a page loads is in that list
//   3. changelog.json is valid and newest-first
// Run: node scripts/check-site.js
const fs = require("fs"), path = require("path"), root = path.join(__dirname, "..");
const read = f => fs.readFileSync(path.join(root, f), "utf8");
const errors = [];
const m = read("sw.js").match(/const FILES = (\[[\s\S]*?\]);/);
if (!m) errors.push("sw.js: could not find the FILES list");
const files = m ? JSON.parse(m[1]) : [];
for (const f of files) if (f !== "./" && !fs.existsSync(path.join(root, f))) errors.push(`sw.js lists "${f}" but that file does not exist`);
const pages = fs.readdirSync(root).filter(f => f.endsWith(".html"));
for (const p of pages) {
  if (!files.includes(p)) errors.push(`${p} is not in the FILES list in sw.js, so it will not work offline`);
  const html = read(p), re = /<(?:script[^>]*\ssrc|link[^>]*rel="stylesheet"[^>]*\shref)="([^"]+)"/g;
  let r;
  while ((r = re.exec(html))) {
    const u = r[1];
    if (/^(https?:)?\/\//.test(u)) { errors.push(`${p} loads "${u}" from another site; keep everything local`); continue; }
    if (!fs.existsSync(path.join(root, u))) errors.push(`${p} loads "${u}" but that file does not exist`);
    else if (!files.includes(u)) errors.push(`${p} loads "${u}" but it is not in the FILES list in sw.js`);
  }
}
try {
  const c = JSON.parse(read("changelog.json")), e = c.entries;
  if (!Array.isArray(e) || !e.length) errors.push("changelog.json: no entries");
  else e.forEach((x, i) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(x.date) || !x.title || !Array.isArray(x.changes)) errors.push(`changelog.json: entry ${i + 1} needs a date (YYYY-MM-DD), a title and a list of changes`);
    if (i && x.date > e[i - 1].date) errors.push(`changelog.json: entry ${i + 1} (${x.date}) is newer than the one above it; newest goes first`);
  });
} catch (x) { errors.push("changelog.json is not valid JSON: " + x.message); }
if (errors.length) { console.error(errors.map(e => "✗ " + e).join("\n")); process.exit(1); }
console.log(`✓ ${pages.length} pages and ${files.length} offline files agree; changelog is valid.`);
