const CACHE_NAME = 'fornecedor-hub-v2';
const STATIC_CACHE = 'static-v2';

// Recursos críticos para cache (app shell)
const STATIC_RESOURCES = [
  '/',
  '/manifest.json',
  '/lovable-uploads/18b0e626-711a-4180-a57e-9324cfdc8c24.png',
  '/apple-touch-icon.png',
  '/favicon.png'
];

// Install - cache recursos críticos
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate - limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch - estratégia Network First com fallback para cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests não HTTP/HTTPS
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Estratégia Network First para arquivos HTML/JS/CSS
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'style' ||
      request.url.includes('/_app/') ||
      request.url.includes('/assets/')) {
    
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Se a resposta for válida, cache e retorne
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Se falhar, tente buscar no cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Fallback para página offline ou página inicial
              if (request.destination === 'document') {
                return caches.match('/');
              }
              throw new Error('Resource not found in cache');
            });
        })
    );
  }
  
  // Cache First para recursos estáticos (imagens, ícones)
  else if (request.destination === 'image' || 
           STATIC_RESOURCES.includes(url.pathname)) {
    
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            });
        })
    );
  }
  
  // Para outros requests, apenas busque da rede
  else {
    event.respondWith(fetch(request));
  }
});

// Message handling para atualização de cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker loaded successfully');