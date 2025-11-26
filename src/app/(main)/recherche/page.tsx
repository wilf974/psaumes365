'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { VerseCard } from '@/components/bible/verse-card'
import { AudioPlayer } from '@/components/audio-player'
import { ShareButton } from '@/components/ui/share-button'
import { trackSearch } from '@/lib/analytics'
import { Search, X, BookOpen } from 'lucide-react'

interface SearchResult {
  id: string
  reference: string
  content: string
  bookId: string
  chapterId: string
  verseId: string
}

/**
 * Page de recherche de versets bibliques
 * Permet de rechercher par texte ou par référence
 */
export default function RecherchePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Effectue la recherche avec un debounce
   */
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (query.trim().length < 2) {
      setResults([])
      setHasSearched(false)
      return
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query)
    }, 500) // Debounce de 500ms

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query])

  /**
   * Effectue la recherche
   */
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/bible/search?q=${encodeURIComponent(searchQuery)}&limit=30`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erreur lors de la recherche')
        setResults([])
        return
      }

      const results = data.results || []
      setResults(results)
      // Track search
      trackSearch(searchQuery, results.length)
    } catch (err) {
      console.error('Erreur recherche:', err)
      setError('Erreur lors de la recherche')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Recherche manuelle au clic
   */
  const handleSearch = () => {
    if (query.trim().length >= 2) {
      performSearch(query)
    }
  }

  /**
   * Efface la recherche
   */
  const handleClear = () => {
    setQuery('')
    setResults([])
    setError(null)
    setHasSearched(false)
  }

  return (
    <div className="container max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-foreground mb-2">
          🔍 Recherche de versets
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Recherchez un verset par texte ou par référence (ex: "Jean 3:16", "Psaume 23")
        </p>
      </motion.div>

      {/* Barre de recherche */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un verset... (ex: 'amour', 'Jean 3:16', 'Psaume 23')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              className="pl-10 pr-10 h-12 text-base"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={handleClear}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading || query.trim().length < 2}
            className="h-12 px-6"
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </Button>
        </div>
        {query.trim().length > 0 && query.trim().length < 2 && (
          <p className="text-xs text-muted-foreground mt-2 ml-1">
            Saisissez au moins 2 caractères
          </p>
        )}
      </motion.div>

      {/* Résultats */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-0">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="p-6 text-center">
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : hasSearched && results.length === 0 ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-0">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Aucun verset trouvé pour "{query}"
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Essayez avec d'autres mots-clés ou une référence biblique
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {results.length} verset{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
              </p>
            </div>
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <VerseCard
                        reference={result.reference}
                        content={result.content}
                        showAudio={false}
                        showFavorite={true}
                      />
                      <div className="flex justify-center gap-2 flex-wrap">
                        <AudioPlayer
                          text={result.content}
                          id={`search-${result.id}`}
                          label="🎧 Écouter"
                        />
                        <ShareButton
                          reference={result.reference}
                          content={result.content}
                          variant="outline"
                          size="sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Suggestions si aucune recherche */}
      {!hasSearched && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="border-0 bg-muted/30">
            <CardContent className="p-6">
              <h3 className="font-medium mb-3">💡 Suggestions de recherche</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Recherchez par mots-clés : "amour", "paix", "foi", "espérance"</p>
                <p>• Recherchez par référence : "Jean 3:16", "Psaume 23", "Romains 8:28"</p>
                <p>• Recherchez des passages : "Psaume 23:1-6", "1 Corinthiens 13:4-7"</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

