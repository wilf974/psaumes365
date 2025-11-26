'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

interface JournalEntry {
  id: string
  content: string
  verseRef: string | null
  createdAt: string
}

/**
 * Page du journal spirituel
 * Permet de créer, lire et supprimer des entrées de journal
 */
export default function JournalPage() {
  const { data: session } = useSession()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isWriting, setIsWriting] = useState(false)
  const [content, setContent] = useState('')
  const [verseRef, setVerseRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)

  // Charger les entrées depuis l'API
  useEffect(() => {
    if (session) {
      fetchEntries()
    }
  }, [session])

  /**
   * Récupère les entrées du journal
   */
  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/journal')
      if (response.ok) {
        const data = await response.json()
        setEntries(data)
      }
    } catch (error) {
      console.error('Erreur chargement journal:', error)
    }
  }

  /**
   * Crée une nouvelle entrée
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, verseRef: verseRef || null }),
      })

      if (response.ok) {
        const newEntry = await response.json()
        setEntries([newEntry, ...entries])
        setContent('')
        setVerseRef('')
        setIsWriting(false)
      }
    } catch (error) {
      console.error('Erreur création entrée:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Supprime une entrée
   */
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEntries(entries.filter((entry) => entry.id !== id))
        setSelectedEntry(null)
      }
    } catch (error) {
      console.error('Erreur suppression entrée:', error)
    }
  }

  /**
   * Formate la date
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  /**
   * Obtient la date relative
   */
  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return 'Hier'
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    return formatDate(dateString)
  }

  return (
    <div className="container max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-foreground mb-2">
            Journal spirituel
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Notez ce que le Saint-Esprit met sur votre cœur.
          </p>
        </div>
        <Button onClick={() => setIsWriting(true)} className="hidden sm:flex">
          <PenIcon className="w-4 h-4 mr-2" />
          Nouvelle entrée
        </Button>
      </motion.div>

      {/* Formulaire d'écriture */}
      <AnimatePresence>
        {isWriting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nouvelle entrée</CardTitle>
                <CardDescription>
                  {formatDate(new Date().toISOString())}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="verseRef">Verset lié (optionnel)</Label>
                    <Input
                      id="verseRef"
                      placeholder="Ex: Jean 3:16"
                      value={verseRef}
                      onChange={(e) => setVerseRef(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Votre réflexion</Label>
                    <Textarea
                      id="content"
                      placeholder="Qu'est-ce que Dieu vous a montré aujourd'hui ?"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="mt-1 min-h-[150px]"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={loading || !content.trim()}>
                      {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsWriting(false)
                        setContent('')
                        setVerseRef('')
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton mobile */}
      {!isWriting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="sm:hidden mb-6"
        >
          <Button onClick={() => setIsWriting(true)} className="w-full">
            <PenIcon className="w-4 h-4 mr-2" />
            Nouvelle entrée
          </Button>
        </motion.div>
      )}

      {/* Liste des entrées */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {entries.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <BookIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Votre journal est vide</h3>
              <p className="text-muted-foreground mb-4">
                Commencez à écrire vos réflexions spirituelles.
              </p>
              <Button onClick={() => setIsWriting(true)}>
                Écrire ma première entrée
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-1">
                          {getRelativeDate(entry.createdAt)}
                        </p>
                        {entry.verseRef && (
                          <p className="text-sm text-primary font-medium mb-2">
                            📖 {entry.verseRef}
                          </p>
                        )}
                        <p className="text-foreground line-clamp-2">
                          {entry.content}
                        </p>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modal détail entrée */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-2xl shadow-lg max-w-lg w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedEntry.createdAt)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedEntry(null)}
                  >
                    <CloseIcon className="w-5 h-5" />
                  </Button>
                </div>

                {selectedEntry.verseRef && (
                  <p className="text-primary font-medium mb-4">
                    📖 {selectedEntry.verseRef}
                  </p>
                )}

                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedEntry.content}
                </p>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(selectedEntry.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Icônes
function PenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
    </svg>
  )
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}


