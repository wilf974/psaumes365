/**
 * Service ElevenLabs pour la génération de voix audio
 * Utilise l'API ElevenLabs pour convertir le texte en parole
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || ''
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1'

// Voix française recommandée (calme et apaisante)
// Charlotte - voix française féminine douce
export const VOICE_ID = 'XB0fDUnXU5powFXDhCwa' // Charlotte (FR)

// Alternatives :
// Rachel (EN) : '21m00Tcm4TlvDq8ikWAM'
// Antoni (EN) : 'ErXwobaYiN019PkySvjV'

/**
 * Options de génération audio
 */
export interface AudioGenerationOptions {
  text: string
  voiceId?: string
  modelId?: string
  stability?: number
  similarityBoost?: number
}

/**
 * Génère un fichier audio à partir de texte via l'API ElevenLabs
 * @returns Buffer audio MP3
 */
export async function generateAudio(options: AudioGenerationOptions): Promise<Buffer> {
  const {
    text,
    voiceId = VOICE_ID,
    modelId = 'eleven_multilingual_v2',
    stability = 0.5,
    similarityBoost = 0.75,
  } = options

  const response = await fetch(
    `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error('Erreur ElevenLabs:', error)
    throw new Error(`Erreur génération audio: ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * Génère l'audio pour une méditation complète
 */
export async function generateMeditationAudio(
  verseText: string,
  meditation: string,
  prayer: string
): Promise<Buffer> {
  const fullText = `
    ${verseText}
    
    ... 
    
    ${meditation}
    
    ...
    
    ${prayer}
  `
  return generateAudio({ text: fullText })
}

/**
 * Récupère la liste des voix disponibles
 */
export async function getVoices() {
  const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error('Erreur récupération voix')
  }

  return response.json()
}

/**
 * Vérifie le quota restant
 */
export async function getSubscriptionInfo() {
  const response = await fetch(`${ELEVENLABS_API_URL}/user/subscription`, {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error('Erreur récupération abonnement')
  }

  return response.json()
}


