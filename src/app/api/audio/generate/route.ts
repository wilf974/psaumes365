import { NextRequest, NextResponse } from 'next/server'
import { generateAudio } from '@/lib/elevenlabs'
import { prisma } from '@/lib/db'
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

// Dossier de cache pour les audios générés
const AUDIO_CACHE_DIR = path.join(process.cwd(), 'public', 'audio', 'generated')

/**
 * Génère un hash MD5 du texte pour identification unique
 */
function hashText(text: string): string {
  return crypto.createHash('md5').update(text.trim().toLowerCase()).digest('hex')
}

/**
 * POST /api/audio/generate
 * Génère un fichier audio à partir de texte
 * Vérifie d'abord en base si l'audio existe déjà (économie de crédits)
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting pour la génération audio (coûteuse)
    const session = await getServerSession(authOptions)
    const rateLimitResponse = rateLimitMiddleware(
      request,
      RATE_LIMITS.AUDIO_GENERATION,
      session?.user?.id
    )
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const body = await request.json()
    const { text, id } = body

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Texte requis' }, { status: 400 })
    }

    // Validation de la longueur du texte
    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Le texte est trop long (max 5000 caractères)' },
        { status: 400 }
      )
    }

    // Nettoyer le texte en enlevant les guillemets français et autres caractères problématiques
    // Ne supprime que les caractères de formatage en début/fin, pas le contenu réel
    let cleanedText = text.trim()
    
    // Enlever les caractères de formatage uniquement en début/fin
    cleanedText = cleanedText.replace(/^—\s*/, '') // Enlever le tiret cadratin au début
    cleanedText = cleanedText.replace(/\s*—\s*$/, '') // Enlever le tiret cadratin à la fin
    cleanedText = cleanedText.replace(/^«\s*/, '') // Enlever le guillemet ouvrant au début
    cleanedText = cleanedText.replace(/\s*»\s*$/, '') // Enlever le guillemet fermant à la fin
    cleanedText = cleanedText.replace(/^["']+/, '') // Enlever les guillemets droits au début
    cleanedText = cleanedText.replace(/["']+$/, '') // Enlever les guillemets droits à la fin
    cleanedText = cleanedText.trim()
    
    // Si après nettoyage le texte est vide, essayer un nettoyage plus léger
    if (!cleanedText || cleanedText.length === 0) {
      cleanedText = text.trim()
      // Enlever uniquement les guillemets français en début/fin
      cleanedText = cleanedText.replace(/^«\s*/, '').replace(/\s*»\s*$/, '')
      cleanedText = cleanedText.replace(/^—\s*/, '').replace(/\s*—\s*$/, '')
      cleanedText = cleanedText.trim()
    }
    
    // Si toujours vide, utiliser le texte original (sans espaces)
    if (!cleanedText || cleanedText.length === 0) {
      cleanedText = text.trim()
    }
    
    if (!cleanedText || cleanedText.length === 0) {
      console.error('Texte vide après nettoyage. Texte original:', text)
      return NextResponse.json({ error: 'Texte vide après nettoyage' }, { status: 400 })
    }
    
    console.log('Texte original:', text)
    console.log('Texte nettoyé:', cleanedText)

    const textHash = hashText(cleanedText)

    // 1. Vérifier si l'audio existe déjà en base de données
    const existingAudio = await prisma.generatedAudio.findUnique({
      where: { textHash },
    })

    if (existingAudio) {
      // Vérifier que le fichier existe toujours
      const filePath = path.join(process.cwd(), 'public', existingAudio.audioPath)
      try {
        await fs.promises.access(filePath)
        // Le fichier existe, retourner le chemin
        return NextResponse.json({ 
          audioUrl: existingAudio.audioPath, 
          cached: true,
          source: 'database'
        })
      } catch {
        // Le fichier n'existe plus, supprimer l'entrée en base
        await prisma.generatedAudio.delete({ where: { id: existingAudio.id } })
      }
    }

    // 2. Créer le dossier de cache si nécessaire
    await fs.promises.mkdir(AUDIO_CACHE_DIR, { recursive: true })

    // 3. Générer l'audio via ElevenLabs
    console.log(`Génération audio ElevenLabs pour: "${cleanedText.substring(0, 50)}..."`)
    const audioBuffer = await generateAudio({ text: cleanedText })

    // 4. Sauvegarder le fichier
    const fileName = `${textHash}.mp3`
    const filePath = path.join(AUDIO_CACHE_DIR, fileName)
    const publicPath = `/audio/generated/${fileName}`

    await fs.promises.writeFile(filePath, audioBuffer)

    // 5. Enregistrer en base de données
    const fileStats = await fs.promises.stat(filePath)
    
    await prisma.generatedAudio.create({
      data: {
        textHash,
        text: cleanedText, // Texte nettoyé (sans guillemets)
        audioPath: publicPath,
        fileSize: fileStats.size,
      },
    })

    console.log(`Audio généré et sauvegardé: ${publicPath}`)

    return NextResponse.json({ 
      audioUrl: publicPath, 
      cached: false,
      source: 'elevenlabs'
    })
  } catch (error) {
    console.error('Erreur génération audio:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération audio' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/audio/generate
 * Récupère les statistiques des audios générés
 */
export async function GET() {
  try {
    const stats = await prisma.generatedAudio.aggregate({
      _count: true,
      _sum: { fileSize: true },
    })

    const audios = await prisma.generatedAudio.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        text: true,
        audioPath: true,
        fileSize: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      totalAudios: stats._count,
      totalSize: stats._sum.fileSize || 0,
      recentAudios: audios.map(a => ({
        ...a,
        text: a.text.substring(0, 100) + (a.text.length > 100 ? '...' : ''),
      })),
    })
  } catch (error) {
    console.error('Erreur stats audio:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
