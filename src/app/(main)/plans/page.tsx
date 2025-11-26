'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { cachePlansList, getCachedPlansList } from '@/lib/offline-cache'
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
 * Page des plans de méditation
 * Affiche les plans disponibles (BDD + plans système) et la progression de l'utilisateur
 */
export default function PlansPage() {
  const [filter, setFilter] = useState<string | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  /**
   * Récupère tous les plans depuis l'API avec cache
   */
  const fetchPlans = async () => {
    // Vérifier le cache d'abord
    const cachedPlans = getCachedPlansList()
    if (cachedPlans && cachedPlans.length > 0) {
      setPlans(cachedPlans)
      setLoading(false)
    }

    try {
      const response = await fetch('/api/plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data)
        // Mettre en cache
        cachePlansList(data)
      } else {
        // Utiliser le cache si disponible
        if (cachedPlans && cachedPlans.length > 0) {
          setPlans(cachedPlans)
        }
      }
    } catch (error) {
      console.error('Erreur chargement plans:', error)
      // Utiliser le cache si disponible
      if (cachedPlans && cachedPlans.length > 0) {
        setPlans(cachedPlans)
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredPlans = filter
    ? plans.filter((plan) => plan.theme === filter)
    : plans

  // Extraire les thèmes uniques depuis les plans
  const themes = Array.from(
    new Set(plans.map((p) => p.theme))
  ).map((themeId) => {
    const themeLabels: Record<string, string> = {
      paix: 'Paix',
      identite: 'Identité',
      foi: 'Foi',
      combat: 'Combat',
      guerison: 'Guérison',
      sagesse: 'Sagesse',
      gratitude: 'Gratitude',
      amour: 'Amour',
      perseverance: 'Persévérance',
    }
    return {
      id: themeId,
      label: themeLabels[themeId] || themeId,
    }
  })

  return (
    <div className="container max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-foreground mb-2">
          Plans de méditation
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Choisissez un thème et engagez-vous dans un parcours spirituel de 7 jours.
        </p>
      </motion.div>

      {/* Filtres par thème */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-3 sm:mx-0 px-3 sm:px-0"
      >
        <Button
          variant={filter === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter(null)}
          className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
        >
          Tous ({plans.length})
        </Button>
        {themes.map((theme) => {
          const count = plans.filter((p) => p.theme === theme.id).length
          if (count === 0) return null
          return (
            <Button
              key={theme.id}
              variant={filter === theme.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(theme.id)}
              className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              {theme.label} ({count})
            </Button>
          )
        })}
      </motion.div>

      {/* Chargement */}
      {loading && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Plans en cours - À implémenter avec la BDD */}
      {/* {Object.keys(USER_PROGRESS).length > 0 && !filter && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-lg font-medium text-foreground mb-4">En cours</h2>
          <div className="grid gap-4">
            {plans.filter((plan) => USER_PROGRESS[plan.id]).map((plan) => {
              const progress = USER_PROGRESS[plan.id]
              const progressPercent = (progress.completedDays.length / plan.durationDays) * 100

              return (
                <Card key={plan.id} className="overflow-hidden">
                  <div className="flex">
                    <div className={`w-2 bg-gradient-to-b ${plan.imageGradient}`} />
                    <CardContent className="flex-1 py-4 px-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{plan.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Jour {progress.currentDay} sur {plan.durationDays}
                          </p>
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/plans/${plan.id}`}>Continuer</Link>
                        </Button>
                      </div>
                      <Progress value={progressPercent} />
                    </CardContent>
                  </div>
                </Card>
              )
            })}
          </div>
        </motion.section>
      )} */}

      {/* Tous les plans */}
      {!loading && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-base sm:text-lg font-medium text-foreground mb-3 sm:mb-4">
            {filter ? `Plans "${themes.find((t) => t.id === filter)?.label}"` : 'Découvrir les plans'}
          </h2>
          {filteredPlans.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Aucun plan trouvé</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link href={`/plans/${plan.id}`}>
                <Card className="h-full cursor-pointer hover:shadow-lg transition-all group overflow-hidden">
                  <div 
                    className={`w-full ${plan.imageUrl ? 'h-48' : 'h-24'} ${plan.imageUrl ? '' : `bg-gradient-to-br ${plan.imageGradient}`} flex items-center justify-center relative overflow-hidden`}
                    onClick={(e) => {
                      if (plan.imageUrl) {
                        e.preventDefault()
                        e.stopPropagation()
                        setSelectedImage(plan.imageUrl)
                      }
                    }}
                  >
                    {plan.imageUrl ? (
                      <Image
                        src={plan.imageUrl}
                        alt={plan.title}
                        fill
                        className="object-contain cursor-pointer bg-muted/20"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <span className="text-4xl opacity-60 group-hover:scale-110 transition-transform">
                        {plan.icon}
                      </span>
                    )}
                    <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-white">
                      {plan.durationDays} jours
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{plan.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      )}

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
