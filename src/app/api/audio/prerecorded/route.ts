import { NextRequest, NextResponse } from 'next/server'
import { getPreRecordedVerseAudio, getPreRecordedPlanAudio, getPreRecordedPrayerAudio } from '@/lib/audio-files'

/**
 * GET /api/audio/prerecorded
 * Récupère les informations sur un fichier audio pré-enregistré
 * Query params: verseRef, planId, dayNumber, type
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const verseRef = searchParams.get('verseRef')
    const planId = searchParams.get('planId')
    const dayNumber = searchParams.get('dayNumber')
    const type = searchParams.get('type') || 'verse'

    if (type === 'verse' && verseRef) {
      const audio = getPreRecordedVerseAudio(verseRef)
      if (audio) {
        return NextResponse.json({ audio })
      }
    } else if (type === 'meditation' && planId && dayNumber) {
      const audio = getPreRecordedPlanAudio(planId, parseInt(dayNumber))
      if (audio) {
        return NextResponse.json({ audio })
      }
    } else if (type === 'prayer' && planId && dayNumber) {
      const audio = getPreRecordedPrayerAudio(planId, parseInt(dayNumber))
      if (audio) {
        return NextResponse.json({ audio })
      }
    }

    return NextResponse.json({ audio: null })
  } catch (error) {
    console.error('Erreur récupération audio pré-enregistré:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

