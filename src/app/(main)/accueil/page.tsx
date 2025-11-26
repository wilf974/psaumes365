'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { VerseCard } from '@/components/bible/verse-card'
import { AudioPlayer } from '@/components/audio-player'
import { cacheDailyVerse, getCachedDailyVerse, cacheCurrentPlan, getCachedCurrentPlan } from '@/lib/offline-cache'
import { trackPageView, trackVerseRead } from '@/lib/analytics'
import dynamic from 'next/dynamic'

// Lazy loading du modal d'onboarding (chargé uniquement si nécessaire)
const OnboardingModal = dynamic(
  () => import('@/components/onboarding/onboarding-modal').then((mod) => ({ default: mod.OnboardingModal })),
  { ssr: false }
)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/stores/app-store'

interface DailyVerse {
  reference: string
  content: string
}

/**
 * Page d'accueil - Tableau de bord de l'utilisateur
 * Affiche le verset du jour et les actions rapides
 */
export default function AccueilPage() {
  const { data: session } = useSession()
  const { meditationStreak } = useAppStore()
  const [verse, setVerse] = useState<DailyVerse | null>(null)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [checkingOnboarding, setCheckingOnboarding] = useState(true)
  const [greeting, setGreeting] = useState('Bonjour') // Valeur par défaut pour éviter l'erreur d'hydratation
  const [currentPlan, setCurrentPlan] = useState<{
    id: string
    title: string
    durationDays: number
    icon: string | null
    imageGradient: string | null
    currentDay: number
    totalDays: number
    progressPercent: number
  } | null>(null)
  const [loadingPlan, setLoadingPlan] = useState(true)

  // Vérifier si l'onboarding est nécessaire
  useEffect(() => {
    async function checkOnboarding() {
      try {
        const response = await fetch('/api/user/onboarding')
        const data = await response.json()
        if (!data.hasCompletedOnboarding) {
          setShowOnboarding(true)
        }
      } catch (error) {
        console.error('Erreur vérification onboarding:', error)
      } finally {
        setCheckingOnboarding(false)
      }
    }
    if (session) {
      checkOnboarding()
    }
  }, [session])

  // Track page view
  useEffect(() => {
    trackPageView('/accueil')
  }, [])

  // Récupération du verset du jour
  useEffect(() => {
    async function fetchVerse() {
      // Vérifier le cache d'abord
      const cachedVerse = getCachedDailyVerse()
      if (cachedVerse) {
        setVerse(cachedVerse)
        setLoading(false)
      }

      try {
        const response = await fetch('/api/bible/daily-verse')
        if (response.ok) {
          const data = await response.json()
          setVerse(data)
          // Mettre en cache
          cacheDailyVerse(data)
        } else {
          // Utiliser le cache si disponible
          if (cachedVerse) {
            setVerse(cachedVerse)
          } else {
            setVerse({
              reference: 'Psaume 119:105',
              content: 'Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.',
            })
          }
        }
      } catch (error) {
        console.error('Erreur chargement verset:', error)
        // Utiliser le cache si disponible
        if (cachedVerse) {
          setVerse(cachedVerse)
        } else {
          setVerse({
            reference: 'Psaume 119:105',
            content: 'Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.',
          })
        }
      } finally {
        setLoading(false)
      }
    }
    fetchVerse()
  }, [])

  // Récupération du plan en cours
  useEffect(() => {
    async function fetchCurrentPlan() {
      if (!session) {
        setLoadingPlan(false)
        return
      }

      // Vérifier le cache d'abord
      const cachedPlan = getCachedCurrentPlan()
      if (cachedPlan) {
        setCurrentPlan(cachedPlan)
        setLoadingPlan(false)
      }

      try {
        const response = await fetch('/api/user/current-plan')
        if (response.ok) {
          const data = await response.json()
          if (data.currentPlan) {
            setCurrentPlan(data.currentPlan)
            // Mettre en cache
            cacheCurrentPlan(data.currentPlan)
          } else {
            setCurrentPlan(null)
          }
        } else {
          // Utiliser le cache si disponible
          if (cachedPlan) {
            setCurrentPlan(cachedPlan)
          }
        }
      } catch (error) {
        console.error('Erreur chargement plan en cours:', error)
        // Utiliser le cache si disponible
        if (cachedPlan) {
          setCurrentPlan(cachedPlan)
        }
      } finally {
        setLoadingPlan(false)
      }
    }
    fetchCurrentPlan()
  }, [session])

  // Calculer la salutation uniquement côté client pour éviter les erreurs d'hydratation
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('Bonjour')
    } else if (hour < 18) {
      setGreeting('Bon après-midi')
    } else {
      setGreeting('Bonsoir')
    }
  }, [])

  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'ami(e)'

  return (
    <>
      <OnboardingModal
        isOpen={showOnboarding && !checkingOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />
      <div className="container max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 overflow-x-hidden">
      {/* En-tête de bienvenue */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-foreground mb-2">
          {greeting}, {userName}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Prenez un moment pour méditer la Parole aujourd'hui.
        </p>
      </motion.div>

      {/* Streak de méditation */}
      {meditationStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-olive-100 to-olive-50 dark:from-olive-900/20 dark:to-olive-800/10 border-olive-200 dark:border-olive-800/30">
            <CardContent className="py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-olive-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{meditationStreak}</span>
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {meditationStreak} jour{meditationStreak > 1 ? 's' : ''} de méditation
                </p>
                <p className="text-sm text-muted-foreground">Continuez ainsi !</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Verset du jour */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <SunIcon className="w-5 h-5 text-sable-500" />
          Verset du jour
        </h2>
        {loading ? (
          <Card className="verse-container border-0">
            <CardContent className="py-8 px-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-2/3 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <div className="flex justify-center mt-6">
                  <Skeleton className="h-9 w-32 rounded-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : verse ? (
          <div className="space-y-3">
            <VerseCard reference={verse.reference} content={verse.content} showAudio={false} showFavorite={true} />
            <div className="flex justify-center gap-2 flex-wrap">
              <AudioPlayer
                text={verse.content}
                id={`daily-verse-${new Date().toISOString().split('T')[0]}`}
                label="🎧 Écouter le verset du jour"
              />
            </div>
          </div>
        ) : null}
      </motion.section>

      {/* Actions rapides */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-lg font-medium text-foreground mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Link href="/meditation">
            <Card className="cursor-pointer hover:shadow-lg transition-all group">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-xl bg-ciel-100 dark:bg-ciel-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <MeditationIcon className="w-5 h-5 text-ciel-600 dark:text-ciel-400" />
                </div>
                <CardTitle className="text-base">Méditation du jour</CardTitle>
                <CardDescription>5 min de méditation guidée</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/journal">
            <Card className="cursor-pointer hover:shadow-lg transition-all group">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-xl bg-sable-100 dark:bg-sable-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <JournalIcon className="w-5 h-5 text-sable-600 dark:text-sable-400" />
                </div>
                <CardTitle className="text-base">Journal spirituel</CardTitle>
                <CardDescription>Notez vos pensées</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/plans">
            <Card className="cursor-pointer hover:shadow-lg transition-all group">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-xl bg-olive-100 dark:bg-olive-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <PlansIcon className="w-5 h-5 text-olive-600 dark:text-olive-400" />
                </div>
                <CardTitle className="text-base">Plans de lecture</CardTitle>
                <CardDescription>Explorez les thèmes</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card className="bg-muted/30 border-dashed">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-2">
                <PlusIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-base text-muted-foreground">Bientôt</CardTitle>
              <CardDescription>Plus de fonctionnalités</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </motion.section>

      {/* Plan en cours */}
      {currentPlan && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-medium text-foreground mb-4">Continuer votre plan</h2>
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    currentPlan.imageGradient
                      ? `bg-gradient-to-br ${currentPlan.imageGradient}`
                      : 'bg-gradient-to-br from-olive-400 to-ciel-400'
                  }`}
                >
                  {currentPlan.icon ? (
                    <span className="text-white text-xl">{currentPlan.icon}</span>
                  ) : (
                    <span className="text-white font-bold">{currentPlan.durationDays}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{currentPlan.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Plan de {currentPlan.durationDays} jour{currentPlan.durationDays > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Progress value={currentPlan.progressPercent} className="mb-3" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Jour {currentPlan.currentDay} sur {currentPlan.totalDays}
                </span>
                <Button size="sm" asChild>
                  <Link href={`/plans/${currentPlan.id}`}>Continuer</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}
      </div>
    </>
  )
}

// Icônes
function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  )
}

function MeditationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

function JournalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  )
}

function PlansIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

