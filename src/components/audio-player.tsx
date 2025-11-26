'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface AudioPlayerProps {
  text: string
  id?: string
  label?: string
  className?: string
  verseRef?: string // Référence du verset pour chercher un audio pré-enregistré
  usePreRecorded?: boolean // Forcer l'utilisation d'audio pré-enregistré si disponible
}

/**
 * Nettoie le texte en enlevant les guillemets français et autres caractères problématiques
 * Ne supprime que les caractères de formatage en début/fin, pas le contenu réel
 */
function cleanText(text: string): string {
  if (!text) return ''
  
  let cleaned = text.trim()
  
  // Enlever les caractères de formatage uniquement en début/fin
  // Ne pas toucher au contenu au milieu
  cleaned = cleaned.replace(/^—\s*/, '') // Enlever le tiret cadratin au début
  cleaned = cleaned.replace(/\s*—\s*$/, '') // Enlever le tiret cadratin à la fin
  cleaned = cleaned.replace(/^«\s*/, '') // Enlever le guillemet ouvrant au début
  cleaned = cleaned.replace(/\s*»\s*$/, '') // Enlever le guillemet fermant à la fin
  cleaned = cleaned.replace(/^["']+/, '') // Enlever les guillemets droits au début
  cleaned = cleaned.replace(/["']+$/, '') // Enlever les guillemets droits à la fin
  
  cleaned = cleaned.trim()
  
  // Si après nettoyage le texte est vide, retourner le texte original (sans les caractères problématiques au début/fin uniquement)
  if (!cleaned || cleaned.length === 0) {
    // Essayer un nettoyage plus léger : seulement les espaces
    cleaned = text.trim()
    // Enlever uniquement les guillemets français en début/fin
    cleaned = cleaned.replace(/^«\s*/, '').replace(/\s*»\s*$/, '')
    cleaned = cleaned.replace(/^—\s*/, '').replace(/\s*—\s*$/, '')
    cleaned = cleaned.trim()
  }
  
  return cleaned || text.trim() // Si toujours vide, retourner le texte original nettoyé des espaces
}

/**
 * Composant de lecture audio avec génération ElevenLabs ou fichiers pré-enregistrés
 * Vérifie d'abord s'il existe un fichier audio pré-enregistré, sinon génère avec ElevenLabs
 */
export function AudioPlayer({ text, id, label = 'Écouter', className, verseRef, usePreRecorded = true }: AudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  /**
   * Génère ou récupère l'audio
   * Vérifie d'abord s'il existe un fichier audio pré-enregistré
   */
  const loadAudio = async () => {
    if (audioUrl) return audioUrl

    setIsLoading(true)
    setError(null)

    try {
      // Vérifier d'abord s'il existe un fichier audio pré-enregistré
      if (usePreRecorded && verseRef) {
        const preRecordedResponse = await fetch(`/api/audio/prerecorded?verseRef=${encodeURIComponent(verseRef)}&type=verse`)
        if (preRecordedResponse.ok) {
          const preRecordedData = await preRecordedResponse.json()
          if (preRecordedData.audio && preRecordedData.audio.url) {
            setAudioUrl(preRecordedData.audio.url)
            return preRecordedData.audio.url
          }
        }
      }

      // Si pas d'audio pré-enregistré, générer avec ElevenLabs
      // Nettoyer le texte avant de l'envoyer à l'API
      const cleanedText = cleanText(text)
      
      if (!cleanedText || cleanedText.trim().length === 0) {
        console.error('Texte vide après nettoyage. Texte original:', text)
        setError('Texte vide')
        return null
      }

      const response = await fetch('/api/audio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanedText, id }),
      })

      if (!response.ok) {
        throw new Error('Erreur génération')
      }

      const data = await response.json()
      setAudioUrl(data.audioUrl)
      return data.audioUrl
    } catch (err) {
      setError('Erreur de génération audio')
      console.error(err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Joue ou met en pause l'audio
   */
  const togglePlay = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    const url = await loadAudio()
    if (!url) return

    if (!audioRef.current) {
      audioRef.current = new Audio(url)
      audioRef.current.onended = () => setIsPlaying(false)
      audioRef.current.onerror = () => {
        setError('Erreur de lecture')
        setIsPlaying(false)
      }
    }

    audioRef.current.play()
    setIsPlaying(true)
  }

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return (
    <div className={className}>
      <Button
        variant="outline"
        size="sm"
        onClick={togglePlay}
        disabled={isLoading}
        className="gap-1.5 sm:gap-2 text-xs sm:text-sm"
      >
        {isLoading ? (
          <>
            <LoadingIcon className="w-4 h-4 animate-spin" />
            Génération...
          </>
        ) : isPlaying ? (
          <>
            <PauseIcon className="w-4 h-4" />
            Pause
          </>
        ) : (
          <>
            <PlayIcon className="w-4 h-4" />
            {label}
          </>
        )}
      </Button>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-destructive mt-1"
        >
          {error}
        </motion.p>
      )}
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

function LoadingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}


