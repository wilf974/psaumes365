/**
 * Service de notifications pour Psaumes365
 * Gère les rappels quotidiens de méditation
 */

/**
 * Vérifie si les notifications sont supportées
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator
}

/**
 * Demande la permission de notification
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    console.warn('Notifications non supportées')
    return 'denied'
  }

  const permission = await Notification.requestPermission()
  return permission
}

/**
 * Enregistre le Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker non supporté')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    console.log('Service Worker enregistré:', registration.scope)
    return registration
  } catch (error) {
    console.error('Erreur enregistrement Service Worker:', error)
    return null
  }
}

/**
 * Programme un rappel de méditation quotidien
 * @param hour - Heure du rappel (0-23)
 * @param minute - Minute du rappel (0-59)
 */
export function scheduleDailyReminder(hour: number, minute: number): void {
  if (!isNotificationSupported()) return

  // Calcul du délai jusqu'à la prochaine heure de rappel
  const now = new Date()
  const target = new Date(now)
  target.setHours(hour, minute, 0, 0)

  // Si l'heure est passée, programmer pour demain
  if (target <= now) {
    target.setDate(target.getDate() + 1)
  }

  const delay = target.getTime() - now.getTime()

  // Enregistrer le rappel dans localStorage
  localStorage.setItem('psaumes365-reminder', JSON.stringify({ hour, minute }))

  // Programmer la notification (pour la session courante)
  setTimeout(() => {
    showMeditationReminder()
    // Re-programmer pour le lendemain
    scheduleDailyReminder(hour, minute)
  }, delay)
}

/**
 * Affiche une notification de rappel
 */
export function showMeditationReminder(): void {
  if (Notification.permission !== 'granted') return

  const notification = new Notification('Psaumes365', {
    body: 'Votre méditation quotidienne vous attend 🙏',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'meditation-reminder',
    requireInteraction: true,
  })

  notification.onclick = () => {
    window.focus()
    window.location.href = '/meditation'
    notification.close()
  }
}

/**
 * Récupère les paramètres de rappel enregistrés
 */
export function getSavedReminder(): { hour: number; minute: number } | null {
  const saved = localStorage.getItem('psaumes365-reminder')
  if (saved) {
    return JSON.parse(saved)
  }
  return null
}

/**
 * Supprime le rappel
 */
export function clearReminder(): void {
  localStorage.removeItem('psaumes365-reminder')
}

