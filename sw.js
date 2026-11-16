// Ponto — service worker mínimo: permite instalar o app e abrir sem internet.
// Sempre tenta a rede primeiro (assim cada deploy chega na hora); a cópia guardada só entra offline.
const CACHE = 'ponto-v1';
const BASE = ['/', '/index.html', '/css/style.css', '/js/app.js', '/produtos.json', '/img/icone.svg', '/manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/') || url.pathname.startsWith('/_vercel/')) return;
  e.respondWith(
    fetch(req).then((r) => {
      if (r.ok) { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
      return r;
    }).catch(() => caches.match(req).then((r) => r || caches.match('/index.html')))
  );
});
