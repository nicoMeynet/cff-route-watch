// Service worker for the installable app (PWA).
// The page itself is always fetched from the network first, so every update pushed online is used
// right away; the saved copy is only a fallback when there is no network. Train data (other sites)
// is never cached: it goes straight to the network.
const CACHE = "route-watch-v1";
const FILES = ["./", "./index.html", "./cff_dashboard.html", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // APIs: not touched
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // one saved copy per file: the settings in the address (?from=…) don't make new copies
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(url.origin + url.pathname, copy)); }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});

// clicking a notification brings the app (or the tab) back to the front
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    const w = list.find(c => c.url.includes("cff_dashboard.html"));
    return w ? w.focus() : self.clients.openWindow("./cff_dashboard.html");
  }));
});
