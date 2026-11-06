/* "What's new" button and panel. The list comes from changelog.json in the repository, so it ships with the site.
   To add an entry, put a new object at the top of "entries" in changelog.json (newest first). Plain text only. */
(function () {
  "use strict";
  var REPO = "https://github.com/xBusterguy/KCDCalculator", SEEN = "kcd-changelog-seen";
  var data = null, panel = null, btns = [], opener = null;
  function safe(f) { try { return f() } catch (e) { return null } }
  function el(tag, attrs, text) { var e = document.createElement(tag); for (var k in attrs || {}) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; }

  var css = document.createElement("style");
  css.textContent =
    "nav.site .clbtn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--bd);border-radius:6px;padding:5px 10px;background:var(--card);color:var(--tx);cursor:pointer;font:inherit;position:relative}" +
    "html[data-skin=ledger] nav.site .clbtn{border-radius:2px;font-variant:small-caps;letter-spacing:.05em}" +
    "nav.site .clbtn:hover{border-color:var(--ac);color:var(--ac)}nav.site .clbtn svg{width:18px;height:18px;flex:none}" +
    ".cldot{position:absolute;top:-4px;right:-4px;width:10px;height:10px;border-radius:50%;background:var(--ac);border:2px solid var(--bg)}" +
    "nav.site .clpop{display:none}" +
    "@media (max-width:900px){nav.site .clbtn .tl,nav.site .tourbtn .tl{display:none}nav.site .clbtn,nav.site .tourbtn{padding:5px 8px}}" +
    "@media (max-width:560px){nav.site .clbtn{display:none}nav.site .pop .clpop{display:block}}" +
    ".clpanel{position:fixed;z-index:900;top:64px;right:14px;width:min(420px,calc(100vw - 28px));max-height:min(70vh,560px);overflow:auto;box-sizing:border-box;background:var(--card);color:var(--tx);border:1px solid var(--ac);border-radius:8px;padding:14px 16px;box-shadow:0 8px 28px rgba(0,0,0,.4);font-size:.95rem;line-height:1.45}" +
    "html[data-skin=ledger] .clpanel{border-radius:2px;box-shadow:inset 0 0 0 3px var(--card),inset 0 0 0 4px var(--bd),0 8px 28px rgba(0,0,0,.4)}" +
    ".clpanel .hd{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}" +
    ".clpanel h2{margin:0;font-size:1.15rem;color:var(--ac)}html[data-skin=ledger] .clpanel h2{font-variant:small-caps;letter-spacing:.05em}" +
    ".clpanel h3{margin:12px 0 2px;font-size:.98rem;color:var(--tx);text-transform:none;letter-spacing:0;border:0}" +
    ".clpanel .dt{font-size:.8rem;color:var(--mut)}.clpanel ul{margin:4px 0 0;padding-left:1.2em}.clpanel li{margin:3px 0}" +
    ".clpanel button.x{font:inherit;border:1px solid var(--bd);background:var(--card);color:var(--tx);border-radius:6px;padding:2px 10px;cursor:pointer}" +
    ".clpanel button.x:hover{border-color:var(--ac);color:var(--ac)}.clpanel .ft{margin:12px 0 0;font-size:.85rem;color:var(--mut)}";
  document.head.appendChild(css);

  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 11h7M9 15h7M9 7h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  function latest() { var e = data && data.entries && data.entries[0]; return e ? e.date + "|" + e.title : ""; }
  function dateText(d) { var t = new Date(d + "T12:00:00"); return isNaN(t) ? d : t.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }
  function dots() { var fresh = data && latest() && safe(function () { return localStorage.getItem(SEEN) }) !== latest(); btns.forEach(function (b) { var d = b.querySelector(".cldot"); if (fresh && !d) b.appendChild(el("span", { class: "cldot", "aria-hidden": "true" })); if (!fresh && d) d.remove(); if (b.classList.contains("clbtn")) b.title = fresh ? "What's new (there are updates you have not seen)" : "What's new"; }); }

  function close() { if (!panel) return; panel.remove(); panel = null; document.removeEventListener("keydown", onKey, true); document.removeEventListener("mousedown", onOut, true); btns.forEach(function (b) { b.setAttribute("aria-expanded", "false"); }); if (opener) { opener.focus({ preventScroll: true }); opener = null; } }
  function onKey(e) { if (e.key === "Escape") { e.preventDefault(); close(); } }
  function onOut(e) { if (panel && !panel.contains(e.target) && !e.target.closest(".clbtn,.clpop")) close(); }
  function open(from) {
    if (panel) { close(); return; }
    var menu = document.getElementById("menu"); if (menu) menu.open = false;
    opener = from;
    panel = el("div", { class: "clpanel", role: "dialog", "aria-label": "What's new" });
    var hd = el("div", { class: "hd" }); hd.appendChild(el("h2", null, "What's new")); var x = el("button", { type: "button", class: "x" }, "Close"); x.onclick = close; hd.appendChild(x); panel.appendChild(hd);
    var list = data && data.entries || [];
    if (!list.length) panel.appendChild(el("p", null, "Nothing to show yet."));
    list.slice(0, 12).forEach(function (en) {
      panel.appendChild(el("h3", null, en.title || "Update")); panel.appendChild(el("div", { class: "dt" }, dateText(en.date)));
      var ul = el("ul"); (en.changes || []).forEach(function (c) { ul.appendChild(el("li", null, String(c))); }); panel.appendChild(ul);
    });
    var ft = el("p", { class: "ft" }); var a = el("a", { href: REPO + "/pulls?q=is%3Apr+is%3Amerged", target: "_blank", rel: "noopener noreferrer" }, "Every change on GitHub ↗"); ft.appendChild(a); panel.appendChild(ft);
    document.body.appendChild(panel);
    btns.forEach(function (b) { b.setAttribute("aria-expanded", "true"); });
    safe(function () { localStorage.setItem(SEEN, latest()) }); dots();
    x.focus({ preventScroll: true });
    document.addEventListener("keydown", onKey, true); document.addEventListener("mousedown", onOut, true);
  }

  function addButtons() {
    var nav = document.querySelector("nav.site"); if (!nav || nav.querySelector(".clbtn")) return;
    var b = el("button", { type: "button", class: "clbtn", "aria-haspopup": "dialog", "aria-expanded": "false", title: "What's new" });
    b.innerHTML = ICON + '<span class="tl">What’s new</span>';
    b.onclick = function () { open(b); };
    var gh = nav.querySelector("a.gh"); if (gh) gh.after(b); else nav.insertBefore(b, nav.querySelector("details.menu"));
    btns.push(b);
    var pop = nav.querySelector(".pop");
    if (pop) { var p = el("button", { type: "button", class: "clpop", "aria-haspopup": "dialog" }, "What’s new"); p.onclick = function () { open(document.querySelector("nav.site details.menu > summary") || p); }; var hr = pop.querySelector("hr"); pop.insertBefore(p, hr ? hr.nextSibling : pop.firstChild); btns.push(p); }
  }

  function boot() {
    addButtons();
    fetch("changelog.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !Array.isArray(j.entries)) return; data = j;
      // first ever visit: do not flag everything as new
      if (safe(function () { return localStorage.getItem(SEEN) }) === null) safe(function () { localStorage.setItem(SEEN, latest()) });
      dots();
    }).catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
