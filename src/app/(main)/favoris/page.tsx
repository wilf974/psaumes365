'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ShareButton } from '@/components/ui/share-button'
import { AudioPlayer } from '@/components/audio-player'

interface Favorite {
  id: string
  verseRef: string
  verseText: string
  note: string | null
  createdAt: string
}

/**
 * Page des versets favoris
 */
export default function FavorisPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data)
      }
    } catch (error) {
      console.error('Erreur chargement favoris:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (verseRef: string) => {
    try {
      const response = await fetch(`/api/favorites?verseRef=${encodeURIComponent(verseRef)}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setFavorites(prev => prev.filter(f => f.verseRef !== verseRef))
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif text-foreground mb-2">
          ⭐ Mes Favoris
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {favorites.length} verset{favorites.length !== 1 ? 's' : ''} sauvegardé{favorites.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="py-12 text-center">
              <span className="text-5xl">📖</span>
              <p className="mt-4 text-muted-foreground">
                Vous n'avez pas encore de versets favoris.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Appuyez sur le cœur à côté d'un verset pour l'ajouter ici.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <AnimatePresence>
          {favorites.map((favorite, index) => (
            <motion.div
              key={favorite.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Header avec référence et actions */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-olive-600 dark:text-olive-400">
                      {favorite.verseRef}
                    </span>
                    <div className="flex gap-2">
                      <AudioPlayer
                        text={favorite.verseText}
                        id={`fav-${favorite.id}`}
                        label="🔊"
                        className="opacity-60 hover:opacity-100"
                      />
                      <ShareButton
                        reference={favorite.verseRef}
                        content={favorite.verseText}
                        variant="ghost"
                        size="sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(favorite.verseRef)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>

                  {/* Texte du verset */}
                  <p className="text-foreground/90 leading-relaxed font-serif italic">
                    « {favorite.verseText} »
                  </p>

                  {/* Note personnelle */}
                  {favorite.note && (
                    <div className="mt-4 pt-3 border-t border-muted">
                      <p className="text-sm text-muted-foreground">
                        📝 {favorite.note}
                      </p>
                    </div>
                  )}

                  {/* Date d'ajout */}
                  <p className="text-xs text-muted-foreground mt-3">
                    Ajouté le {new Date(favorite.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* Citation encourageante */}
      {favorites.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-6"
        >
          <p className="text-sm text-muted-foreground italic">
            « Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            — Psaume 119:105
          </p>
        </motion.div>
      )}
    </div>
  )
}


