import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isAdmin, canCreatePlans } from '@/lib/permissions'
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { validateText, validateVerseRef, validateId } from '@/lib/validation'

/**
 * GET /api/admin/meditations/[id]
 * Récupère une méditation guidée spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const userCanCreate = session ? await canCreatePlans() : false

    if (!session || !userCanCreate) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const idValidation = validateId(params.id, 'ID méditation')
    if (!idValidation.valid) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 })
    }

    const meditation = await prisma.guidedMeditation.findUnique({
      where: { id: params.id },
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

    if (!meditation) {
      return NextResponse.json({ error: 'Méditation non trouvée' }, { status: 404 })
    }

    return NextResponse.json({ meditation })
  } catch (error) {
    console.error('Erreur récupération méditation:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * PUT /api/admin/meditations/[id]
 * Met à jour une méditation guidée
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const userIsAdmin = session ? await isAdmin() : false
    const userCanCreate = session ? await canCreatePlans() : false

    if (!session || (!userIsAdmin && !userCanCreate)) {
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

    const idValidation = validateId(params.id, 'ID méditation')
    if (!idValidation.valid) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 })
    }

    const existingMeditation = await prisma.guidedMeditation.findUnique({
      where: { id: params.id },
    })

    if (!existingMeditation) {
      return NextResponse.json({ error: 'Méditation non trouvée' }, { status: 404 })
    }

    // Vérifier les permissions : seul l'admin peut modifier les méditations d'autres utilisateurs
    if (!userIsAdmin && existingMeditation.createdById !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé à modifier cette méditation' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, verseRef, verseText, theme, reflection, estimatedDuration, audioUrl, isActive } = body

    // Validation des champs fournis
    const updateData: any = {}

    if (title !== undefined) {
      const titleValidation = validateText(title, { minLength: 3, maxLength: 200, required: true })
      if (!titleValidation.valid) {
        return NextResponse.json({ error: titleValidation.error }, { status: 400 })
      }
      updateData.title = titleValidation.cleaned || title.trim()
    }

    if (verseRef !== undefined) {
      const verseRefValidation = validateVerseRef(verseRef)
      if (!verseRefValidation.valid) {
        return NextResponse.json({ error: verseRefValidation.error }, { status: 400 })
      }
      updateData.verseRef = verseRef.trim()
    }

    if (verseText !== undefined) {
      const verseTextValidation = validateText(verseText, { minLength: 10, maxLength: 2000, required: true })
      if (!verseTextValidation.valid) {
        return NextResponse.json({ error: verseTextValidation.error }, { status: 400 })
      }
      updateData.verseText = verseTextValidation.cleaned || verseText.trim()
    }

    if (reflection !== undefined) {
      const reflectionValidation = validateText(reflection, { minLength: 50, maxLength: 5000, required: true })
      if (!reflectionValidation.valid) {
        return NextResponse.json({ error: reflectionValidation.error }, { status: 400 })
      }
      updateData.reflection = reflectionValidation.cleaned || reflection.trim()
    }

    if (description !== undefined) {
      const descriptionValidation = description
        ? validateText(description, { minLength: 10, maxLength: 1000, required: false })
        : { valid: true, cleaned: null }
      if (!descriptionValidation.valid) {
        return NextResponse.json({ error: descriptionValidation.error }, { status: 400 })
      }
      updateData.description = descriptionValidation.cleaned || description?.trim() || null
    }

    if (theme !== undefined) {
      updateData.theme = theme?.trim() || null
    }

    if (audioUrl !== undefined) {
      updateData.audioUrl = audioUrl?.trim() || null
    }

    if (estimatedDuration !== undefined) {
      const duration = parseInt(estimatedDuration)
      if (isNaN(duration) || duration < 1 || duration > 60) {
        return NextResponse.json(
          { error: 'La durée doit être entre 1 et 60 minutes' },
          { status: 400 }
        )
      }
      updateData.estimatedDuration = duration
    }

    // Seul l'admin peut changer isActive
    if (isActive !== undefined && userIsAdmin) {
      updateData.isActive = isActive
    }

    const updatedMeditation = await prisma.guidedMeditation.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({ meditation: updatedMeditation })
  } catch (error) {
    console.error('Erreur mise à jour méditation:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/meditations/[id]
 * Supprime une méditation guidée
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const userIsAdmin = session ? await isAdmin() : false
    const userCanCreate = session ? await canCreatePlans() : false

    if (!session || (!userIsAdmin && !userCanCreate)) {
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

    const idValidation = validateId(params.id, 'ID méditation')
    if (!idValidation.valid) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 })
    }

    const existingMeditation = await prisma.guidedMeditation.findUnique({
      where: { id: params.id },
    })

    if (!existingMeditation) {
      return NextResponse.json({ error: 'Méditation non trouvée' }, { status: 404 })
    }

    // Vérifier les permissions : seul l'admin peut supprimer les méditations d'autres utilisateurs
    if (!userIsAdmin && existingMeditation.createdById !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé à supprimer cette méditation' },
        { status: 403 }
      )
    }

    await prisma.guidedMeditation.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Méditation supprimée' }, { status: 200 })
  } catch (error) {
    console.error('Erreur suppression méditation:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

