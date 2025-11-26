import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isAdmin, canEditPlan, canCreatePlans } from '@/lib/permissions'
import { getPlanById } from '@/data/plans'

/**
 * PUT /api/admin/plans/[id]
 * Met à jour un plan (admin peut modifier tous les plans, y compris les plans système)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userIsAdmin = await isAdmin()
    
    // Vérifier les permissions : admin peut modifier tous les plans, sinon seulement ses propres plans
    if (!userIsAdmin) {
      const canEdit = await canEditPlan(params.id)
      if (!canEdit) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }
    }

    // Si c'est un plan système qui n'existe pas en BDD, le créer
    const existingPlan = await prisma.plan.findUnique({
      where: { id: params.id },
    })

    const body = await request.json()
    const { title, description, theme, durationDays, imageGradient, icon, imageUrl, isActive, days } = body

    let plan
    if (!existingPlan) {
      // Créer le plan en BDD (plan système modifié)
      plan = await prisma.plan.create({
        data: {
          id: params.id, // Utiliser l'ID du plan système
          title: title || 'Plan modifié',
          description: description || '',
          theme: theme || '',
          durationDays: durationDays || 7,
          imageUrl: imageUrl || null,
          imageGradient: imageGradient || null,
          icon: icon || null,
          isActive: isActive !== undefined ? isActive : true,
          createdById: userIsAdmin ? null : session.user.id, // Admin peut créer des plans système
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          days: true,
        },
      })
    } else {
      // Mettre à jour le plan existant
      plan = await prisma.plan.update({
        where: { id: params.id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(theme && { theme }),
          ...(durationDays && { durationDays }),
          ...(imageUrl !== undefined && { imageUrl }),
          ...(imageGradient !== undefined && { imageGradient }),
          ...(icon !== undefined && { icon }),
          ...(isActive !== undefined && { isActive }),
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          days: true,
        },
      })
    }

    // Mise à jour des jours si fournis
    if (days && Array.isArray(days)) {
      // Supprimer les anciens jours
      await prisma.planDay.deleteMany({
        where: { planId: params.id },
      })

      // Créer les nouveaux jours
      await prisma.planDay.createMany({
        data: days.map((day: any, index: number) => ({
          planId: params.id,
          dayNumber: day.dayNumber || index + 1,
          verseRef: day.verseRef,
          verseText: day.verseText || null,
          title: day.title,
          meditation: day.meditation,
          prayer: day.prayer,
          audioUrl: day.audioUrl || null,
        })),
      })

      // Recharger le plan avec les jours mis à jour
      plan = await prisma.plan.findUnique({
        where: { id: params.id },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          days: {
            orderBy: { dayNumber: 'asc' },
          },
        },
      })
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Erreur mise à jour plan:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/plans/[id]
 * Récupère un plan spécifique avec ses jours (BDD ou plan système)
 */
export async function GET(
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

    // D'abord, essayer de charger depuis la BDD
    const dbPlan = await prisma.plan.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        days: {
          orderBy: { dayNumber: 'asc' },
        },
      },
    })

    if (dbPlan) {
      return NextResponse.json(dbPlan)
    }

    // Sinon, essayer de charger depuis les plans système
    // Vérifier d'abord si le plan système a été supprimé
    const deletedPlan = await prisma.deletedSystemPlan.findUnique({
      where: { planId: params.id },
    })
    if (deletedPlan) {
      return NextResponse.json({ error: 'Plan non trouvé' }, { status: 404 })
    }

    const systemPlan = getPlanById(params.id)
    if (systemPlan) {
      return NextResponse.json({
        id: systemPlan.id,
        title: systemPlan.title,
        description: systemPlan.description,
        theme: systemPlan.theme,
        durationDays: systemPlan.durationDays,
        imageUrl: null, // Plans système n'ont pas d'image uploadée par défaut
        imageGradient: systemPlan.imageGradient,
        icon: systemPlan.icon,
        isActive: true,
        createdById: null,
        createdBy: null,
        days: systemPlan.days.map((day) => ({
          id: `${systemPlan.id}-day-${day.day}`,
          dayNumber: day.day,
          verseRef: day.verseRef,
          title: day.title,
          meditation: day.meditation,
          prayer: day.prayer,
          audioUrl: null,
          planId: systemPlan.id,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({ error: 'Plan non trouvé' }, { status: 404 })
  } catch (error) {
    console.error('Erreur récupération plan:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/plans/[id]
 * Supprime un plan (admin peut supprimer tous les plans, y compris les plans système)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userIsAdmin = await isAdmin()
    
    // Vérifier si l'utilisateur est admin ou créateur du plan
    if (!userIsAdmin) {
      const plan = await prisma.plan.findUnique({
        where: { id: params.id },
        select: { createdById: true },
      })

      if (!plan || plan.createdById !== session.user.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }
    }

    // Supprimer le plan de la BDD s'il existe
    try {
      await prisma.plan.delete({
        where: { id: params.id },
      })
    } catch (error: any) {
      // Si le plan n'existe pas en BDD, c'est probablement un plan système
      if (error.code === 'P2025') {
        // Record not found - marquer comme supprimé dans DeletedSystemPlan
        try {
          await prisma.deletedSystemPlan.upsert({
            where: { planId: params.id },
            create: {
              planId: params.id,
              deletedBy: session.user.id,
            },
            update: {
              deletedAt: new Date(),
              deletedBy: session.user.id,
            },
          })
        } catch (deleteError) {
          // Ignorer si déjà supprimé
          console.log('Plan système déjà marqué comme supprimé')
        }
        return NextResponse.json({ message: 'Plan supprimé' })
      }
      throw error
    }

    // Si c'était un plan système qui avait été modifié (existe en BDD), le marquer aussi comme supprimé
    try {
      await prisma.deletedSystemPlan.upsert({
        where: { planId: params.id },
        create: {
          planId: params.id,
          deletedBy: session.user.id,
        },
        update: {
          deletedAt: new Date(),
          deletedBy: session.user.id,
        },
      })
    } catch (error) {
      // Ignorer si erreur (peut-être pas un plan système)
    }

    return NextResponse.json({ message: 'Plan supprimé' })
  } catch (error) {
    console.error('Erreur suppression plan:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

