// Keeps the site's own files in the browser so later visits open instantly and still work offline.
// Strategy: answer from the saved copy straight away, and fetch a fresh copy in the background for next time.
// A new version of the site is therefore picked up on the visit after it is published.
const CACHE = "kcd-tools-v3";
const FILES = ["./", "index.html", "crafting.html", "farming.html", "loadouts.html", "404.html",
  "assets/recipes.js", "assets/market.js", "assets/categories.js", "assets/tour.js", "assets/changelog.js", "changelog.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(r, { ignoreSearch: true });
    const fresh = fetch(r).then(res => { if (res.ok && res.type === "basic") c.put(r.url.split("#")[0].split("?")[0], res.clone()); return res; }).catch(() => hit);
    e.waitUntil(fresh.catch(() => {}));
    return hit || fresh;
  }));
});
