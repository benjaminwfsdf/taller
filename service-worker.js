const VERSION = "v3.4.99";   // ← CAMBIA ESTO cuando quieras forzar update

const PRECACHE = `precache-${VERSION}`;
const RUNTIME  = `runtime-${VERSION}`;

const PRECACHE_URLS = [
  "index.html",
  "aceite.html",
  "agregar.html",
  "buscar.html",
  "buscar_aplicacion.html",
  "calculadora.html",
  "editar_inventario.html",
  "estado.html",
  "gestion_autos.html",
  "inventario.html",
  "reportes.html",
  "tarjeta-virtual.html",
  "tarjetavirtual.html",
  "trabajadores.html",
  "ventas.html",

  /* Imágenes */
  "img/logo.png",
  "img/portada_celular.png",
  "img/portada_pc.png",
  "img/icon-192.png",
  "img/icon-512.png",

  /* Otros */
  "manifest.json"
];

/* =======================================================
   INSTALAR — Caché seguro con manejo de Safari/iPhone
   ======================================================= */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then(async (cache) => {
      for (const url of PRECACHE_URLS) {
        try {
          const res = await fetch(url, { redirect: "manual" });

          // Safari falla si intentas guardar redirects
          if (res.type === "opaqueredirect") {
            console.warn("[SW] Omitiendo redirect en:", url);
            continue;
          }

          await cache.put(url, res.clone());
        } catch (e) {
          console.warn("[SW] Error cacheando:", url, e);
        }
      }
    })
  );

  self.skipWaiting(); // fuerza instalación inmediata
});

/* =======================================================
   ACTIVAR — Eliminar versiones viejas y tomar control
   ======================================================= */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![PRECACHE, RUNTIME].includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim(); // controla todas las pestañas inmediatamente
});

/* =======================================================
   FETCH — estrategia híbrida ideal para PWA
   ======================================================= */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Solo archivos de tu dominio
  if (url.origin !== location.origin) return;

  // HTML / Navegación
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("index.html").then((cached) =>
        fetch(req).catch(() => cached)
      )
    );
    return;
  }

  // Archivos estáticos
  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req)
          .then((res) => {
            if (res.type === "opaqueredirect") return res;

            caches.open(RUNTIME).then((cache) => {
              cache.put(req, res.clone());
            });

            return res;
          })
          .catch(() => cached)
      );
    })
  );
});
