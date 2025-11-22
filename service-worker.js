const CACHE_NAME = "taller-walter-v15";

// Archivos que se guardan offline
const FILES_TO_CACHE = [
  "/",
  "/index.html",
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
  "/img/icon-192.png",
  "/img/icon-512.png",
  "/img/logo.png"
];

// Instalar SW → crea el caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activar SW → limpia cachés viejos
self.addEventListener("activate", (event) => {
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

// Interceptar solicitudes
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() =>
          caches.match("/index.html") // fallback offline
        )
      );
    })
  );
});
