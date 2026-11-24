#!/usr/bin/env node
// Adds one week of auction house prices to the site.
//
//   node scripts/add-market-week.js <pasted-table.txt> <YYYY-MM-DD>
//
// The text file is the "Prices" table copied from the Auction houses page of the KCDRoleplay
// account site (tab separated: Good, Cheapest now, Sold 7 days, On sale, Wanted at, Instant sale).
// It does two things:
//   1. stores the whole week in assets/market-history.js (the Market page's data). Running it
//      again for the same date replaces that week.
//   2. refreshes the suggested prices in assets/market.js from that week's 7-day averages, for the
//      materials already listed there, but only when the date is the newest one.
// Then it prints what changed so the numbers can be checked before committing.
"use strict";
const fs = require("fs"), path = require("path"), root = path.join(__dirname, "..");
const [file, date] = process.argv.slice(2);
if (!file || !/^\d{4}-\d{2}-\d{2}$/.test(date || "")) {
  console.error("Usage: node scripts/add-market-week.js <pasted-table.txt> <YYYY-MM-DD>");
  process.exit(1);
}
const HIST = path.join(root, "assets/market-history.js"), MKT = path.join(root, "assets/market.js");
const readObj = (f, name) => { const s = fs.readFileSync(f, "utf8"), i = s.indexOf("const " + name + "="), j = s.lastIndexOf(";"); return { head: s.slice(0, i), obj: JSON.parse(s.slice(i + name.length + 7, j)) }; };

const H = readObj(HIST, "MARKET_HISTORY"), hist = H.obj;
const num = x => { x = String(x || "").replace(/gr\.?/g, "").replace(/,/g, "").trim(); if (!x || x === "-") return null; const v = parseFloat(x); return isNaN(v) ? null : v; };
const g = {}; let n = 0;
for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
  const c = line.split("\t").map(s => s.trim());
  if (c.length < 6 || /^good$/i.test(c[0]) || !c[0]) continue;
  const name = hist.alias[c[0]] || c[0];
  const [avg, sold] = c[2] === "-" ? [null, 0] : c[2].split("·").map(num);
  const [onSale, houses] = c[3] === "-" ? [0, 0] : [num(c[3].split("·")[0]), num((c[3].split("·")[1] || "").replace(/houses?/, ""))];
  const row = [num(c[1]), avg, sold || 0, onSale || 0, houses || 0, num(c[4]), num(c[5])];
  // the same good can appear under two names (for example a German one): keep the busier row
  if (!g[name] || (g[name][2] || 0) < row[2]) g[name] = row;
  n++;
}
if (!n) { console.error("No rows found. Copy the whole Prices table from the Auction houses page into the file."); process.exit(1); }
hist.weeks = hist.weeks.filter(w => w.date !== date).concat([{ date, g }]).sort((a, b) => a.date.localeCompare(b.date));
fs.writeFileSync(HIST, H.head + "const MARKET_HISTORY=" + JSON.stringify(hist) + ";\n");
console.log(`Stored ${Object.keys(g).length} goods for ${date} (${hist.weeks.length} weeks in the history).`);

// Refresh suggested prices from the newest week
if (hist.weeks[hist.weeks.length - 1].date !== date) { console.log("Not the newest week, so assets/market.js was left alone."); process.exit(0); }
const ctx = {}; new Function("ctx", fs.readFileSync(path.join(root, "assets/recipes.js"), "utf8") + ";ctx.RAW=RAW;ctx.INT=INT")(ctx);
const byName = {}; for (const k in ctx.RAW) byName[ctx.RAW[k].toLowerCase()] = k;
for (const k in ctx.INT) byName[ctx.INT[k][0].toLowerCase()] = byName[ctx.INT[k][0].toLowerCase()] || k;
const idOf = nm => hist.ids[nm] || ((nm === nm.toLowerCase() || !g[nm.toLowerCase()]) ? byName[nm.toLowerCase()] : null);
const fromWeek = {}; for (const nm in g) { const id = idOf(nm); if (id && g[nm][1] != null) fromWeek[id] = g[nm][1]; }
const ms = fs.readFileSync(MKT, "utf8"), i = ms.indexOf("const MARKET=");
const old = {}; new Function("o", ms.slice(i) + ";o.M=MARKET")(old);
const p = {}, changes = [], missing = [];
for (const id of Object.keys(old.M.p)) {
  if (fromWeek[id] != null) { p[id] = fromWeek[id]; if (fromWeek[id] !== old.M.p[id]) changes.push(`${id}: ${old.M.p[id]} → ${fromWeek[id]}`); }
  else { p[id] = old.M.p[id]; missing.push(id); }
}
const body = "const MARKET={date:" + JSON.stringify(date) + ",src:" + JSON.stringify(old.M.src) + ",p:{\n" +
  Object.entries(p).map(([k, v]) => (/^[A-Za-z_]\w*$/.test(k) ? k : JSON.stringify(k)) + ":" + v).join(",").replace(/(.{1,110}(,|$))/g, "$1\n").trim() + "}};\n";
fs.writeFileSync(MKT, ms.slice(0, i) + body);
console.log(`Suggested prices: ${changes.length} changed${changes.length ? ":\n  " + changes.join("\n  ") : "."}`);
if (missing.length) console.log("Kept last week's price (no sales listed this week): " + missing.join(", "));
