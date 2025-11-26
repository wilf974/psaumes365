'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShareButton } from '@/components/ui/share-button'
import { AudioPlayer } from '@/components/audio-player'
import { trackVerseRead, trackFavoriteAdded, trackAudioPlayed } from '@/lib/analytics'

interface VerseCardProps {
  reference: string
  content: string
  showAudio?: boolean
  useElevenLabs?: boolean
  showFavorite?: boolean
}

/**
 * Composant d'affichage d'un verset biblique
 * Inclut la lecture audio via ElevenLabs ou Web Speech API
 */
export function VerseCard({ reference, content, showAudio = true, useElevenLabs = false, showFavorite = true }: VerseCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loadingFav, setLoadingFav] = useState(false)
  const [commentary, setCommentary] = useState<{ commentary: string; theme?: string; author?: string } | null>(null)
  const [loadingCommentary, setLoadingCommentary] = useState(false)
  const [showCommentary, setShowCommentary] = useState(false)

  // Vérifier si le verset est en favori
  useEffect(() => {
    checkFavorite()
  }, [reference])

  // Charger le commentaire si disponible
  useEffect(() => {
    loadCommentary()
  }, [reference])

  const loadCommentary = async () => {
    setLoadingCommentary(true)
    try {
      const response = await fetch(`/api/bible/comments?verseRef=${encodeURIComponent(reference)}`)
      if (response.ok) {
        const data = await response.json()
        if (data.comment) {
          setCommentary(data.comment)
        }
      }
    } catch (error) {
      console.error('Erreur chargement commentaire:', error)
    } finally {
      setLoadingCommentary(false)
    }
  }

  const checkFavorite = async () => {
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const favorites = await response.json()
        setIsFavorite(favorites.some((f: { verseRef: string }) => f.verseRef === reference))
      }
    } catch {
      // Ignorer si non connecté
    }
  }

  const toggleFavorite = async () => {
    setLoadingFav(true)
    try {
      if (isFavorite) {
        await fetch(`/api/favorites?verseRef=${encodeURIComponent(reference)}`, {
          method: 'DELETE',
        })
        setIsFavorite(false)
      } else {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verseRef: reference, verseText: content }),
        })
        if (response.ok) {
          setIsFavorite(true)
          trackFavoriteAdded(reference)
        }
      }
    } catch (error) {
      console.error('Erreur favori:', error)
    } finally {
      setLoadingFav(false)
    }
  }

  /**
   * Lit le verset à voix haute via Web Speech API (fallback)
   */
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
        return
      }

      const utterance = new SpeechSynthesisUtterance(content)
      utterance.lang = 'fr-FR'
      utterance.rate = 0.85
      utterance.pitch = 1

      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)

      setIsPlaying(true)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="verse-container border-0 shadow-none">
        <CardContent className="p-0">
          {/* Icône de citation */}
          <div className="flex justify-center mb-4">
            <svg
              className="w-8 h-8 text-olive-400/60"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          {/* Texte du verset */}
          <p className="verse-text text-center text-foreground/90 mb-4 px-4">
            {content}
          </p>

          {/* Référence */}
          <p className="verse-reference text-center mb-4">
            — {reference}
          </p>

          {/* Commentaire (si disponible) */}
          {commentary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: showCommentary ? 1 : 0, height: showCommentary ? 'auto' : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className="mt-4 mb-4 border-l-4 border-l-olive-400 bg-olive-50/50 dark:bg-olive-950/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {commentary.theme && (
                        <span className="text-xs font-semibold text-olive-600 dark:text-olive-400 uppercase tracking-wide">
                          {commentary.theme}
                        </span>
                      )}
                      {commentary.author && (
                        <p className="text-xs text-muted-foreground mt-1">
                          — {commentary.author}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCommentary(!showCommentary)}
                      className="h-6 w-6 p-0"
                    >
                      {showCommentary ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {showCommentary && (
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                      {commentary.commentary}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Bouton pour afficher le commentaire si disponible mais masqué */}
          {commentary && !showCommentary && (
            <div className="mb-4 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCommentary(true)}
                className="text-xs"
              >
                <BookOpenIcon className="w-3 h-3 mr-2" />
                Voir le commentaire
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-2 flex-wrap">
            {/* Bouton favori */}
            {showFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFavorite}
                disabled={loadingFav}
                className={isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground hover:text-foreground'}
              >
                {isFavorite ? (
                  <HeartFilledIcon className="w-4 h-4" />
                ) : (
                  <HeartIcon className="w-4 h-4" />
                )}
              </Button>
            )}

            {/* Bouton partage */}
            <ShareButton
              reference={reference}
              content={content}
              variant="ghost"
              size="sm"
            />

            {/* Bouton audio */}
            {showAudio && (
              useElevenLabs ? (
                <AudioPlayer
                  text={content}
                  id={`verse-${reference.replace(/\s+/g, '-')}`}
                  label="Écouter (IA)"
                />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSpeak}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isPlaying ? (
                    <>
                      <PauseIcon className="w-4 h-4 mr-2" />
                      Arrêter
                    </>
                  ) : (
                    <>
                      <SpeakerIcon className="w-4 h-4 mr-2" />
                      Écouter
                    </>
                  )}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
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

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  )
}

function HeartFilledIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  )
}

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

