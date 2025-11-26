'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Skeleton } from '@/components/ui/skeleton'

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
  isActive: boolean
  createdById: string | null
  createdAt: string
  updatedAt: string
  createdBy?: {
    id: string
    name: string | null
    email: string
  }
}

/**
 * Composant de gestion des méditations guidées
 * Permet de créer, modifier, activer/désactiver et supprimer des méditations
 */
export function MeditationsManagement({ isAdmin }: { isAdmin: boolean }) {
  const [meditations, setMeditations] = useState<GuidedMeditation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMeditation, setEditingMeditation] = useState<GuidedMeditation | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    verseRef: '',
    verseText: '',
    theme: '',
    reflection: '',
    estimatedDuration: 5,
    audioUrl: '',
    isActive: true,
  })

  // Charger les méditations
  useEffect(() => {
    loadMeditations()
  }, [])

  const loadMeditations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/meditations')
      if (response.ok) {
        const data = await response.json()
        setMeditations(data.meditations || [])
      }
    } catch (error) {
      console.error('Erreur chargement méditations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingMeditation
        ? `/api/admin/meditations/${editingMeditation.id}`
        : '/api/admin/meditations'

      const method = editingMeditation ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await loadMeditations()
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur sauvegarde méditation:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (meditation: GuidedMeditation) => {
    setEditingMeditation(meditation)
    setFormData({
      title: meditation.title,
      description: meditation.description || '',
      verseRef: meditation.verseRef,
      verseText: meditation.verseText,
      theme: meditation.theme || '',
      reflection: meditation.reflection,
      estimatedDuration: meditation.estimatedDuration,
      audioUrl: meditation.audioUrl || '',
      isActive: meditation.isActive,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/meditations/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadMeditations()
        setDeleteConfirm(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur suppression méditation:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const toggleActive = async (meditation: GuidedMeditation) => {
    try {
      const response = await fetch(`/api/admin/meditations/${meditation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !meditation.isActive }),
      })

      if (response.ok) {
        await loadMeditations()
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur toggle active:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      verseRef: '',
      verseText: '',
      theme: '',
      reflection: '',
      estimatedDuration: 5,
      audioUrl: '',
      isActive: true,
    })
    setEditingMeditation(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Méditations guidées</h2>
          <p className="text-sm text-muted-foreground">
            Gérez les méditations guidées disponibles pour les utilisateurs
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
          {showForm ? 'Annuler' : '+ Nouvelle méditation'}
        </Button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>{editingMeditation ? 'Modifier la méditation' : 'Nouvelle méditation'}</CardTitle>
              <CardDescription>
                Créez une méditation guidée avec un verset et une réflexion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: Méditation sur la paix"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description (optionnel)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Introduction à la méditation..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="verseRef">Référence biblique *</Label>
                    <Input
                      id="verseRef"
                      value={formData.verseRef}
                      onChange={(e) => setFormData({ ...formData, verseRef: e.target.value })}
                      placeholder="Ex: Psaume 119:105"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="theme">Thème (optionnel)</Label>
                    <Input
                      id="theme"
                      value={formData.theme}
                      onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                      placeholder="Ex: La paix, La confiance"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="verseText">Texte du verset *</Label>
                    <Textarea
                      id="verseText"
                      value={formData.verseText}
                      onChange={(e) => setFormData({ ...formData, verseText: e.target.value })}
                      placeholder="Le texte complet du verset..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="reflection">Réflexion guidée *</Label>
                    <Textarea
                      id="reflection"
                      value={formData.reflection}
                      onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                      placeholder="Votre réflexion et guide de méditation..."
                      rows={6}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="estimatedDuration">Durée estimée (minutes) *</Label>
                    <Input
                      id="estimatedDuration"
                      type="number"
                      min="1"
                      max="60"
                      value={formData.estimatedDuration}
                      onChange={(e) =>
                        setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 5 })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="audioUrl">URL audio (optionnel)</Label>
                    <Input
                      id="audioUrl"
                      value={formData.audioUrl}
                      onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                      placeholder="/audio/meditation-1.mp3"
                    />
                  </div>

                  {isAdmin && (
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm">Méditation active</span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit">{editingMeditation ? 'Modifier' : 'Créer'}</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Liste des méditations */}
      <div className="space-y-4">
        {meditations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucune méditation créée pour le moment
            </CardContent>
          </Card>
        ) : (
          meditations.map((meditation) => (
            <Card key={meditation.id} className={!meditation.isActive ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{meditation.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {meditation.verseRef} • {meditation.estimatedDuration} min
                      {meditation.theme && ` • ${meditation.theme}`}
                    </CardDescription>
                    {meditation.description && (
                      <p className="text-sm text-muted-foreground mt-2">{meditation.description}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={meditation.isActive ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => toggleActive(meditation)}
                    >
                      {meditation.isActive ? '✅ Active' : '❌ Inactive'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(meditation)}>
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteConfirm(meditation.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Verset :</p>
                    <p className="text-sm italic text-muted-foreground">{meditation.verseText}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Réflexion :</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">{meditation.reflection}</p>
                  </div>
                  {meditation.createdBy && (
                    <p className="text-xs text-muted-foreground">
                      Créée par {meditation.createdBy.name || meditation.createdBy.email} le{' '}
                      {new Date(meditation.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog de confirmation de suppression */}
      <ConfirmDialog
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Supprimer la méditation"
        description="Êtes-vous sûr de vouloir supprimer cette méditation ? Cette action est irréversible."
      />
    </div>
  )
}

