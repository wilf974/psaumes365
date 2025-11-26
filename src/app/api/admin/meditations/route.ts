import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isAdmin, canCreatePlans } from '@/lib/permissions'
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { validateText, validateVerseRef } from '@/lib/validation'

/**
 * GET /api/admin/meditations
 * Récupère toutes les méditations guidées (admin/contributor)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userCanCreate = session ? await canCreatePlans() : false

    if (!session || !userCanCreate) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const meditations = await prisma.guidedMeditation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ meditations })
  } catch (error) {
    console.error('Erreur récupération méditations:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * POST /api/admin/meditations
 * Crée une nouvelle méditation guidée (admin/contributor)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userCanCreate = session ? await canCreatePlans() : false

    if (!session || !userCanCreate) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Rate limiting
    const rateLimitResponse = rateLimitMiddleware(
      request,
      RATE_LIMITS.AUTHENTICATED_API,
      session.user.id
    )
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const body = await request.json()
    const { title, description, verseRef, verseText, theme, reflection, estimatedDuration, audioUrl, isActive } = body

    // Validation
    if (!title || !verseRef || !verseText || !reflection) {
      return NextResponse.json(
        { error: 'Titre, référence, texte du verset et réflexion sont requis' },
        { status: 400 }
      )
    }

    const titleValidation = validateText(title, { minLength: 3, maxLength: 200, required: true })
    if (!titleValidation.valid) {
      return NextResponse.json({ error: titleValidation.error }, { status: 400 })
    }

    const verseRefValidation = validateVerseRef(verseRef)
    if (!verseRefValidation.valid) {
      return NextResponse.json({ error: verseRefValidation.error }, { status: 400 })
    }

    const verseTextValidation = validateText(verseText, { minLength: 10, maxLength: 2000, required: true })
    if (!verseTextValidation.valid) {
      return NextResponse.json({ error: verseTextValidation.error }, { status: 400 })
    }

    const reflectionValidation = validateText(reflection, { minLength: 50, maxLength: 5000, required: true })
    if (!reflectionValidation.valid) {
      return NextResponse.json({ error: reflectionValidation.error }, { status: 400 })
    }

    const descriptionValidation = description
      ? validateText(description, { minLength: 10, maxLength: 1000, required: false })
      : { valid: true }
    if (!descriptionValidation.valid) {
      return NextResponse.json({ error: descriptionValidation.error }, { status: 400 })
    }

    // Validation de la durée
    const duration = estimatedDuration ? parseInt(estimatedDuration) : 5
    if (isNaN(duration) || duration < 1 || duration > 60) {
      return NextResponse.json(
        { error: 'La durée doit être entre 1 et 60 minutes' },
        { status: 400 }
      )
    }

    const meditation = await prisma.guidedMeditation.create({
      data: {
        title: titleValidation.cleaned || title.trim(),
        description: descriptionValidation.cleaned || description?.trim() || null,
        verseRef: verseRef.trim(),
        verseText: verseTextValidation.cleaned || verseText.trim(),
        theme: theme?.trim() || null,
        reflection: reflectionValidation.cleaned || reflection.trim(),
        estimatedDuration: duration,
        audioUrl: audioUrl?.trim() || null,
        isActive: isActive !== undefined ? isActive : true,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ meditation }, { status: 201 })
  } catch (error) {
    console.error('Erreur création méditation:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

