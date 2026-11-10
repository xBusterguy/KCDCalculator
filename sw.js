// Keeps the site's own files in the browser so later visits open instantly and still work offline.
// Opening a page answers from the saved copy straight away. At the same time the worker asks the
// server whether any site file changed (a cheap "not modified" check when nothing did). If something
// changed it saves the new copies and tells the open page, which reloads itself (or offers a
// Refresh button if you are in the middle of typing). Nothing here touches localStorage, so saved
// prices, loadouts, favourites, orders and settings are never cleared by an update.
const CACHE = "kcd-tools-v4";
const FILES = ["./", "index.html", "crafting.html", "farming.html", "loadouts.html", "404.html",
  "assets/recipes.js", "assets/market.js", "assets/categories.js", "assets/tour.js", "assets/changelog.js", "changelog.json"];
const fresh = f => new Request(f, { cache: "no-cache" }); // always ask the server, never the browser's own cache

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  // drop every older copy of the site (old cache names), keep only the current one
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

let last = 0, running = null;
// Fetch every site file again; resolves true when at least one differs from the saved copy.
function refreshAll() {
  if (running) return running;
  running = (async () => {
    const c = await caches.open(CACHE);
    let changed = false;
    const got = await Promise.all(FILES.map(async f => {
      try {
        const res = await fetch(fresh(f));
        if (!res.ok || res.type !== "basic") return null;
        const old = await c.match(f), a = await res.clone().text(), b = old ? await old.text() : null;
        if (b !== null && a !== b) changed = true;
        return [f, res];
      } catch (x) { return null }
    }));
    // only save once every file arrived, so a half-finished update never mixes old and new files
    if (got.every(Boolean)) { await Promise.all(got.map(([f, res]) => c.put(f, res))); return changed }
    return false;
  })().catch(() => false).finally(() => { running = null; last = Date.now() });
  return running;
}

self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(r, { ignoreSearch: true });
    if (r.mode === "navigate" && Date.now() - last > 30000) {
      e.waitUntil(refreshAll().then(async changed => {
        if (!changed) return;
        for (const cl of await self.clients.matchAll()) cl.postMessage({ kcd: "updated" });
      }));
    }
    if (hit) return hit;
    return fetch(r).then(res => { if (res.ok && res.type === "basic") c.put(r.url.split("#")[0].split("?")[0], res.clone()); return res }).catch(() => hit);
  }));
});
