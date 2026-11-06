/* Guided tour of the whole site. Loaded by the four main pages.
   - A "Tour" button is added to the navigation, next to Settings, and can be used at any time.
   - New visitors are offered the tour once. Progress while touring lives in sessionStorage only.
   - Each step is one entry in STEPS: the page it belongs to, the element to highlight (a CSS selector,
     or none for a centred card), a title and some text. Steps whose element is missing are skipped. */
(function () {
  "use strict";
  var PAGES = ["index.html", "crafting.html", "farming.html", "loadouts.html"];
  var NAMES = { "index.html": "Home", "crafting.html": "Crafting", "farming.html": "Farming", "loadouts.html": "Loadouts" };
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (PAGES.indexOf(here) < 0) return;

  var STEPS = [
    { p: "index.html", t: "Welcome to KCD Tools", x: "A quick tour of the whole site, about two minutes. It visits each page in turn. You can leave at any time with Esc or Skip, and start it again from the Tour button at the top right." },
    { p: "index.html", s: ".tiles", t: "Three tools", x: "Crafting works out what things cost to make and what to sell them for. Farming ranks crops by how much they earn. Loadouts builds full sets of armour and a weapon and prices them. Each shows a short summary of your current numbers once you have used it." },
    { p: "index.html", s: "#menu > summary", t: "Settings and backup", x: "Switch between light and dark here, and make a backup file of everything you have entered. You can restore it later or on another device. Everything is kept in this browser only, nothing is sent anywhere." },

    { p: "crafting.html", s: "#tabs", t: "Crafting: pick a craft", x: "Smithing, Armouring, Tailoring and the rest. The number is how many pieces each has. The star tab collects your favourites." },
    { p: "crafting.html", s: "#lvs", t: "Filter by level", x: "Show just one crafting level, or All." },
    { p: "crafting.html", s: "#cats", t: "Filter by type", x: "Each craft splits into types that suit it, such as Swords and Helmets, or Furniture and Lighting.", tryit: "Try it: tap one of the types.", ev: "click" },
    { p: "crafting.html", s: "#q", t: "Search every craft", x: "Type two or more letters to search all crafts at once. Press / anywhere on the page to jump to this box.", tryit: "Try it: type “sword”.", ev: "input" },
    { p: "crafting.html", s: "aside > details:first-of-type", open: true, t: "Enter your prices", x: "These are the materials the pieces on screen need. Fill in what you pay for each and every cost updates. Parts such as Steel are worked out from their ingredients unless you enter a price for them. Press Enter to move to the next box." },
    { p: "crafting.html", s: "#ban", t: "Why costs show dashes", x: "Until you enter at least one price, Sell at and Profit show a dash and Total cost is only the bench fee, so nothing looks like a real result." },
    { p: "crafting.html", s: "#mk", t: "Markup", x: "Sell at is the cost plus this percentage, rounded up to a whole groschen." },
    { p: "crafting.html", s: "#th", t: "Reading the table", x: "Bench fee and Total cost are per piece. Click a column heading to sort by it. The headings stay at the top as you scroll." },
    { p: "crafting.html", s: "#rows tr.r", t: "Pieces", x: "Click a row to see exactly which materials add up to its cost. Use the star to keep a piece in your favourites, and type a quantity in the Qty box to add it to an order.", tryit: "Try it: click the row.", ev: "click" },
    { p: "crafting.html", s: "#ordc", t: "Order and shopping list", x: "Everything with a quantity is combined here into a list of materials to buy, with the total cost. You can copy it as text." },
    { p: "crafting.html", s: "aside > details:nth-of-type(2)", open: true, t: "Price presets", x: "Save your prices under a name, for a town perhaps, and switch between sets in one click." },
    { p: "crafting.html", s: "aside > details:nth-of-type(3)", open: true, t: "Share prices", x: "Copy your price list as text to paste in a chat, or paste someone else’s list to import it." },
    { p: "crafting.html", s: "section > .card:last-child", t: "Custom recipes", x: "Missing something, or want to try a house recipe? Add your own piece here and it joins the table." },

    { p: "farming.html", s: "main .card", t: "Farming: your setup", x: "Set your trade level, whether strips are weeded and watered, how many strips you have and the time window you care about. The quick setup buttons fill these in for common cases." },
    { p: "farming.html", s: "#stats", t: "The best choices", x: "The headline results: best value per hour, per harvest and within your time window, and which crop is fastest." },
    { p: "farming.html", s: "table.ft", t: "Every crop", x: "All crops side by side. Click a heading to sort. The worth of a load can be edited, so use the price you actually get when selling." },

    { p: "loadouts.html", s: "main .card", t: "Loadouts: start one", x: "Choose a crafting level and add a loadout. You can keep several and compare them." },
    { p: "loadouts.html", s: "#fq", t: "Find a piece", x: "Search for any armour or weapon and put it straight into one of your loadouts. Press / to jump here." },
    { p: "loadouts.html", s: "#los .card table", t: "Pick a piece for each slot", x: "Head, body, hands, legs and weapon. Each slot lists what you can craft at your level, and the cost appears on the right." },
    { p: "loadouts.html", s: "#los .card .btns", t: "Fill buttons", x: "Fill every slot with the best pieces for your level, the priciest or the cheapest, then change anything you like." },
    { p: "loadouts.html", s: "#los .card .btns + .btns", t: "Share a loadout", x: "Copy it as text, with or without the materials, copy a link that opens the same loadout, or save it as a picture for a chat." },
    { p: "loadouts.html", s: "#cmpd", t: "Compare side by side", x: "Open this to see all your loadouts in one table and which costs most." },
    { p: "loadouts.html", s: "#mat", t: "Prices are shared", x: "These are the same material prices as on the crafting page. Enter them in either place." },
    { p: "loadouts.html", t: "That is the tour", x: "You can replay it whenever you like with the Tour button at the top right. Happy crafting!", last: true }
  ];

  var SEEN = "kcd-tour-seen", POS = "kcd-tour";
  var idx = -1, active = false, hl, blockers = [], card, raf = 0, curEl = null, off = null;

  var css = document.createElement("style");
  css.textContent =
    "nav.site .tourbtn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--bd);border-radius:6px;padding:5px 10px;background:var(--card);color:var(--tx);cursor:pointer;font:inherit}" +
    "html[data-skin=ledger] nav.site .tourbtn{border-radius:2px;font-variant:small-caps;letter-spacing:.05em}" +
    "nav.site .tourbtn:hover{border-color:var(--ac);color:var(--ac)}nav.site .tourbtn svg{width:18px;height:18px;flex:none}" +
    "@media (max-width:560px){nav.site .tourbtn .tl{display:none}nav.site .tourbtn{margin-left:auto;padding:5px 7px}nav.site details.menu{margin-left:0!important}}" +
    "@media (max-width:389px){nav.site a:not(.brand){padding:4px 4px!important;font-size:.82rem!important}}" +
    "@media (max-width:340px){nav.site a:not(.brand){padding:4px 3px!important;font-size:.78rem!important}nav.site .tourbtn{padding:5px 5px}}" +
    ".tour-hl{position:fixed;z-index:1000;pointer-events:none;border-radius:6px;box-shadow:0 0 0 9999px rgba(20,12,4,.62),0 0 0 3px var(--ac)}" +
    ".tour-bk{position:fixed;z-index:1000;background:transparent}" +
    ".tour-card{position:fixed;z-index:1002;width:min(360px,calc(100vw - 24px));box-sizing:border-box;background:var(--card);color:var(--tx);border:1px solid var(--ac);border-radius:8px;padding:14px 16px;box-shadow:0 8px 28px rgba(0,0,0,.45);font-size:.95rem;line-height:1.45}" +
    "html[data-skin=ledger] .tour-card{border-radius:2px;box-shadow:inset 0 0 0 3px var(--card),inset 0 0 0 4px var(--bd),0 8px 28px rgba(0,0,0,.45)}" +
    ".tour-card h2{margin:0 0 6px;font-size:1.1rem;color:var(--ac)}html[data-skin=ledger] .tour-card h2{font-variant:small-caps;letter-spacing:.05em}" +
    ".tour-card p{margin:0 0 8px}.tour-card .try{font-style:italic;color:var(--mut)}" +
    ".tour-card .row{display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap}.tour-card .row .grow{flex:1}" +
    ".tour-card .cnt{font-size:.8rem;color:var(--mut)}.tour-card button{font:inherit;padding:5px 12px;border:1px solid var(--bd);border-radius:6px;background:var(--card);color:var(--tx);cursor:pointer}" +
    "html[data-skin=ledger] .tour-card button{border-radius:2px}.tour-card button:hover{border-color:var(--ac);color:var(--ac)}" +
    ".tour-card button.pri{background:var(--ac);color:var(--on);border-color:var(--ac)}.tour-card button.pri:hover{color:var(--on);filter:brightness(1.12)}" +
    ".tour-card button.lnk{border:0;background:none;padding:5px 4px;text-decoration:underline;color:var(--mut)}" +
    ".tour-card .bar{height:4px;background:var(--bd);border-radius:2px;margin:10px 0 0;overflow:hidden}.tour-card .bar i{display:block;height:100%;background:var(--ac)}" +
    ".tour-offer{right:14px;bottom:14px;left:auto}" +
    "@media (max-width:600px){.tour-card.dock{left:8px!important;right:8px;bottom:8px;top:auto!important;width:auto}.tour-offer{left:8px;right:8px;width:auto}}";
  document.head.appendChild(css);

  function el(tag, attrs, html) { var e = document.createElement(tag); for (var k in attrs || {}) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; }
  function safe(fn) { try { return fn() } catch (e) { return null } }
  function visible(e) { if (!e) return false; var r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }

  // ---------- navigation button ----------
  function addButton() {
    var nav = document.querySelector("nav.site"), menu = nav && nav.querySelector("details.menu");
    if (!nav || nav.querySelector(".tourbtn")) return;
    var b = el("button", { type: "button", class: "tourbtn", title: "Take a guided tour of the site", "aria-label": "Take the guided tour" },
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9.6 9.3a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.2.9-1.2 1.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.6" r="1.1" fill="currentColor"/></svg><span class="tl">Tour</span>');
    b.onclick = function () { start(0); };
    nav.insertBefore(b, menu || null);
  }

  // ---------- running a tour ----------
  function pageOf(i) { return STEPS[i].p; }
  function start(i) {
    safe(function () { localStorage.setItem(SEEN, "1") });
    closeOffer();
    if (pageOf(i) !== here) { safe(function () { sessionStorage.setItem(POS, String(i)) }); location.href = pageOf(i); return; }
    begin(i);
  }
  function begin(i) {
    stopListening();
    if (!active) {
      active = true;
      hl = el("div", { class: "tour-hl", "aria-hidden": "true" });
      document.body.appendChild(hl);
      for (var k = 0; k < 4; k++) { var b = el("div", { class: "tour-bk", "aria-hidden": "true" }); document.body.appendChild(b); blockers.push(b); }
      card = el("div", { class: "tour-card", role: "dialog", "aria-modal": "false", "aria-label": "Site tour" });
      document.body.appendChild(card);
      addEventListener("keydown", keys, true);
      addEventListener("resize", place);
      addEventListener("scroll", place, true);
    }
    show(i, 1);
  }
  function show(i, dir) {
    // find the next step that belongs to this page and whose element exists
    while (i >= 0 && i < STEPS.length) {
      var s = STEPS[i];
      if (s.p !== here) { // the next step is on another page: go there
        safe(function () { sessionStorage.setItem(POS, String(i)) });
        end(true); location.href = s.p; return;
      }
      if (!s.s) break;
      var t = document.querySelector(s.s);
      if (s.open && t && t.tagName === "DETAILS") t.open = true;
      if (visible(t)) break;
      i += dir;
    }
    if (i < 0) i = 0;
    if (i >= STEPS.length) { end(); return; }
    idx = i; var st = STEPS[i];
    safe(function () { sessionStorage.setItem(POS, String(i)) });
    curEl = st.s ? document.querySelector(st.s) : null;
    if (curEl && st.s) safe(function () { var tall = curEl.getBoundingClientRect().height > innerHeight * 0.4; curEl.scrollIntoView({ block: innerWidth <= 600 && tall ? "start" : "center", behavior: "auto" }) });
    stopListening();
    var total = STEPS.length, last = i === total - 1;
    card.innerHTML = "<h2>" + st.t + "</h2><p>" + st.x + "</p>" + (st.tryit ? '<p class="try">' + st.tryit + "</p>" : "") +
      '<div class="bar"><i style="width:' + Math.round((i + 1) / total * 100) + '%"></i></div>' +
      '<div class="row"><span class="cnt" aria-live="polite">' + NAMES[st.p] + " · " + (i + 1) + " of " + total + '</span><span class="grow"></span>' +
      (i > 0 ? '<button type="button" data-a="back">Back</button>' : "") +
      '<button type="button" class="pri" data-a="next">' + (last ? "Finish" : i === 0 ? "Start" : "Next") + "</button></div>" +
      (last ? "" : '<div class="row" style="margin-top:4px"><button type="button" class="lnk" data-a="skip">Skip the tour</button></div>');
    card.onclick = function (e) { var b = e.target.closest("button"); if (!b) return; var a = b.getAttribute("data-a"); if (a === "next") (last ? end() : show(idx + 1, 1)); else if (a === "back") show(idx - 1, -1); else if (a === "skip") end(); };
    if (st.ev && curEl) { var h = function () { setTimeout(function () { if (active && STEPS[idx] === st) show(idx + 1, 1); }, 700); }; curEl.addEventListener(st.ev, h, { once: true, capture: true }); off = function () { curEl.removeEventListener(st.ev, h, true); }; }
    place();
    var nb = card.querySelector('[data-a="next"]'); if (nb) nb.focus({ preventScroll: true });
    setTimeout(place, 120);
  }
  function stopListening() { if (off) { off(); off = null; } }
  function place() {
    if (!active) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () {
      if (!active) return;
      var vw = innerWidth, vh = innerHeight, st = STEPS[idx], m = 6;
      var r = curEl && visible(curEl) ? curEl.getBoundingClientRect() : null;
      var narrow = vw <= 600;
      card.classList.toggle("dock", narrow);
      if (!r) {
        hl.style.cssText = "left:" + vw / 2 + "px;top:" + vh / 2 + "px;width:0;height:0";
        setBlock({ left: 0, top: 0, right: vw, bottom: vh });
        if (!narrow) { card.style.left = Math.max(8, (vw - card.offsetWidth) / 2) + "px"; card.style.top = Math.max(8, (vh - card.offsetHeight) / 2) + "px"; }
        else { card.style.top = "auto"; }
        return;
      }
      var L = Math.max(0, r.left - m), T = Math.max(0, r.top - m), R = Math.min(vw, r.right + m), B = Math.min(vh, r.bottom + m);
      hl.style.cssText = "left:" + L + "px;top:" + T + "px;width:" + (R - L) + "px;height:" + (B - T) + "px";
      setBlock({ left: L, top: T, right: R, bottom: B });
      if (narrow) { card.style.top = "auto"; return; }
      var cw = card.offsetWidth, ch = card.offsetHeight, x = Math.min(Math.max(8, L), vw - cw - 8), y;
      if (B + ch + 12 < vh) y = B + 12;           // below
      else if (T - ch - 12 > 0) y = T - ch - 12;   // above
      else { y = Math.max(8, vh - ch - 12); x = L + (R - L) / 2 > vw / 2 ? 12 : vw - cw - 12; } // large element: dock at a side
      card.style.left = x + "px"; card.style.top = y + "px";
    });
  }
  function setBlock(b) {
    var vw = innerWidth, vh = innerHeight, rects = [
      [0, 0, vw, b.top], [0, b.bottom, vw, vh - b.bottom], [0, b.top, b.left, b.bottom - b.top], [b.right, b.top, vw - b.right, b.bottom - b.top]];
    blockers.forEach(function (d, i) { var r = rects[i]; d.style.cssText = "left:" + r[0] + "px;top:" + r[1] + "px;width:" + Math.max(0, r[2]) + "px;height:" + Math.max(0, r[3]) + "px"; });
  }
  function keys(e) {
    if (!active) return;
    var tag = (e.target && e.target.tagName) || "";
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); end(); }
    else if (!/INPUT|TEXTAREA|SELECT/.test(tag) && (e.key === "ArrowRight")) { e.preventDefault(); show(idx + 1, 1); }
    else if (!/INPUT|TEXTAREA|SELECT/.test(tag) && e.key === "ArrowLeft") { e.preventDefault(); show(idx - 1, -1); }
  }
  function end(moving) {
    stopListening();
    if (!moving) safe(function () { sessionStorage.removeItem(POS) });
    active = false; cancelAnimationFrame(raf);
    [hl, card].concat(blockers).forEach(function (n) { if (n && n.parentNode) n.parentNode.removeChild(n); });
    blockers = []; hl = card = null;
    removeEventListener("keydown", keys, true); removeEventListener("resize", place); removeEventListener("scroll", place, true);
    var b = document.querySelector(".tourbtn"); if (b && !moving) b.focus({ preventScroll: true });
  }

  // ---------- first-visit offer ----------
  var offer = null;
  function closeOffer() { if (offer && offer.parentNode) offer.parentNode.removeChild(offer); offer = null; }
  function showOffer() {
    offer = el("div", { class: "tour-card tour-offer", role: "dialog", "aria-label": "Take the tour?" },
      "<h2>New here?</h2><p>Take a two-minute tour of every page and what each feature does. You can start it again any time from the Tour button at the top right.</p>" +
      '<div class="row"><span class="grow"></span><button type="button" data-a="no">No thanks</button><button type="button" class="pri" data-a="go">Start the tour</button></div>');
    offer.onclick = function (e) { var b = e.target.closest("button"); if (!b) return; safe(function () { localStorage.setItem(SEEN, "1") }); if (b.getAttribute("data-a") === "go") start(0); else closeOffer(); };
    document.body.appendChild(offer);
  }

  // ---------- boot ----------
  function boot() {
    addButton();
    var pos = safe(function () { return sessionStorage.getItem(POS) });
    if (pos != null && pos !== "") {
      var i = parseInt(pos, 10);
      if (i >= 0 && i < STEPS.length && STEPS[i].p === here) { setTimeout(function () { begin(i); }, 350); return; }
      safe(function () { sessionStorage.removeItem(POS) });
    }
    if (!safe(function () { return localStorage.getItem(SEEN) }) && !/[?&]notour\b/.test(location.search)) setTimeout(showOffer, 900);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
