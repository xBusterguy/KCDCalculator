#!/usr/bin/env node
// Compares assets/recipes.js with the recipes page on the KCD Roleplay wiki.
//
//   node scripts/wiki-sync.js                    report only (writes wiki-report.md)
//   node scripts/wiki-sync.js --apply            also rewrite assets/recipes.js
//   node scripts/wiki-sync.js --file page.html   read a saved page (.html or .txt) instead of the web
//
// Exit codes: 0 = already up to date, 10 = differences found, 2 = the page could not be read.
// A craft is only rewritten when it was read cleanly: piece counts must match the numbers the
// wiki prints ("Level 3 - 11 pieces") and every ingredient name must be known.
const fs = require("fs"), path = require("path"), vm = require("vm");

const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(n); return i < 0 ? null : (args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true); };
const URL_ = opt("--url") || "https://wiki.kcdroleplay.com/recipes/";
const FILE = opt("--file"), REPORT = opt("--report") || "wiki-report.md", APPLY = !!opt("--apply");
const RECIPES = path.resolve(opt("--recipes") || path.join(__dirname, "..", "assets", "recipes.js"));

// ---------- read the page as plain text ----------
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", times: "×", rsquo: "’", lsquo: "‘", ndash: "–", mdash: "—", hellip: "…" };
// Repeat a replacement until nothing changes, so removed pieces cannot join up into new tags
const again = (h, rx, to) => { let p; do { p = h; h = h.replace(rx, to); } while (h !== p); return h; };
function htmlToText(h) {
  h = again(h, /<(script|style|noscript)[\s\S]*?<\/\1>/gi, "");
  h = again(h, /<!--[\s\S]*?-->/g, "");
  h = h.replace(/<\/t[dh]\s*>/gi, "\t")
    .replace(/<br\s*\/?>|<\/(tr|p|div|h[1-6]|li|summary|section|article|details|table|thead|tbody)\s*>/gi, "\n");
  h = again(h, /<[^>]*>/g, "");
  // decode entities last and in one pass, so "&lt;" is never turned into a tag and stripped again
  h = h.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : +e.slice(1)) : (ENT[e.toLowerCase()] ?? m));
  return h;
}
async function readPage() {
  if (FILE) { const t = fs.readFileSync(FILE, "utf8"); return /\.txt$/i.test(FILE) ? t : htmlToText(t); }
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 30000);
  const res = await fetch(URL_, { signal: ctl.signal, headers: { "User-Agent": "KCDCalculator-recipe-check (+https://github.com/xBusterguy/KCDCalculator)" } });
  clearTimeout(timer);
  if (!res.ok) throw new Error("The wiki answered with HTTP " + res.status);
  return htmlToText(await res.text());
}

// ---------- current data ----------
const ctx = vm.runInNewContext(fs.readFileSync(RECIPES, "utf8") + ";({RAW,INT,RAW2,CR,DATA,RECIPES_UPDATED})");
const { RAW, INT, RAW2, CR, DATA } = ctx;
const CODE = Object.fromEntries(Object.entries(CR).map(([k, v]) => [v.toLowerCase(), k]));
const nn = s => s.toLowerCase().replace(/[’'‘.]/g, "").replace(/\s+/g, " ").trim();
const NAME = {};
for (const k in RAW) NAME[nn(RAW[k])] = k;
for (const k in RAW2) NAME[nn(RAW2[k])] = k;
for (const k in INT) NAME[nn(INT[k][0])] = k;
// wiki sometimes uses the singular or plural of a name, so try both
const ALIAS = { hare: "hare meat", "ordinary sword guard": "sword guard (ordinary/straight)", "straight sword guard": "sword guard (ordinary/straight)" };   // names the wiki shortens
const lookup = s => { const n = ALIAS[nn(s)] || nn(s); return NAME[n] || NAME[n + "s"] || NAME[n + "es"] || NAME[n.replace(/es$/, "")] || NAME[n.replace(/s$/, "")]; };
const RX = /\{(\w+)\}(\d+)|([A-Za-z])(\d+)/g;
const enc = r => Object.entries(r).map(([k, q]) => (k.length > 1 ? "{" + k + "}" : k) + q).join("");
const canon = r => Object.keys(r).sort().map(k => k + ":" + r[k]).join(",");
const nk = s => s.replace(/['‘’]/g, "’").replace(/[“”]/g, '"').replace(/\.$/, "").trim();
const partNames = new Set([...Object.values(INT).map(v => nn(v[0])), ...Object.keys(ALIAS).filter(k => INT[NAME[ALIAS[k]]])]);   // parts the site stores separately (INT), so they are not listed as pieces

const site = {};   // craft code -> [{level,name,yield,r,fee}]
const dataLines = DATA.split("\n");
for (const l of dataLines) {
  const [c, lv, ns, y, i, f] = l.split("|"), r = {};
  i.replace(RX, (m, w, a, k, b) => (r[w || k] = +(a || b), m));
  (site[c] = site[c] || []).push(...ns.split(";").map(n => ({ level: +lv, name: n, yield: +y, r, fee: +f })));
}

// ---------- parse the wiki text ----------
function parseWiki(text) {
  const lines = text.split("\n").map(s => s.replace(/ /g, " ").trim()).filter(Boolean);
  const out = {}, problems = [], unknown = new Set();
  let cur = null, level = 0, cols = null;
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i], low = ln.toLowerCase();
    // The craft heading is either two lines ("Smithing" / "at a smith's forge - 129 pieces")
    // or one line ("Smithing at a smith's forge - 129 pieces"), depending on how the page is built.
    const hdr = lines[i + 1] && lines[i + 1].match(/^at an? .+ - (\d+) pieces?$/i), one = ln.match(/^(.+?)\s+at an? .+ - (\d+) pieces?$/i);
    if (CODE[low] && hdr) { cur = out[CODE[low]] = { name: ln, declared: +hdr[1], pieces: [], levels: {}, parts: [] }; level = 0; cols = null; i++; continue; }
    if (one && CODE[one[1].toLowerCase()]) { const c = CODE[one[1].toLowerCase()]; cur = out[c] = { name: one[1], declared: +one[2], pieces: [], levels: {}, parts: [] }; level = 0; cols = null; continue; }
    if (!cur) continue;
    let m;
    if ((m = ln.match(/^Its parts:\s*(.*)$/i))) {
      for (const p of m[1].replace(/\.$/, "").split(/;\s*/)) {
        const q = p.match(/^(.+?)\s*×\s*(\d+)\s+from level (\d+)\s*\((.*)\)$/i);
        if (q) cur.parts.push({ name: q[1], yield: +q[2], level: +q[3], needs: q[4] });
      }
      continue;
    }
    if ((m = ln.match(/^Level (\d+) - (\d+) pieces?$/i))) { level = +m[1]; cur.levels[level] = +m[2]; continue; }
    const cells = ln.split("\t").map(s => s.trim());
    if (/^(Level|Makes|Piece)$/i.test(cells[0]) && cells.some(c => /^Needs$/i.test(c))) {   // header row: remember where each column is
      cols = { name: cells.findIndex(c => /^(Makes|Piece)$/i.test(c)), needs: cells.findIndex(c => /^Needs$/i.test(c)), level: cells.findIndex(c => /^Level$/i.test(c)) };
      continue;
    }
    if (!cols || cells.length <= cols.needs) continue;
    let lv = level;
    if (cols.level >= 0) { lv = +cells[cols.level]; if (!(lv > 0)) continue; cur.levelFromColumn = true; }
    if (!lv) continue;
    const raw = cells[cols.name].replace(/\s+\d+ variants?$/i, "");
    const mk = raw.match(/^(.*?)\s*×\s*(\d+)$/), nm = nk(mk ? mk[1] : raw), y = mk ? +mk[2] : 1;
    let needs = cells[cols.needs], fee = 0;
    const fm = needs.match(/(?:^|\s)\+\s*(\d+)\s*gr\.?$/i);
    if (fm) { fee = +fm[1]; needs = needs.slice(0, fm.index).trim(); }
    if (/^\w+:\w+/.test(nm)) continue;   // internal ids such as "jobtool:..." are not pieces
    const r = {};
    let bad = false;
    for (const part of needs.split(/,\s*/).filter(Boolean)) {
      const q = part.match(/^(\d+)\s+(.+)$/), id = q && lookup(q[2]);
      if (id) r[id] = (r[id] || 0) + +q[1]; else { bad = true; unknown.add(q ? q[2].trim() : part); }
    }
    cur.pieces.push({ level: lv, name: nm, yield: y, r, fee, bad, isPart: partNames.has(nn(nm.replace(/\s*\((smithing|armouring|tailoring)\)$/i, ""))) });
  }
  for (const c in out) {
    const k = out[c];
    if (k.pieces.length !== k.declared) problems.push(`${k.name}: the wiki says ${k.declared} pieces but ${k.pieces.length} were read`);
    for (const lv in k.levels) { const n = k.pieces.filter(p => p.level === +lv).length; if (n !== k.levels[lv]) problems.push(`${k.name} level ${lv}: the wiki says ${k.levels[lv]} pieces but ${n} were read`); }
    if (k.pieces.some(p => p.bad)) problems.push(`${k.name}: some ingredient names are not in the material list`);
  }
  return { out, problems, unknown };
}

// ---------- compare ----------
function compare(code, wp) {
  const key = p => p.level + "|" + nk(p.name);
  const A = new Map((site[code] || []).map(p => [key(p), p])), B = new Map(wp.map(p => [key(p), p]));
  const added = [], removed = [], changed = [];
  for (const [k, p] of B) {
    const o = A.get(k);
    if (!o) { added.push(p); continue; }
    if (o.yield !== p.yield || o.fee !== p.fee || canon(o.r) !== canon(p.r)) changed.push({ o, p });
  }
  for (const [k, o] of A) if (!B.has(k)) removed.push(o);
  return { added, removed, changed };
}
const fmt = r => Object.entries(r).map(([k, q]) => q + " " + ((RAW[k] || RAW2[k] || (INT[k] && INT[k][0]) || k).toLowerCase())).join(", ") || "nothing";
const desc = p => `${p.name} (level ${p.level}): ${p.yield > 1 ? "makes " + p.yield + "; " : ""}${fmt(p.r)}${p.fee ? " + " + p.fee + " gr." : ""}`;

(async () => {
  let text;
  try { text = await readPage(); } catch (e) { return fail("Could not download the wiki page: " + e.message); }
  try { fs.writeFileSync("wiki-page.txt", text); } catch (e) {}
  const { out, problems, unknown } = parseWiki(text);
  if (!Object.keys(out).length) {
    const sample = text.split("\n").map(s => s.trim()).filter(s => /pieces|^Level \d|Makes|Needs|bench|forge/i.test(s)).slice(0, 12);
    return fail("The page was downloaded but no recipes could be found in it. The wiki may now load recipes with JavaScript, or its layout changed.\n\n"
      + `Page text length: ${text.length} characters, ${text.split("\n").filter(s => s.trim()).length} non-empty lines.\n\n`
      + (sample.length ? "Lines that looked related (first 12):\n\n```\n" + sample.join("\n") + "\n```\n" : "No lines mentioning pieces, levels, Makes or Needs were found.\n")
      + "\nThe full text the script saw is attached to the workflow run as `wiki-page.txt`.");
  }

  const rep = [], newData = {};
  let total = 0, applied = [];
  const notFound = Object.keys(site).filter(c => !out[c]).map(c => CR[c]);
  for (const code of Object.keys(site)) {
    if (!out[code]) continue;
    const k = out[code], clean = !k.pieces.some(p => p.bad) && !problems.some(p => p.startsWith(k.name + ":") || p.startsWith(k.name + " level"));
    const onSite = new Set((site[code] || []).map(p => p.level + "|" + nk(p.name))), usable = k.pieces.filter(p => !p.isPart || onSite.has(p.level + "|" + nk(p.name))), d = compare(code, usable), n = d.added.length + d.removed.length + d.changed.length;
    if (!n) continue;
    total += n;
    rep.push(`### ${CR[code]} (${n} difference${n > 1 ? "s" : ""})${clean ? "" : " – NOT applied, see warnings"}`);
    for (const p of d.added) rep.push(`- **New:** ${desc(p)}`);
    for (const p of d.removed) rep.push(`- **Gone from the wiki:** ${desc(p)}`);
    for (const { o, p } of d.changed) rep.push(`- **Changed:** ${p.name} (level ${p.level})\n  - was: ${o.yield > 1 ? "makes " + o.yield + "; " : ""}${fmt(o.r)}${o.fee ? " + " + o.fee + " gr." : ""}\n  - now: ${p.yield > 1 ? "makes " + p.yield + "; " : ""}${fmt(p.r)}${p.fee ? " + " + p.fee + " gr." : ""}`);
    rep.push("");
    if (clean) { newData[code] = d; applied.push(CR[code]); }
  }

  // intermediate parts: report only
  const partNotes = [];
  for (const code in out) for (const p of out[code].parts) {
    const id = lookup(p.name);
    if (!id) continue;
  }
  const seenPart = {};
  for (const code in out) for (const p of out[code].parts) { const id = lookup(p.name); if (id && INT[id]) (seenPart[id] = seenPart[id] || []).push(p); }
  for (const id in seenPart) {
    const [nm, y, r] = INT[id];
    const match = seenPart[id].some(p => p.yield === y && p.needs.split(/,\s*/).every(s => { const q = s.match(/^(\d+)\s+(.+)$/); return q && r[lookup(q[2])] === +q[1]; }) && p.needs.split(/,\s*/).length === Object.keys(r).length);
    if (!match) partNotes.push(`- ${nm}: the site uses ×${y} from ${fmt(r)}; the wiki lists ${seenPart[id].map(p => "×" + p.yield + " from " + p.needs).join(" or ")}`);
  }

  if (APPLY && applied.length) {
    // Edit only the lines that changed so the pull request stays small and easy to review.
    let res = dataLines.slice();
    for (const code of Object.keys(newData)) {
      const d = newData[code], key = p => p.level + "|" + nk(p.name);
      const touched = new Set([...d.removed, ...d.changed.map(x => x.o)].map(key)), kept = [];
      for (const l of res) {
        const [c, lv, ns, y, i, f] = l.split("|");
        if (c !== code) { kept.push(l); continue; }
        const keep = ns.split(";").filter(n => !touched.has(lv + "|" + nk(n)));
        if (keep.length) kept.push([c, lv, keep.join(";"), y, i, f].join("|"));
      }
      const groups = new Map();
      for (const p of [...d.added, ...d.changed.map(x => x.p)].sort((a, b) => a.level - b.level)) {
        const g = p.level + "|" + p.yield + "|" + enc(p.r) + "|" + p.fee;
        (groups.get(g) || groups.set(g, []).get(g)).push(p.name);
      }
      for (const [g, names] of groups) {
        const [lv, y, i, f] = g.split("|"), line = [code, lv, names.join(";"), y, i, f].join("|");
        let at = -1;
        kept.forEach((l, n) => { const [c, l2] = l.split("|"); if (c === code && +l2 <= +lv) at = n; });
        if (at < 0) kept.forEach((l, n) => { if (l.split("|")[0] === code) at = n; });
        kept.splice(at < 0 ? kept.length : at + 1, 0, line);
      }
      res = kept;
    }
    let src = fs.readFileSync(RECIPES, "utf8");
    const a = src.indexOf("const DATA=`"), b = src.indexOf("`;", a);
    const d = new Date(), M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    src = src.slice(0, a) + "const DATA=`" + res.join("\n") + src.slice(b);
    src = src.replace(/const RECIPES_UPDATED="[^"]*"/, `const RECIPES_UPDATED="${d.getUTCDate()} ${M[d.getUTCMonth()]} ${d.getUTCFullYear()}"`);
    fs.writeFileSync(RECIPES, src);
  }

  const head = [`# Wiki recipe check`, ``, `Source: ${FILE || URL_}`, `Read ${Object.values(out).reduce((s, k) => s + k.pieces.length, 0)} pieces across ${Object.keys(out).length} crafts. ${total} difference${total === 1 ? "" : "s"} found.`, ``];
  if (APPLY) head.push(applied.length ? `Crafts rewritten in \`assets/recipes.js\`: ${applied.join(", ")}.` : "Nothing was rewritten.", "");
  const warn = [...problems];
  if (unknown.size) warn.push("Unknown ingredient names (add them to the material list in `assets/recipes.js`): " + [...unknown].join(", "));
  if (notFound.length) warn.push("Not found on the wiki page, left unchanged: " + notFound.join(", "));
  const body = [...head, ...(rep.length ? rep : ["Everything read from the wiki matches the site."]), ...(partNotes.length ? ["### Intermediate parts to check by hand", ...partNotes, ""] : []), ...(warn.length ? ["### Warnings", ...warn.map(w => "- " + w), ""] : [])];
  fs.writeFileSync(REPORT, body.join("\n"));
  console.log(body.join("\n"));
  process.exit(total || partNotes.length || (warn.length && total) ? 10 : 0);

  function fail(msg) { fs.writeFileSync(REPORT, `# Wiki recipe check\n\n${msg}\n`); console.error(msg); process.exit(2); }
})();
