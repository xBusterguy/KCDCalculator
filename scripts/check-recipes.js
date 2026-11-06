#!/usr/bin/env node
// Checks assets/recipes.js for mistakes. Run with:  node scripts/check-recipes.js
// Exits with code 1 if anything is wrong, so GitHub Actions can block a bad change.
const fs = require("fs"), path = require("path"), vm = require("vm");

const file = path.join(__dirname, "..", "assets", "recipes.js");
const src = fs.readFileSync(file, "utf8");
const catSrc = fs.readFileSync(path.join(__dirname, "..", "assets", "categories.js"), "utf8");
const { RAW, INT, CR, DATA, CATS, catOf } = vm.runInNewContext(src + catSrc + ";({RAW,INT,CR,DATA,CATS,catOf})");

const errors = [], warnings = [];
const err = m => errors.push(m);
const RX = /\{(\w+)\}(\d+)|([A-Za-z])(\d+)/g;
const known = id => id in RAW || id in INT;
const used = new Set();

// 1. Materials and intermediate parts
for (const id in INT) {
  if (id in RAW) err(`Material id "${id}" exists in both the raw list and the intermediate list`);
  const v = INT[id];
  if (!Array.isArray(v) || v.length !== 4) { err(`Intermediate "${id}" must be [name, yield, {ingredients}, fee]`); continue; }
  const [nm, y, r, f] = v;
  if (!nm) err(`Intermediate "${id}" has no name`);
  if (!Number.isInteger(y) || y < 1) err(`Intermediate "${nm}": yield must be a whole number of at least 1`);
  if (!Number.isInteger(f) || f < 0) err(`Intermediate "${nm}": fee must be a whole number of 0 or more`);
  for (const k in r) {
    used.add(k);
    if (!known(k)) err(`Intermediate "${nm}" uses unknown material "${k}"`);
    if (!(r[k] > 0)) err(`Intermediate "${nm}": quantity of "${k}" must be above 0`);
  }
}
// no circular recipes
const state = {};
const visit = (id, trail) => {
  if (state[id] === 2 || !(id in INT)) return;
  if (state[id] === 1) { err(`Circular recipe: ${[...trail, id].join(" -> ")}`); return; }
  state[id] = 1;
  for (const k in INT[id][2]) visit(k, [...trail, id]);
  state[id] = 2;
};
Object.keys(INT).forEach(id => visit(id, []));

// 2. Recipe lines
const counts = {}, seen = new Set(), noCats = new Set(), catCount = {}, fallback = {};
let pieces = 0;
DATA.split("\n").forEach((line, i) => {
  const at = `Recipe line ${i + 1} (${line.slice(0, 50)}...)`;
  const p = line.split("|");
  if (p.length !== 6) return err(`${at}: expected 6 fields separated by |, found ${p.length}`);
  const [c, lv, names, y, ing, fee] = p;
  if (!(c in CR)) err(`${at}: unknown craft code "${c}"`);
  if (!/^\d+$/.test(lv) || +lv < 1 || +lv > 10) err(`${at}: level must be 1 to 10`);
  if (!/^\d+$/.test(y) || +y < 1) err(`${at}: yield must be a whole number of at least 1`);
  if (!/^\d+$/.test(fee)) err(`${at}: bench fee must be a whole number of 0 or more`);
  if (!ing) err(`${at}: no ingredients`);
  else {
    if (ing.replace(RX, "") !== "") err(`${at}: ingredients "${ing}" are not in the form letter+number or {word}number`);
    for (const m of ing.matchAll(RX)) {
      const id = m[1] || m[3], q = +(m[2] || m[4]);
      used.add(id);
      if (!known(id)) err(`${at}: unknown material "${id}"`);
      if (!(q > 0)) err(`${at}: quantity of "${id}" must be above 0`);
    }
  }
  names.split(";").forEach(n => {
    if (!n.trim()) return err(`${at}: empty piece name`);
    const key = `${c}|${lv}|${n}`;
    if (seen.has(key)) err(`${at}: duplicate piece "${n}" at level ${lv} in ${CR[c] || c}`);
    seen.add(key);
    counts[CR[c] || c] = (counts[CR[c] || c] || 0) + 1;
    if (CR[c]) { const k = CR[c]; if (!CATS[k]) noCats.add(k); else { const cat = catOf(k, n), last = CATS[k][CATS[k].length - 1][0]; (catCount[k] = catCount[k] || {})[cat] = (catCount[k][cat] || 0) + 1; if (cat === last) (fallback[k] = fallback[k] || []).push(n); } }
    pieces++;
  });
});

// 2b. Categories used by the crafting page (assets/categories.js)
for (const k of noCats) err(`assets/categories.js has no categories for the craft "${k}"`);
for (const k in fallback) if (fallback[k].length > 60) warnings.push(`${fallback[k].length} ${k} pieces fall in the catch-all category "${CATS[k][CATS[k].length - 1][0]}" (add a rule in assets/categories.js), e.g. ${fallback[k].slice(0, 4).join(", ")}`);

// 3. Materials nobody uses (warning only)
for (const id of [...Object.keys(RAW), ...Object.keys(INT)]) if (!used.has(id)) warnings.push(`Material "${id}" is defined but no recipe uses it`);

console.log(`Checked ${pieces} pieces in ${Object.keys(counts).length} crafts:`);
for (const [c, n] of Object.entries(counts)) console.log(`  ${c.padEnd(12)} ${n}`);
warnings.forEach(w => console.log("Warning: " + w));
if (errors.length) {
  console.error(`\n${errors.length} problem(s) found:`);
  errors.forEach(e => console.error(" - " + e));
  process.exit(1);
}
console.log("\nAll recipes look good.");
