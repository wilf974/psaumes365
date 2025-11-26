/**
 * Gestion des fichiers audio pré-enregistrés pour les méditations
 * Permet d'utiliser des fichiers MP3 locaux au lieu de la génération ElevenLabs
 */

/**
 * Types d'audio disponibles
 */
export type AudioType = 'verse' | 'meditation' | 'prayer' | 'ambient'

/**
 * Structure d'un fichier audio
 */
export interface AudioFile {
  id: string
  type: AudioType
  verseRef?: string // Pour les versets
  planId?: string // Pour les méditations de plans
  dayNumber?: number // Pour les jours de plans
  url: string // URL du fichier audio
  duration?: number // Durée en secondes
  title?: string // Titre optionnel
}

/**
 * Liste des fichiers audio pré-enregistrés
 * À remplir avec les fichiers MP3 fournis par l'utilisateur
 */
export const PRE_RECORDED_AUDIO: AudioFile[] = [
  // Exemple de structure
  // {
  //   id: 'psalm-23-1',
  //   type: 'verse',
  //   verseRef: 'Psaume 23:1',
  //   url: '/audio/prerecorded/psalm-23-1.mp3',
  //   duration: 15,
  // },
]

/**
 * Récupère un fichier audio pré-enregistré pour un verset
 */
export function getPreRecordedVerseAudio(verseRef: string): AudioFile | null {
  return PRE_RECORDED_AUDIO.find(
    (audio) => audio.type === 'verse' && audio.verseRef === verseRef
  ) || null
}

/**
 * Récupère un fichier audio pré-enregistré pour une méditation de plan
 */
export function getPreRecordedPlanAudio(planId: string, dayNumber: number): AudioFile | null {
  return PRE_RECORDED_AUDIO.find(
    (audio) => audio.type === 'meditation' && audio.planId === planId && audio.dayNumber === dayNumber
  ) || null
}

/**
 * Récupère un fichier audio pré-enregistré pour une prière
 */
export function getPreRecordedPrayerAudio(planId: string, dayNumber: number): AudioFile | null {
  return PRE_RECORDED_AUDIO.find(
    (audio) => audio.type === 'prayer' && audio.planId === planId && audio.dayNumber === dayNumber
  ) || null
}

/**
 * Vérifie si un fichier audio pré-enregistré existe pour un verset
 */
export function hasPreRecordedAudio(verseRef: string): boolean {
  return getPreRecordedVerseAudio(verseRef) !== null
}

