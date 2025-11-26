'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AudioPlayer } from '@/components/audio-player'
import { useAppStore } from '@/stores/app-store'
import { getCachedDailyVerse } from '@/lib/offline-cache'
import { trackMeditationStarted, trackMeditationCompleted } from '@/lib/analytics'

/**
 * Structure d'une méditation guidée en 5 étapes
 */
const MEDITATION_STEPS = [
  {
    id: 'lire',
    title: 'Lire',
    instruction: 'Lisez le passage biblique lentement, en prenant le temps de savourer chaque mot.',
    duration: 60,
    icon: '📖',
  },
  {
    id: 'comprendre',
    title: 'Comprendre',
    instruction: 'Réfléchissez au sens du texte. Que dit ce passage ? Quel est le contexte ?',
    duration: 60,
    icon: '💡',
  },
  {
    id: 'mediter',
    title: 'Méditer',
    instruction: 'Laissez la Parole pénétrer votre cœur. Qu\'est-ce que Dieu veut vous dire aujourd\'hui ?',
    duration: 90,
    icon: '🙏',
  },
  {
    id: 'prier',
    title: 'Prier',
    instruction: 'Parlez à Dieu de ce que vous avez découvert. Ouvrez-lui votre cœur.',
    duration: 60,
    icon: '✨',
  },
  {
    id: 'appliquer',
    title: 'Appliquer',
    instruction: 'Comment allez-vous mettre cette parole en pratique aujourd\'hui ?',
    duration: 30,
    icon: '🎯',
  },
]

/**
 * Données de méditation par défaut (fallback)
 */
const DEFAULT_MEDITATION = {
  verse: {
    reference: 'Psaume 23:1-3',
    content: 'L\'Éternel est mon berger: je ne manquerai de rien. Il me fait reposer dans de verts pâturages, il me dirige près des eaux paisibles. Il restaure mon âme.',
  },
  theme: 'La confiance en Dieu',
  reflection: 'Le psalmiste nous invite à nous abandonner complètement à la direction divine. Comme des brebis qui font confiance à leur berger, nous pouvons trouver repos et restauration en Dieu.',
}

interface GuidedMeditation {
  id: string
  title: string
  description: string | null
  verseRef: string
  verseText: string
  theme: string | null
  reflection: string
  estimatedDuration: number
  audioUrl: string | null
}

/**
 * Page de méditation guidée
 * Guide l'utilisateur à travers les 5 étapes de la méditation
 */
export default function MeditationPage() {
  const [currentStep, setCurrentStep] = useState(-1) // -1 = intro, 0-4 = étapes, 5 = fin
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [meditationData, setMeditationData] = useState(DEFAULT_MEDITATION)
  const [loadingVerse, setLoadingVerse] = useState(true)
  const [meditations, setMeditations] = useState<GuidedMeditation[]>([])
  const [selectedMeditationId, setSelectedMeditationId] = useState<string | null>(null)
  const [loadingMeditations, setLoadingMeditations] = useState(true)
  const { setLastMeditationDate, incrementStreak } = useAppStore()

  // Charger les méditations disponibles
  useEffect(() => {
    async function loadMeditations() {
      try {
        const response = await fetch('/api/meditations')
        if (response.ok) {
          const data = await response.json()
          setMeditations(data.meditations || [])
        }
      } catch (error) {
        console.error('Erreur chargement méditations:', error)
      } finally {
        setLoadingMeditations(false)
      }
    }
    loadMeditations()
  }, [])

  // Charger une méditation spécifique ou le verset du jour
  useEffect(() => {
    async function loadMeditation() {
      if (selectedMeditationId) {
        try {
          const response = await fetch(`/api/meditations/${selectedMeditationId}`)
          if (response.ok) {
            const data = await response.json()
            const meditation = data.meditation
            setMeditationData({
              verse: {
                reference: meditation.verseRef,
                content: meditation.verseText,
              },
              theme: meditation.theme || meditation.title,
              reflection: meditation.reflection,
            })
            setLoadingVerse(false)
            return
          }
        } catch (error) {
          console.error('Erreur chargement méditation:', error)
        }
      }

      // Fallback : charger le verset du jour
      const cachedVerse = getCachedDailyVerse()
      if (cachedVerse) {
        setMeditationData({
          verse: cachedVerse,
          theme: 'Méditation du jour',
          reflection: 'Prenez un moment pour méditer ce verset que Dieu vous donne aujourd\'hui. Laissez Sa Parole transformer votre cœur et votre esprit.',
        })
        setLoadingVerse(false)
      }

      try {
        const response = await fetch('/api/bible/daily-verse')
        if (response.ok) {
          const verse = await response.json()
          setMeditationData({
            verse,
            theme: 'Méditation du jour',
            reflection: 'Prenez un moment pour méditer ce verset que Dieu vous donne aujourd\'hui. Laissez Sa Parole transformer votre cœur et votre esprit.',
          })
          setLoadingVerse(false)
        } else if (cachedVerse) {
          // Utiliser le cache si la requête échoue
          setMeditationData({
            verse: cachedVerse,
            theme: 'Méditation du jour',
            reflection: 'Prenez un moment pour méditer ce verset que Dieu vous donne aujourd\'hui. Laissez Sa Parole transformer votre cœur et votre esprit.',
          })
          setLoadingVerse(false)
        } else {
          setMeditationData(DEFAULT_MEDITATION)
          setLoadingVerse(false)
        }
      } catch (error) {
        console.error('Erreur chargement verset:', error)
        // Utiliser le cache ou les données par défaut
        if (cachedVerse) {
          setMeditationData({
            verse: cachedVerse,
            theme: 'Méditation du jour',
            reflection: 'Prenez un moment pour méditer ce verset que Dieu vous donne aujourd\'hui. Laissez Sa Parole transformer votre cœur et votre esprit.',
          })
        } else {
          setMeditationData(DEFAULT_MEDITATION)
        }
        setLoadingVerse(false)
      }
    }
    loadMeditation()
  }, [selectedMeditationId])

  // Timer pour chaque étape
  useEffect(() => {
    if (currentStep < 0 || currentStep >= MEDITATION_STEPS.length || isPaused) return

    const step = MEDITATION_STEPS[currentStep]
    if (timeLeft === 0) {
      setTimeLeft(step.duration)
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Passage à l'étape suivante
          if (currentStep < MEDITATION_STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
            return MEDITATION_STEPS[currentStep + 1].duration
          } else {
            setCurrentStep(MEDITATION_STEPS.length) // Fin
            return 0
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentStep, isPaused, timeLeft])

  // Track meditation start
  useEffect(() => {
    if (currentStep === 0) {
      trackMeditationStarted()
    }
  }, [currentStep])

  // Marquer la méditation comme terminée et sauvegarder la session
  useEffect(() => {
    if (currentStep === MEDITATION_STEPS.length) {
      const today = new Date().toISOString().split('T')[0]
      setLastMeditationDate(today)
      incrementStreak()

      // Sauvegarder la session de méditation
      async function saveMeditationSession() {
        try {
          const totalDuration = MEDITATION_STEPS.reduce((acc, step) => acc + step.duration, 0)
          await fetch('/api/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              duration: totalDuration,
              verseRef: meditationData.verse.reference,
            }),
          })
          // Track meditation completed
          trackMeditationCompleted(totalDuration)
        } catch (error) {
          console.error('Erreur sauvegarde session:', error)
        }
      }
      saveMeditationSession()
    }
  }, [currentStep, setLastMeditationDate, incrementStreak, meditationData])

  /**
   * Démarre la méditation
   */
  const startMeditation = () => {
    setCurrentStep(0)
    setTimeLeft(MEDITATION_STEPS[0].duration)
  }

  /**
   * Passe à l'étape suivante
   */
  const nextStep = () => {
    if (currentStep < MEDITATION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      setTimeLeft(MEDITATION_STEPS[currentStep + 1].duration)
    } else {
      setCurrentStep(MEDITATION_STEPS.length)
    }
  }

  /**
   * Lecture TTS de l'instruction
   */
  const speakInstruction = () => {
    if ('speechSynthesis' in window && currentStep >= 0 && currentStep < MEDITATION_STEPS.length) {
      if (isPlaying) {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
        return
      }

      const step = MEDITATION_STEPS[currentStep]
      const utterance = new SpeechSynthesisUtterance(step.instruction)
      utterance.lang = 'fr-FR'
      utterance.rate = 0.85
      utterance.onend = () => setIsPlaying(false)
      setIsPlaying(true)
      window.speechSynthesis.speak(utterance)
    }
  }

  /**
   * Formate le temps en mm:ss
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Calcul de la progression totale
  const totalDuration = MEDITATION_STEPS.reduce((acc, step) => acc + step.duration, 0)
  const elapsedDuration = MEDITATION_STEPS.slice(0, currentStep).reduce((acc, step) => acc + step.duration, 0) + (currentStep >= 0 && currentStep < MEDITATION_STEPS.length ? MEDITATION_STEPS[currentStep].duration - timeLeft : 0)
  const progressPercent = currentStep >= MEDITATION_STEPS.length ? 100 : (elapsedDuration / totalDuration) * 100

  // Sélectionner une méditation
  const handleSelectMeditation = (meditationId: string) => {
    setSelectedMeditationId(meditationId)
    setCurrentStep(-1) // Réinitialiser à l'intro
  }

  return (
    <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      {/* Sélection de méditation */}
      {currentStep === -1 && meditations.length > 0 && !selectedMeditationId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="py-6">
              <h2 className="text-lg font-semibold mb-4">Choisir une méditation</h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setSelectedMeditationId(null)}
                >
                  📅 Méditation du jour (verset quotidien)
                </Button>
                {meditations.map((meditation) => (
                  <Button
                    key={meditation.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => handleSelectMeditation(meditation.id)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{meditation.title}</div>
                      {meditation.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {meditation.description}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {meditation.verseRef} • {meditation.estimatedDuration} min
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Introduction */}
      <AnimatePresence mode="wait">
        {currentStep === -1 && (selectedMeditationId || meditations.length === 0) && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <h1 className="text-3xl font-serif font-semibold mb-2">Méditation du jour</h1>
            {loadingVerse ? (
              <div className="space-y-4 mb-8">
                <div className="h-4 bg-muted rounded w-1/3 mx-auto animate-pulse" />
                <div className="h-20 bg-muted rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-8">{meditationData.theme}</p>

                {/* Verset */}
                <Card className="verse-container border-0 mb-8">
                  <CardContent className="py-6">
                    <p className="verse-text text-foreground/90 mb-3">
                      « {meditationData.verse.content} »
                    </p>
                    <p className="verse-reference">— {meditationData.verse.reference}</p>
                  </CardContent>
                </Card>

                {/* Réflexion */}
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {meditationData.reflection}
                </p>
              </>
            )}

            {/* Étapes preview */}
            <div className="flex justify-center gap-2 mb-8">
              {MEDITATION_STEPS.map((step) => (
                <div
                  key={step.id}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg"
                  title={step.title}
                >
                  {step.icon}
                </div>
              ))}
            </div>

            <Button size="lg" onClick={startMeditation} className="px-8">
              Commencer la méditation
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Durée : environ 5 minutes
            </p>
          </motion.div>
        )}

        {/* Étapes de méditation */}
        {currentStep >= 0 && currentStep < MEDITATION_STEPS.length && (
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center"
          >
            {/* Progression */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Étape {currentStep + 1} sur {MEDITATION_STEPS.length}</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} />
            </div>

            {/* Icône et titre */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-olive-100 to-ciel-100 dark:from-olive-900/30 dark:to-ciel-900/30 flex items-center justify-center text-4xl"
            >
              {MEDITATION_STEPS[currentStep].icon}
            </motion.div>

            <h2 className="text-2xl font-serif font-semibold mb-4">
              {MEDITATION_STEPS[currentStep].title}
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto">
              {MEDITATION_STEPS[currentStep].instruction}
            </p>

            {/* Affichage du passage biblique uniquement à l'étape "Lire" */}
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Card className="verse-container border-0 max-w-2xl mx-auto">
                  <CardContent className="py-6 px-4 sm:px-6">
                    <div className="flex justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-olive-400/60"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <p className="verse-text text-center text-foreground/90 mb-4 px-2 text-base sm:text-lg leading-relaxed">
                      {meditationData.verse.content}
                    </p>
                    <p className="verse-reference text-center mb-4 text-sm text-muted-foreground">
                      — {meditationData.verse.reference}
                    </p>
                    <div className="flex justify-center">
                      <AudioPlayer
                        text={meditationData.verse.content}
                        id={`meditation-verse-${meditationData.verse.reference.replace(/\s+/g, '-')}`}
                        label="Écouter le passage"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Timer */}
            <div className="mb-8">
              <span className="text-5xl font-light text-foreground tabular-nums">
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Contrôles */}
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <PlayIcon className="w-5 h-5" /> : <PauseIcon className="w-5 h-5" />}
              </Button>
              <Button variant="outline" size="icon" onClick={speakInstruction}>
                {isPlaying ? <VolumeOffIcon className="w-5 h-5" /> : <VolumeIcon className="w-5 h-5" />}
              </Button>
              <Button onClick={nextStep}>
                {currentStep < MEDITATION_STEPS.length - 1 ? 'Étape suivante' : 'Terminer'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Fin de méditation */}
        {currentStep === MEDITATION_STEPS.length && (
          <motion.div
            key="end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-olive-400 to-ciel-400 flex items-center justify-center"
            >
              <CheckIcon className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-3xl font-serif font-semibold mb-4">
              Méditation terminée
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Que le Seigneur vous bénisse et vous garde tout au long de cette journée.
            </p>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setCurrentStep(-1)}>
                Recommencer
              </Button>
              <Button asChild>
                <a href="/journal">Écrire dans mon journal</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Icônes
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
    </svg>
  )
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>
  )
}

function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
  )
}

function VolumeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}


