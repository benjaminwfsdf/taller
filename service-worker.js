const CACHE_NAME = "taller-walter-v259";

const FILES_TO_CACHE = [
  "/",
  "index.html",
  "/aceite.html",
  "/agregar.html",
  "/buscar.html",
  "/buscar_aplicacion.html",
  "/calculadora.html",
  "/editar_inventario.html",
  "/estado.html",
  "/gestion_autos.html",
  "/inventario.html",
  "/reportes.html",
  "/tarjeta-virtual.html",
  "/tarjetavirtual.html",
  "/trabajadores.html",
  "/ventas.html",

  /* IMÁGENES */
  "/img/logo.png",
  "/img/portada_celular.png",
  "/img/portada_pc.png",
  "/img/icon-192.png",
  "/img/icon-512.png",

  /* MANIFEST */
  "/manifest.json"
];

// INSTALAR → Guardar archivos en caché
self.addEventListener("install", (event) => {
  console.log("[SW] Instalando service worker…");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Cacheando archivos…");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ACTIVAR → Limpiar cachés viejos
self.addEventListener("activate", (event) => {
  console.log("[SW] Activando service worker…");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH → Cache first + fallback offline
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => caches.match("/index.html"))
      );
    })
  );
});
