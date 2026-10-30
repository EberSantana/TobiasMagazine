/* Service worker do Tobias Magazine.
   Estratégia: rede primeiro (conteúdo sempre atual) e, sem internet, usa a cópia guardada.
   Os dados do servidor (Google Apps Script) nunca são guardados aqui: o app já mantém
   sua própria cópia local. Mude VERSAO para forçar a limpeza do cache antigo. */
const VERSAO = "tm-v3";
const BASICOS = ["./", "index.html", "styles.css", "app.js", "data.js", "icons.js", "config.js", "a11y.js", "pwa.js", "privacidade.html",
  "favicon-32.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "logo-horizontal.png", "manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => Promise.all(BASICOS.map((u) => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // API, VLibras, fontes: direto da rede
  e.respondWith(
    fetch(req).then((res) => {
      if (res && res.ok) { const copia = res.clone(); caches.open(VERSAO).then((c) => c.put(req, copia)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || (req.mode === "navigate" ? caches.match("index.html") : Response.error())))
  );
});
