'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getPlanById } from '@/data/plans'
import { AudioPlayer } from '@/components/audio-player'
import { ShareButton } from '@/components/ui/share-button'
import { cachePlanDetail, getCachedPlanDetail } from '@/lib/offline-cache'
import dynamic from 'next/dynamic'

// Lazy loading du lecteur de musique d'ambiance (chargé uniquement si nécessaire)
const AmbientPlayer = dynamic(
  () => import('@/components/ambient-player').then((mod) => ({ default: mod.AmbientPlayer })),
  { ssr: false }
)
import { X } from 'lucide-react'

interface Plan {
  id: string
  title: string
  description: string
  theme: string
  durationDays: number
  imageUrl?: string | null
  imageGradient: string
  icon: string
  days: Array<{
    day: number
    title: string
    verseRef: string
    verseText?: string
    meditation: string
    prayer: string
  }>
}

/**
 * Page de détail d'un plan de méditation
 * Affiche la progression et permet de naviguer entre les jours
 */
export default function PlanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const planId = params.id as string
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)

  const [currentDay, setCurrentDay] = useState(1)
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    loadPlan()
  }, [planId])

  /**
   * Charge le plan depuis les données statiques ou l'API avec cache
   */
  const loadPlan = async () => {
    // D'abord, essayer de charger depuis les données statiques
    const staticPlan = getPlanById(planId)
    if (staticPlan) {
      setPlan(staticPlan)
      setLoading(false)
      return
    }

    // Vérifier le cache
    const cachedPlan = getCachedPlanDetail(planId)
    if (cachedPlan) {
      setPlan(cachedPlan)
      setLoading(false)
    }

    // Charger depuis l'API
    try {
      const response = await fetch(`/api/plans/${planId}`)
      if (response.ok) {
        const foundPlan: Plan = await response.json()
        setPlan(foundPlan)
        // Mettre en cache
        cachePlanDetail(planId, foundPlan)
      } else {
        // Utiliser le cache si disponible
        if (cachedPlan) {
          setPlan(cachedPlan)
        }
      }
    } catch (error) {
      console.error('Erreur chargement plan:', error)
      // Utiliser le cache si disponible
      if (cachedPlan) {
        setPlan(cachedPlan)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
          <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-serif mb-4">Plan non trouvé</h1>
        <Button onClick={() => router.push('/plans')}>Retour aux plans</Button>
      </div>
    )
  }

  const dayData = plan.days?.[currentDay - 1]
  const progressPercent = plan.days?.length ? (completedDays.length / plan.days.length) * 100 : 0

  // Si pas de jours ou jour invalide
  if (!dayData || !plan.days || plan.days.length === 0) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-serif mb-4">{plan.title}</h1>
        <p className="text-muted-foreground mb-4">
          Ce plan n'a pas encore de contenu. Les jours de méditation doivent être ajoutés.
        </p>
        <Button onClick={() => router.push('/plans')}>Retour aux plans</Button>
      </div>
    )
  }

  /**
   * Marque le jour actuel comme terminé et passe au suivant
   */
  const completeDay = () => {
    if (!completedDays.includes(currentDay)) {
      setCompletedDays([...completedDays, currentDay])
    }
    if (currentDay < plan.days.length) {
      setCurrentDay(currentDay + 1)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/plans')}
          className="mb-4"
        >
          ← Retour aux plans
        </Button>
        {plan.imageUrl ? (
          <div 
            className="mb-4 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(plan.imageUrl!)}
          >
            <div className="relative w-full h-48">
              <Image
                src={plan.imageUrl}
                alt={plan.title}
                fill
                className="object-cover hover:opacity-90 transition-opacity"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </div>
        ) : null}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{plan.icon}</span>
          <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground">
            {plan.title}
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">{plan.description}</p>
      </motion.div>

      {/* Musique d'ambiance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <AmbientPlayer />
      </motion.div>

      {/* Progression */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Jour {currentDay} sur {plan.days.length}</span>
          <span>{Math.round(progressPercent)}% terminé</span>
        </div>
        <Progress value={progressPercent} />
      </motion.div>

      {/* Sélecteur de jour */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-3 sm:mx-0 px-3 sm:px-0"
      >
        {plan.days.map((day) => (
          <button
            key={day.day}
            onClick={() => setCurrentDay(day.day)}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${
              currentDay === day.day
                ? `bg-gradient-to-br ${plan.imageGradient} text-white`
                : completedDays.includes(day.day)
                ? 'bg-olive-100 dark:bg-olive-900/30 text-olive-600 dark:text-olive-400'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {completedDays.includes(day.day) ? '✓' : day.day}
          </button>
        ))}
      </motion.div>

      {/* Contenu du jour */}
      <motion.div
        key={currentDay}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <h2 className="text-base sm:text-lg md:text-xl font-serif font-medium">
          Jour {dayData.day} : {dayData.title}
        </h2>

        {/* Verset */}
        <Card className="verse-container border-0">
          <CardContent className="py-6">
            <p className="verse-text text-foreground mb-3 sm:mb-4 italic text-base sm:text-lg leading-relaxed">
              {dayData.verseText?.replace(/\s*—\s*[^—]+$/, '').trim() || dayData.verseText}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <p className="verse-reference text-muted-foreground text-sm">{dayData.verseRef}</p>
              <div className="flex gap-2">
                <AudioPlayer
                  text={dayData.verseText}
                  id={`plan-${plan.id}-day-${dayData.day}-verse`}
                  label="Écouter"
                />
                <ShareButton
                  reference={dayData.verseRef}
                  content={dayData.verseText}
                  variant="outline"
                  size="sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Méditation */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Méditation
            </h3>
            <AudioPlayer
              text={dayData.meditation}
              id={`plan-${plan.id}-day-${dayData.day}-meditation`}
              label="Écouter"
            />
          </div>
          <p className="text-foreground leading-relaxed">{dayData.meditation}</p>
        </div>

        {/* Prière */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Prière
            </h3>
            <AudioPlayer
              text={dayData.prayer}
              id={`plan-${plan.id}-day-${dayData.day}-prayer`}
              label="Écouter"
            />
          </div>
          <p className="text-foreground leading-relaxed italic">{dayData.prayer}</p>
        </div>

        {/* Écouter tout */}
        <div className="pt-2 sm:pt-4">
          <AudioPlayer
            text={`${dayData.verseText}. ... ${dayData.meditation}. ... ${dayData.prayer}`}
            id={`plan-${plan.id}-day-${dayData.day}-full`}
            label="🎧 Écouter la méditation complète"
            className="w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={completeDay} className="flex-1 w-full sm:w-auto">
            {currentDay < plan.days.length ? 'Jour suivant →' : '✓ Terminer le plan'}
          </Button>
        </div>

        {/* Message de fin */}
        {completedDays.length === plan.days.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-6 bg-gradient-to-br from-olive-100 to-ciel-100 dark:from-olive-900/20 dark:to-ciel-900/20 rounded-2xl"
          >
            <span className="text-4xl mb-3 block">🎉</span>
            <h3 className="text-lg font-serif font-medium mb-2">Félicitations !</h3>
            <p className="text-muted-foreground text-sm">
              Vous avez terminé le plan "{plan.title}".
              <br />
              Que Dieu continue à vous bénir dans votre marche.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Modal pour afficher l'image en plein écran */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
                <Image
                  src={selectedImage}
                  alt="Image du plan"
                  fill
                  className="object-contain rounded-lg"
                  sizes="100vw"
                  unoptimized
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
