'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface PlansManagementProps {
  isAdmin: boolean
}

interface Plan {
  id: string
  title: string
  description: string
  theme: string
  durationDays: number
  imageGradient?: string | null
  icon?: string | null
  isActive: boolean
  createdAt: string
  createdBy?: {
    name: string | null
    email: string
  } | null
  _count: {
    progress: number
  }
}

/**
 * Gestion des plans de méditation
 */
export function PlansManagement({ isAdmin }: PlansManagementProps) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/admin/plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data)
      }
    } catch (error) {
      console.error('Erreur chargement plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (plan: Plan) => {
    setEditingPlan(plan)
    setShowForm(true)
  }

  const handleDeleteClick = (plan: Plan) => {
    setPlanToDelete(plan)
  }

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return

    try {
      const response = await fetch(`/api/admin/plans/${planToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Recharger la liste complète depuis l'API pour s'assurer que les plans système supprimés ne réapparaissent pas
        await fetchPlans()
        setPlanToDelete(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de la suppression')
        setPlanToDelete(null)
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('Erreur lors de la suppression du plan')
      setPlanToDelete(null)
    }
  }

  const toggleActive = async (plan: Plan) => {
    try {
      const response = await fetch(`/api/admin/plans/${plan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !plan.isActive }),
      })

      if (response.ok) {
        setPlans(
          plans.map((p) =>
            p.id === plan.id ? { ...p, isActive: !p.isActive } : p
          )
        )
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      {/* Bouton créer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold">Plans de méditation</h2>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="w-full sm:w-auto">
          {showForm ? 'Annuler' : '+ Nouveau plan'}
        </Button>
      </div>

      {/* Formulaire création/édition */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <PlanForm
              plan={editingPlan}
              onSuccess={() => {
                setShowForm(false)
                setEditingPlan(null)
                fetchPlans()
              }}
              onCancel={() => {
                setShowForm(false)
                setEditingPlan(null)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des plans */}
      <div className="grid gap-4">
        {plans.map((plan) => (
          <Card key={plan.id} className={!plan.createdBy ? 'border-2 border-olive-200 dark:border-olive-800' : ''}>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="flex items-center gap-2 mb-2 text-base sm:text-lg">
                    {plan.icon && <span className="text-xl sm:text-2xl">{plan.icon}</span>}
                    <span className="break-words">{plan.title}</span>
                    {!plan.isActive && plan.createdBy && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        Inactif
                      </span>
                    )}
                    {!plan.createdBy && (
                      <span className="text-xs text-olive-600 dark:text-olive-400 bg-olive-50 dark:bg-olive-900/30 px-2 py-1 rounded">
                        Plan système
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm break-words">
                    {plan.theme} • {plan.durationDays} jours • {plan._count.progress} utilisateur{plan._count.progress !== 1 ? 's' : ''}
                    {plan.createdBy
                      ? ` • Créé par ${plan.createdBy.name || plan.createdBy.email}`
                      : ' • Plan par défaut'}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-shrink-0 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(plan)}
                    className="text-xs sm:text-sm flex-1 sm:flex-initial"
                  >
                    Modifier
                  </Button>
                  {plan.createdBy && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(plan)}
                      className="text-xs sm:text-sm flex-1 sm:flex-initial"
                    >
                      {plan.isActive ? 'Désactiver' : 'Activer'}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(plan)}
                    className="text-xs sm:text-sm flex-1 sm:flex-initial"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {plan.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Aucun plan trouvé</p>
          </CardContent>
        </Card>
      )}

      {/* Dialogue de confirmation de suppression */}
      <ConfirmDialog
        open={!!planToDelete}
        title="Supprimer le plan"
        description={
          planToDelete
            ? `Êtes-vous sûr de vouloir supprimer le plan "${planToDelete.title}" ?${
                !planToDelete.createdBy
                  ? ' Ce plan système sera supprimé de la liste.'
                  : ''
              } Cette action est irréversible et supprimera également toutes les données associées (progression des utilisateurs, etc.).`
            : ''
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPlanToDelete(null)}
      />
    </div>
  )
}

/**
 * Formulaire de création/édition de plan
 */
function PlanForm({
  plan,
  onSuccess,
  onCancel,
}: {
  plan: Plan | null
  onSuccess: () => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: plan?.title || '',
    description: plan?.description || '',
    theme: plan?.theme || '',
    durationDays: plan?.durationDays || 7,
    imageGradient: plan?.imageGradient || 'from-olive-400 to-ciel-400',
    icon: plan?.icon || '📖',
    imageUrl: plan?.imageUrl || null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(plan?.imageUrl || null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [days, setDays] = useState<Array<{
    dayNumber: number
    title: string
    verseRef: string
    verseText: string
    meditation: string
    prayer: string
  }>>([])
  const [loading, setLoading] = useState(false)
  const [loadingDays, setLoadingDays] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger les jours existants si on édite un plan
  useEffect(() => {
    if (plan?.id) {
      loadPlanDays()
    } else {
      // Initialiser les jours pour un nouveau plan
      const numDays = formData.durationDays || 7
            const newDays = Array.from({ length: numDays }, (_, i) => ({
              dayNumber: i + 1,
              title: `Jour ${i + 1}`,
              verseRef: '',
              verseText: '',
              meditation: '',
              prayer: '',
            }))
      setDays(newDays)
    }
  }, [plan?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Initialiser les jours selon durationDays (pour nouveau plan ou changement de durée)
  useEffect(() => {
    if (!plan?.id) {
      const numDays = formData.durationDays || 7
      if (days.length !== numDays) {
        const newDays = Array.from({ length: numDays }, (_, i) => {
          const existingDay = days[i]
          return {
            dayNumber: i + 1,
            title: existingDay?.title || `Jour ${i + 1}`,
            verseRef: existingDay?.verseRef || '',
            verseText: existingDay?.verseText || '',
            meditation: existingDay?.meditation || '',
            prayer: existingDay?.prayer || '',
          }
        })
        setDays(newDays)
      }
    }
  }, [formData.durationDays]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadPlanDays = async () => {
    if (!plan?.id) return
    
    setLoadingDays(true)
    try {
      const response = await fetch(`/api/admin/plans/${plan.id}`)
      if (response.ok) {
        const planData = await response.json()
        if (planData.days && Array.isArray(planData.days)) {
          const loadedDays = planData.days.map((day: any) => ({
            dayNumber: day.dayNumber || day.day,
            title: day.title || '',
            verseRef: day.verseRef || '',
            verseText: day.verseText || '',
            meditation: day.meditation || '',
            prayer: day.prayer || '',
          }))
          setDays(loadedDays)
          // Mettre à jour durationDays si nécessaire
          if (loadedDays.length > 0) {
            setFormData((prev) => ({
              ...prev,
              durationDays: loadedDays.length,
            }))
          }
        }
        // Charger l'image si elle existe
        if (planData.imageUrl) {
          setFormData((prev) => ({
            ...prev,
            imageUrl: planData.imageUrl,
          }))
          setImagePreview(planData.imageUrl)
        }
      }
    } catch (error) {
      console.error('Erreur chargement jours:', error)
    } finally {
      setLoadingDays(false)
    }
  }

  const updateDay = (index: number, field: string, value: string) => {
    const newDays = [...days]
    newDays[index] = { ...newDays[index], [field]: value }
    setDays(newDays)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation côté client
    if (days.length === 0) {
      setError('Veuillez remplir au moins un jour de méditation')
      setLoading(false)
      return
    }

    const incompleteDays = days.filter(
      (day) => !day.title || !day.verseRef || !day.meditation || !day.prayer
    )

    if (incompleteDays.length > 0) {
      setError(`Veuillez compléter tous les champs pour le(s) jour(s) ${incompleteDays.map((d) => d.dayNumber).join(', ')}`)
      setLoading(false)
      return
    }

    try {
      const url = plan?.id ? `/api/admin/plans/${plan.id}` : '/api/admin/plans'
      const method = plan?.id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl: formData.imageUrl || null,
          days: days.map((day) => ({
            dayNumber: day.dayNumber,
            verseRef: day.verseRef,
            verseText: day.verseText || null,
            title: day.title,
            meditation: day.meditation,
            prayer: day.prayer,
          })),
        }),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const errorData = await response.json()
        setError(errorData.error || `Erreur lors de la ${plan?.id ? 'modification' : 'création'}`)
      }
    } catch (error) {
      console.error(`Erreur ${plan?.id ? 'modification' : 'création'} plan:`, error)
      setError(`Erreur lors de la ${plan?.id ? 'modification' : 'création'} du plan`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan ? 'Modifier le plan' : 'Nouveau plan'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {loadingDays && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Chargement des jours...
            </div>
          )}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
              {error}
            </div>
          )}
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="theme">Thème</Label>
              <Input
                id="theme"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                placeholder="paix, foi, identite, etc."
                required
              />
            </div>
            <div>
              <Label htmlFor="durationDays">Durée (jours)</Label>
              <Input
                id="durationDays"
                type="number"
                min="1"
                max="30"
                value={formData.durationDays}
                onChange={(e) =>
                  setFormData({ ...formData, durationDays: parseInt(e.target.value) || 7 })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="icon">Icône (emoji)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📖"
              />
            </div>
            <div>
              <Label htmlFor="imageGradient">Dégradé CSS</Label>
              <Input
                id="imageGradient"
                value={formData.imageGradient}
                onChange={(e) => setFormData({ ...formData, imageGradient: e.target.value })}
                placeholder="from-olive-400 to-ciel-400"
              />
            </div>
          </div>

          {/* Upload d'image */}
          <div>
            <Label htmlFor="image">Image du plan</Label>
            <div className="space-y-3">
              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                  <Image
                    src={imagePreview}
                    alt="Aperçu"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null)
                      setFormData({ ...formData, imageUrl: null })
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    setUploadingImage(true)
                    try {
                      const uploadFormData = new FormData()
                      uploadFormData.append('image', file)

                      const response = await fetch('/api/admin/plans/upload-image', {
                        method: 'POST',
                        body: uploadFormData,
                      })

                      if (response.ok) {
                        const data = await response.json()
                        setFormData({ ...formData, imageUrl: data.imageUrl })
                        setImagePreview(data.imageUrl)
                      } else {
                        const error = await response.json()
                        setError(error.error || 'Erreur lors de l\'upload de l\'image')
                      }
                    } catch (error) {
                      console.error('Erreur upload:', error)
                      setError('Erreur lors de l\'upload de l\'image')
                    } finally {
                      setUploadingImage(false)
                    }
                  }}
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <span className="text-sm text-muted-foreground">Upload en cours...</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Formats acceptés : JPG, PNG, WebP. Taille max : 5MB
              </p>
            </div>
          </div>

          {/* Formulaire des jours */}
          <div className="space-y-3 sm:space-y-4 border-t pt-3 sm:pt-4">
            <h3 className="font-medium text-sm sm:text-base">Jours de méditation</h3>
            <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
              {days.map((day, index) => (
                <Card key={index} className="p-3 sm:p-4">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <span className="font-medium text-xs sm:text-sm">Jour {day.dayNumber}</span>
                    </div>
                    <div>
                      <Label htmlFor={`day-title-${index}`}>Titre du jour</Label>
                      <Input
                        id={`day-title-${index}`}
                        value={day.title}
                        onChange={(e) => updateDay(index, 'title', e.target.value)}
                        placeholder={`Jour ${day.dayNumber}`}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`day-verse-${index}`}>Référence biblique</Label>
                      <Input
                        id={`day-verse-${index}`}
                        value={day.verseRef}
                        onChange={(e) => updateDay(index, 'verseRef', e.target.value)}
                        placeholder="Psaume 23:1-3"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`day-verseText-${index}`}>Texte du verset</Label>
                      <Textarea
                        id={`day-verseText-${index}`}
                        value={day.verseText}
                        onChange={(e) => updateDay(index, 'verseText', e.target.value)}
                        placeholder="Entrez le texte du verset ici..."
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Le texte du verset sera utilisé pour la génération audio
                      </p>
                    </div>
                    <div>
                      <Label htmlFor={`day-meditation-${index}`}>Méditation</Label>
                      <Textarea
                        id={`day-meditation-${index}`}
                        value={day.meditation}
                        onChange={(e) => updateDay(index, 'meditation', e.target.value)}
                        placeholder="Texte de méditation guidée..."
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`day-prayer-${index}`}>Prière</Label>
                      <Textarea
                        id={`day-prayer-${index}`}
                        value={day.prayer}
                        onChange={(e) => updateDay(index, 'prayer', e.target.value)}
                        placeholder="Prière suggérée..."
                        rows={2}
                        required
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : plan ? 'Modifier' : 'Créer'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

