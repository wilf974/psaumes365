'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

/**
 * Liste des pistes d'ambiance disponibles
 * Ajoutez des fichiers MP3 dans public/audio/ambient/
 */
const AMBIENT_TRACKS = [
  {
    id: 'peace',
    name: 'Paix intérieure',
    description: 'Piano doux et apaisant',
    file: '/audio/ambient/peace.mp3',
    icon: '🕊️',
  },
  {
    id: 'worship',
    name: 'Adoration',
    description: 'Atmosphère de louange',
    file: '/audio/ambient/worship.mp3',
    icon: '🙏',
  },
  {
    id: 'meditation',
    name: 'Méditation',
    description: 'Sons contemplatifs',
    file: '/audio/ambient/meditation.mp3',
    icon: '✨',
  },
  {
    id: 'nature',
    name: 'Création',
    description: 'Sons de la nature',
    file: '/audio/ambient/nature.mp3',
    icon: '🌿',
  },
]

interface AmbientPlayerProps {
  className?: string
  compact?: boolean
}

/**
 * Lecteur de musique d'ambiance pour la méditation
 * Permet de jouer une musique de fond douce pendant la méditation
 */
export function AmbientPlayer({ className, compact = false }: AmbientPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(AMBIENT_TRACKS[0])
  const [volume, setVolume] = useState(0.3)
  const [showSelector, setShowSelector] = useState(false)
  const [hasAudio, setHasAudio] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Créer l'élément audio
    audioRef.current = new Audio()
    audioRef.current.loop = true
    audioRef.current.volume = volume

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = async () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      try {
        audioRef.current.src = currentTrack.file
        await audioRef.current.play()
        setIsPlaying(true)
        setHasAudio(true)
      } catch (error) {
        console.error('Erreur lecture audio:', error)
        setHasAudio(false)
        setIsPlaying(false)
      }
    }
  }

  const selectTrack = async (track: typeof AMBIENT_TRACKS[0]) => {
    setCurrentTrack(track)
    setShowSelector(false)

    if (audioRef.current && isPlaying) {
      audioRef.current.src = track.file
      try {
        await audioRef.current.play()
        setHasAudio(true)
      } catch {
        setHasAudio(false)
        setIsPlaying(false)
      }
    }
  }

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlay}
        className={`gap-2 ${className}`}
        title={isPlaying ? 'Arrêter la musique' : 'Jouer musique d\'ambiance'}
      >
        {isPlaying ? (
          <>
            <MusicOffIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Musique</span>
          </>
        ) : (
          <>
            <MusicIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Ambiance</span>
          </>
        )}
      </Button>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Bouton principal */}
      <motion.div
        className="flex items-center gap-2 p-3 rounded-xl bg-card border shadow-sm"
        whileHover={{ scale: 1.02 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className={isPlaying ? 'text-olive-500' : 'text-muted-foreground'}
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <MusicIcon className="w-5 h-5" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="text-left w-full"
          >
            <p className="text-sm font-medium truncate">
              {currentTrack.icon} {currentTrack.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {isPlaying ? 'En cours...' : currentTrack.description}
            </p>
          </button>
        </div>

        {/* Contrôle volume */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-12 sm:w-16 h-1 accent-olive-500"
          title="Volume"
        />
      </motion.div>

      {/* Sélecteur de piste */}
      <AnimatePresence>
        {showSelector && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-card border shadow-lg z-50"
          >
            {AMBIENT_TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => selectTrack(track)}
                className={`w-full p-2 rounded-lg text-left hover:bg-muted transition-colors ${
                  track.id === currentTrack.id ? 'bg-muted' : ''
                }`}
              >
                <p className="text-sm font-medium">
                  {track.icon} {track.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {track.description}
                </p>
              </button>
            ))}

            {!hasAudio && (
              <p className="text-xs text-muted-foreground p-2 text-center border-t mt-2">
                ⚠️ Fichiers audio non trouvés. 
                Ajoutez des MP3 dans /public/audio/ambient/
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Icônes
function MusicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
    </svg>
  )
}

function MusicOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
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


