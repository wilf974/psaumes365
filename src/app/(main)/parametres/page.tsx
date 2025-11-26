'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/stores/app-store'
import { requestNotificationPermission, isNotificationSupported } from '@/lib/notifications'
import { isAnalyticsEnabled, setAnalyticsEnabled } from '@/lib/analytics'

/**
 * Page des paramètres utilisateur
 */
export default function ParametresPage() {
  const { data: session } = useSession()
  const { theme, setTheme, audioEnabled, setAudioEnabled, meditationStreak } = useAppStore()
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [reminderHour, setReminderHour] = useState('08')
  const [reminderMinute, setReminderMinute] = useState('00')
  const [analyticsEnabled, setAnalyticsEnabledState] = useState(false)

  useEffect(() => {
    if (isNotificationSupported()) {
      setNotificationPermission(Notification.permission)
    }
    // Charger l'état de l'analytics
    setAnalyticsEnabledState(isAnalyticsEnabled())
  }, [])

  /**
   * Active les notifications
   */
  const handleEnableNotifications = async () => {
    const permission = await requestNotificationPermission()
    setNotificationPermission(permission)
  }

  return (
    <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-foreground mb-2">
          Paramètres
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Personnalisez votre expérience Psaumes365.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Compte */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compte</CardTitle>
              <CardDescription>Informations de votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{session?.user?.name || 'Utilisateur'}</p>
                  <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Série de méditation</p>
                  <p className="font-medium text-olive-600">{meditationStreak} jour{meditationStreak > 1 ? 's' : ''}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })} className="w-full">
                Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Apparence */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Apparence</CardTitle>
              <CardDescription>Personnalisez l'affichage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-3 block">Thème</Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="flex-1"
                  >
                    ☀️ Clair
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="flex-1"
                  >
                    🌙 Sombre
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('system')}
                    className="flex-1"
                  >
                    💻 Système
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Audio */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audio</CardTitle>
              <CardDescription>Paramètres de lecture vocale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lecture vocale (TTS)</p>
                  <p className="text-sm text-muted-foreground">Écouter les versets et méditations</p>
                </div>
                <Button
                  variant={audioEnabled ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                >
                  {audioEnabled ? '🔊 Activé' : '🔇 Désactivé'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notifications</CardTitle>
              <CardDescription>Rappels de méditation quotidienne</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isNotificationSupported() ? (
                <p className="text-sm text-muted-foreground">
                  Les notifications ne sont pas supportées sur ce navigateur.
                </p>
              ) : notificationPermission === 'granted' ? (
                <>
                  <div className="flex items-center gap-2 text-olive-600">
                    <span>✓</span>
                    <span>Notifications activées</span>
                  </div>
                  <div>
                    <Label className="mb-2 block">Heure du rappel</Label>
                    <div className="flex gap-2 items-center">
                      <select
                        value={reminderHour}
                        onChange={(e) => setReminderHour(e.target.value)}
                        className="rounded-lg border border-input bg-background px-3 py-2"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                      <span>:</span>
                      <select
                        value={reminderMinute}
                        onChange={(e) => setReminderMinute(e.target.value)}
                        className="rounded-lg border border-input bg-background px-3 py-2"
                      >
                        {['00', '15', '30', '45'].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : notificationPermission === 'denied' ? (
                <p className="text-sm text-destructive">
                  Les notifications ont été bloquées. Veuillez les autoriser dans les paramètres de votre navigateur.
                </p>
              ) : (
                <Button onClick={handleEnableNotifications} className="w-full">
                  🔔 Activer les rappels
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Vie privée */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vie privée</CardTitle>
              <CardDescription>Gérez vos données et l'analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Analytics anonymes</p>
                  <p className="text-sm text-muted-foreground">
                    Aide à améliorer l'application (aucune donnée personnelle)
                  </p>
                </div>
                <Button
                  variant={analyticsEnabled ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const newValue = !analyticsEnabled
                    setAnalyticsEnabled(newValue)
                    setAnalyticsEnabledState(newValue)
                  }}
                >
                  {analyticsEnabled ? '✓ Activé' : 'Désactivé'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Les données collectées sont anonymes et ne contiennent aucune information personnelle.
                Aucun cookie n'est utilisé.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* À propos */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">À propos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Psaumes365</strong> - Version 1.0.0</p>
              <p>Application gratuite de méditation biblique.</p>
              <p className="italic">« Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. » — Psaume 119:105</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}


