import { NextResponse } from 'next/server'
import { getDailyVerse, getFallbackDailyVerse } from '@/lib/bible-api'

/**
 * API Route pour récupérer le verset du jour
 * GET /api/bible/daily-verse
 */
export async function GET() {
  try {
    // Essai avec l'API externe
    const verse = await getDailyVerse()
    
    if (verse) {
      return NextResponse.json(verse)
    }
    
    // Fallback si l'API est indisponible
    return NextResponse.json(getFallbackDailyVerse())
  } catch (error) {
    console.error('Erreur API verset du jour:', error)
    return NextResponse.json(getFallbackDailyVerse())
  }
}


