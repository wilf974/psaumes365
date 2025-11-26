import { NextRequest, NextResponse } from 'next/server'
import { getLogoByWeek } from '@/lib/logo-rotation'
import fs from 'fs'
import path from 'path'

/**
 * Route dynamique pour le favicon
 * Retourne le logo correspondant à la semaine actuelle
 */
export async function GET(request: NextRequest) {
  try {
    const logoVariant = getLogoByWeek()
    const logoPath = path.join(process.cwd(), 'public', 'logos', `logo-${logoVariant}.png`)
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(logoPath)) {
      // Fallback vers le favicon SVG par défaut
      const fallbackPath = path.join(process.cwd(), 'public', 'favicon.svg')
      if (fs.existsSync(fallbackPath)) {
        const file = fs.readFileSync(fallbackPath)
        return new NextResponse(file, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=604800', // Cache 1 semaine
          },
        })
      }
      return new NextResponse('Not Found', { status: 404 })
    }

    const file = fs.readFileSync(logoPath)
    
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=604800', // Cache 1 semaine (change chaque semaine)
      },
    })
  } catch (error) {
    console.error('Erreur chargement favicon:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

