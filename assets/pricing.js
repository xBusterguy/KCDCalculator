// Shared material prices: the one place that knows what a material costs.
// Needs assets/recipes.js (RAW, INT, DATA, CR) and assets/market.js (MARKET) loaded first.
// Used by the Prices page (where prices are entered), Farming (worth per load) and the
// price summary line on Crafting and Loadouts. Prices live in localStorage "kcd-p"; the
// "use market prices" switch is "sg" inside "kcd-s".
window.KP = (function () {
  "use strict";
  // Goods that no recipe uses but Farming sells, so they can be priced too
  var EXTRA = { hempf: "Hemp fibre" };
  // Farming crop name -> material id
  var CROP = { Cabbage: "cabbage", Carrots: "carrots", Onions: "onions", Barley: "barley", Hay: "hay", Hops: "hops", Grapes: "grapes", Plums: "plums", Sage: "sage", Chamomile: "chamomile", "Hemp fibre": "hempf", Flax: "flax" };
  var G = [
    ["ores", "Ores & metals", "O C K A G U M D E Z"],
    ["timber", "Timber & fuel", "L R X oak yew charcoal"],
    ["hunt", "Hunt & hides", "H F V T W Q tusks rantlers hare venison boar wmeat wheart"],
    ["herbs", "Herbs & mushrooms", "N mint wormwood chamomile sage thistle dandelion belladonna valerian wort eyebright poppy ginger marigold comfrey feverfew elder mandrake amandrake boletus lepiota cobwebs"],
    ["farm", "Farm & food", "barley hops grapes honey plums flax hay hempf apple pear beet carrots egg onions cabbage garlic pork milk horseradish chicken mutton beef ptender btender bkidney btongue pliver sstomach aseeds"],
    ["fish", "Fish", "carp eel pike roach"],
    ["rare", "Rare finds", "P amber rcrystal J u v brokenaxe"]
  ];
  var GROUP = {}, GROUPS = [];
  G.forEach(function (g) { GROUPS.push({ id: g[0], name: g[1] }); g[2].split(" ").forEach(function (id) { GROUP[id] = g[0]; }); });
  Object.keys(RAW).forEach(function (id) { if (!GROUP[id]) GROUP[id] = "other"; });
  if (Object.keys(RAW).some(function (id) { return GROUP[id] === "other"; })) GROUPS.push({ id: "other", name: "Other" });
  Object.keys(INT).forEach(function (id) { GROUP[id] = "parts"; });
  GROUPS.push({ id: "parts", name: "Parts you can craft" });

  var name = function (id) { return RAW[id] || EXTRA[id] || (INT[id] && INT[id][0]) || id; };
  var ids = Object.keys(RAW).concat(Object.keys(EXTRA), Object.keys(INT));

  // How many recipe lines (counting each name variant) use each material
  var USED = {};
  (function () {
    var RX = /\{(\w+)\}(\d+)|([A-Za-z])(\d+)/g;
    DATA.split("\n").forEach(function (l) {
      var p = l.split("|"); if (p.length < 5) return; var n = p[2].split(";").length;
      p[4].replace(RX, function (m, w, a, k) { var id = w || k; USED[id] = (USED[id] || 0) + n; return m; });
    });
    Object.keys(INT).forEach(function (k) { for (var r in INT[k][2]) USED[r] = USED[r] || 0; });
  })();
  var FARMED = {}; Object.keys(CROP).forEach(function (c) { FARMED[CROP[c]] = c; });

  var load = function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v && typeof v === "object" && !Array.isArray(v) ? v : d; } catch (e) { return d; } };
  var P, sg, C = {};
  function read() {
    P = load("kcd-p", {}); var st = load("kcd-s", {}); sg = st.sg == null ? true : !!st.sg; C = {};
  }
  read();
  var ov = function (id) { return P[id] !== undefined && P[id] !== "" && !isNaN(parseFloat(P[id])); };
  var mkt = function (id) { return (MARKET.p && MARKET.p[id]) || 0; };
  var sug = function (id) { return sg ? mkt(id) : 0; };
  function unit(id) {
    if (id in C) return C[id];
    C[id] = 0;   // guards against a loop in the data
    var v;
    if (ov(id)) v = Math.max(0, parseFloat(P[id]) || 0);
    else if (INT[id]) { var r = INT[id][2], s = 0; for (var k in r) s += r[k] * unit(k); v = (s + (INT[id][3] || 0)) / INT[id][1]; }
    else v = sug(id);
    return (C[id] = v);
  }
  // "yours", "market", "worked out" or "missing"
  function source(id) {
    if (ov(id)) return "yours";
    if (INT[id]) { var r = INT[id][2]; for (var k in r) if (source(k) === "missing") return "missing"; return "worked out"; }
    return sug(id) ? "market" : "missing";
  }
  var tm;
  function save() { clearTimeout(tm); tm = setTimeout(function () { try { localStorage.setItem("kcd-p", JSON.stringify(P)); } catch (e) {} }, 200); }
  function flush() { clearTimeout(tm); try { localStorage.setItem("kcd-p", JSON.stringify(P)); } catch (e) {} }
  function set(id, v) { v = String(v == null ? "" : v).trim().replace(",", "."); if (v === "" || isNaN(parseFloat(v)) || parseFloat(v) < 0) delete P[id]; else P[id] = v; C = {}; save(); }
  function setAll(o) { P = {}; for (var k in o) if (ids.indexOf(k) >= 0 && !isNaN(parseFloat(o[k])) && parseFloat(o[k]) >= 0) P[k] = String(o[k]); C = {}; flush(); }
  function setSg(v) { sg = !!v; C = {}; var st = load("kcd-s", {}); st.sg = sg; try { localStorage.setItem("kcd-s", JSON.stringify(st)); } catch (e) {} }
  function mine() { var o = {}; for (var k in P) if (ov(k)) o[k] = P[k]; return o; }
  // Counts over raw goods that something actually uses
  function stats() {
    var y = 0, m = 0, x = 0;
    Object.keys(RAW).concat(Object.keys(EXTRA)).forEach(function (id) {
      if (!USED[id] && !FARMED[id]) return;
      if (ov(id)) y++; else if (sug(id)) m++; else x++;
    });
    Object.keys(INT).forEach(function (id) { if (ov(id)) y++; });
    return { yours: y, market: m, missing: x };
  }
  function marketDate() { var d = new Date(MARKET.date + "T12:00:00"); return isNaN(d) ? MARKET.date : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); }
  // Name lookup for imports ("Iron ore = 7")
  var BYNAME = {}; ids.forEach(function (id) { BYNAME[name(id).toLowerCase()] = id; });

  return {
    EXTRA: EXTRA, CROP: CROP, GROUPS: GROUPS, GROUP: GROUP, USED: USED, FARMED: FARMED, BYNAME: BYNAME,
    ids: ids, name: name, ov: ov, mkt: mkt, sug: sug, unit: unit, source: source,
    set: set, setAll: setAll, setSg: setSg, mine: mine, stats: stats, read: read, flush: flush, marketDate: marketDate,
    get P() { return P; }, get sg() { return sg; }
  };
})();
