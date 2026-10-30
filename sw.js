/* Guarda o app no aparelho para funcionar sem internet.
   Ao publicar uma alteração, aumente o número da VERSAO. */
const VERSAO = 'iberia-2027-v1';
const ARQUIVOS = ['./', 'index.html', 'styles.css', 'app.js', 'roteiro.json', 'manifest.webmanifest',
  'bricolage-latin.woff2', 'figtree-latin.woff2',
  'icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Mostra o que está salvo na hora e, se houver internet, atualiza em segundo plano.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSAO).then(async cache => {
    const salvo = await cache.match(req, {ignoreSearch: true});
    const rede = fetch(req).then(r => { if (r.ok) cache.put(req, r.clone()); return r; }).catch(() => null);
    return salvo || (await rede) || cache.match('index.html');
  }));
});
