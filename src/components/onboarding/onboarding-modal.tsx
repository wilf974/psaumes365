'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, BookOpen, Heart, Calendar, Search, Share2, Music } from 'lucide-react'

interface OnboardingModalProps {
  isOpen: boolean
  onComplete: () => void
}

/**
 * Modal d'onboarding pour les nouveaux utilisateurs
 * Présente les fonctionnalités principales de l'application
 */
export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: 'Bienvenue sur Psaumes365 !',
      description: 'Votre compagnon quotidien pour méditer la Parole de Dieu.',
      icon: '📖',
      content: (
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Découvrez une application gratuite, sans publicité, dédiée à votre croissance spirituelle.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-2xl mb-1">📖</p>
              <p className="text-xs font-medium">Verset du jour</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-2xl mb-1">🧘</p>
              <p className="text-xs font-medium">Méditation guidée</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-2xl mb-1">📅</p>
              <p className="text-xs font-medium">Plans thématiques</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-2xl mb-1">✍️</p>
              <p className="text-xs font-medium">Journal spirituel</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Verset du jour',
      description: 'Chaque jour, un nouveau verset pour nourrir votre foi.',
      icon: <BookOpen className="w-8 h-8 text-olive-500" />,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-beige-100 to-sable-100 dark:from-beige-900/20 dark:to-sable-900/20 border border-beige-200 dark:border-beige-800/30">
            <p className="text-center italic text-foreground mb-2">
              "Ta parole est une lampe à mes pieds, et une lumière sur mon sentier."
            </p>
            <p className="text-center text-sm text-muted-foreground">— Psaume 119:105</p>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-olive-500">✓</span>
              Écoutez le verset avec la voix IA
            </li>
            <li className="flex items-center gap-2">
              <span className="text-olive-500">✓</span>
              Ajoutez-le à vos favoris
            </li>
            <li className="flex items-center gap-2">
              <span className="text-olive-500">✓</span>
              Partagez-le avec vos proches
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Plans de méditation',
      description: 'Suivez des parcours thématiques de 7, 14 ou 30 jours.',
      icon: <Calendar className="w-8 h-8 text-ciel-500" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-2xl mb-2">🕊️</p>
              <p className="font-medium text-sm">Paix intérieure</p>
              <p className="text-xs text-muted-foreground mt-1">7 jours</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-2xl mb-2">⚔️</p>
              <p className="font-medium text-sm">Combat spirituel</p>
              <p className="text-xs text-muted-foreground mt-1">7 jours</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-ciel-500">✓</span>
              Plus de 10 plans disponibles
            </li>
            <li className="flex items-center gap-2">
              <span className="text-ciel-500">✓</span>
              Méditation guidée chaque jour
            </li>
            <li className="flex items-center gap-2">
              <span className="text-ciel-500">✓</span>
              Suivez votre progression
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Recherche et partage',
      description: 'Trouvez et partagez facilement vos versets préférés.',
      icon: <Search className="w-8 h-8 text-sable-500" />,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3 mb-3">
              <Search className="w-5 h-5 text-sable-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Recherche de versets</p>
                <p className="text-xs text-muted-foreground">Par texte ou référence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-olive-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Partage facile</p>
                <p className="text-xs text-muted-foreground">Facebook, Twitter, WhatsApp</p>
              </div>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-sable-500">✓</span>
              Recherchez par mots-clés
            </li>
            <li className="flex items-center gap-2">
              <span className="text-sable-500">✓</span>
              Partagez en un clic
            </li>
            <li className="flex items-center gap-2">
              <span className="text-sable-500">✓</span>
              Sauvegardez vos favoris
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Musique d\'ambiance',
      description: 'Créez une atmosphère propice à la méditation.',
      icon: <Music className="w-8 h-8 text-olive-500" />,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-olive-100 to-ciel-100 dark:from-olive-900/20 dark:to-ciel-900/20">
            <div className="flex items-center gap-3">
              <Music className="w-6 h-6 text-olive-500" />
              <div className="flex-1">
                <p className="font-medium">Musique d'ambiance</p>
                <p className="text-sm text-muted-foreground">4 pistes instrumentales disponibles</p>
              </div>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-olive-500">✓</span>
              Musique de fond apaisante
            </li>
            <li className="flex items-center gap-2">
              <span className="text-olive-500">✓</span>
              Contrôle du volume
            </li>
            <li className="flex items-center gap-2">
              <span className="text-olive-500">✓</span>
              Disponible sur toutes les pages
            </li>
          </ul>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    try {
      await fetch('/api/user/onboarding', {
        method: 'POST',
      })
      onComplete()
    } catch (error) {
      console.error('Erreur onboarding:', error)
      onComplete() // Continuer même en cas d'erreur
    }
  }

  if (!isOpen) return null

  const currentStepData = steps[currentStep]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={handleComplete}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={handleComplete}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-olive-400 to-ciel-400 flex items-center justify-center">
                    {typeof currentStepData.icon === 'string' ? (
                      <span className="text-3xl">{currentStepData.icon}</span>
                    ) : (
                      currentStepData.icon
                    )}
                  </div>
                  <div className="text-center">
                    <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {currentStepData.description}
                    </CardDescription>
                  </div>
                </div>
                {/* Indicateur de progression */}
                <div className="flex gap-1.5 justify-center">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentStep
                          ? 'w-8 bg-primary'
                          : index < currentStep
                          ? 'w-4 bg-primary/50'
                          : 'w-4 bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStepData.content}
                </motion.div>

                {/* Boutons de navigation */}
                <div className="flex justify-between gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex-1"
                  >
                    Précédent
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1"
                  >
                    {currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

