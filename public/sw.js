// Service Worker pour Psaumes365
const CACHE_NAME = 'psaumes365-v2'
const STATIC_CACHE = 'psaumes365-static-v2'
const API_CACHE = 'psaumes365-api-v2'

const urlsToCache = [
  '/',
  '/accueil',
  '/meditation',
  '/plans',
  '/journal',
  '/manifest.json',
  '/favicon',
]

// Routes API à mettre en cache
const apiRoutesToCache = [
  '/api/bible/daily-verse',
  '/api/plans',
  '/api/user/current-plan',
]

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache statique
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Cache statique ouvert')
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' }))).catch((err) => {
          console.warn('Erreur cache statique:', err)
        })
      }),
      // Cache API
      caches.open(API_CACHE).then((cache) => {
        console.log('Cache API ouvert')
        return Promise.resolve()
      }),
    ])
  )
  self.skipWaiting()
})

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE && cacheName !== CACHE_NAME) {
            console.log('Suppression ancien cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Stratégie de cache selon le type de requête
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Routes API : Network First avec cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // Mettre en cache les réponses API valides
            if (response.status === 200 && apiRoutesToCache.some(route => url.pathname.startsWith(route))) {
              const responseClone = response.clone()
              cache.put(event.request, responseClone)
            }
            return response
          })
          .catch(() => {
            // Fallback sur le cache pour les API
            return cache.match(event.request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              // Si pas de cache, retourner une réponse par défaut
              return new Response(
                JSON.stringify({ error: 'Hors ligne', cached: true }),
                {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' },
                }
              )
            })
          })
      })
    )
    return
  }

  // Pages statiques : Cache First avec fallback réseau
  if (urlsToCache.some(path => url.pathname === path || url.pathname.startsWith(path + '/'))) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            // Mettre à jour le cache en arrière-plan
            fetch(event.request).then((response) => {
              if (response.status === 200) {
                cache.put(event.request, response.clone())
              }
            }).catch(() => {
              // Ignorer les erreurs de mise à jour
            })
            return cachedResponse
          }
          // Si pas en cache, récupérer depuis le réseau
          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              cache.put(event.request, response.clone())
            }
            return response
          }).catch(() => {
            // Fallback sur la page d'accueil
            return cache.match('/')
          })
        })
      })
    )
    return
  }

  // Autres ressources : Network First
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          return response || caches.match('/')
        })
      })
  )
})

// Gestion des notifications push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Votre méditation quotidienne vous attend 🙏',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: '/meditation',
    },
    actions: [
      { action: 'open', title: 'Méditer maintenant' },
      { action: 'close', title: 'Plus tard' },
    ],
  }

  event.waitUntil(
    self.registration.showNotification('Psaumes365', options)
  )
})

// Clic sur la notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/meditation')
    )
  }
})

