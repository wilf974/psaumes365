import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isAdmin, canCreatePlans } from '@/lib/permissions'
import { PLANS_DATA } from '@/data/plans'

/**
 * GET /api/admin/plans
 * Récupère tous les plans (BDD + plans existants du fichier)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userIsAdmin = session ? await isAdmin() : false
    const userCanCreate = session ? await canCreatePlans() : false

    if (!session || (!userIsAdmin && !userCanCreate)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Récupérer les plans de la base de données
    const dbPlans = await prisma.plan.findMany({
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
        _count: {
          select: {
            progress: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Compter les utilisateurs pour chaque plan système
    const filePlanIds = PLANS_DATA.map((p) => p.id)
    const systemPlanProgress = await prisma.planProgress.groupBy({
      by: ['planId'],
      where: {
        planId: {
          in: filePlanIds,
        },
      },
      _count: {
        userId: true,
      },
    })

    const progressMap = new Map(
      systemPlanProgress.map((p) => [p.planId, p._count.userId])
    )

    // Convertir les plans du fichier en format compatible
    const filePlans = PLANS_DATA.map((plan) => ({
      id: plan.id,
      title: plan.title,
      description: plan.description,
      theme: plan.theme,
      durationDays: plan.durationDays,
      imageUrl: null, // Plans système n'ont pas d'image uploadée par défaut
      imageGradient: plan.imageGradient,
      icon: plan.icon,
      isActive: true,
      createdById: null, // Plans système
      createdBy: null,
      days: plan.days.map((day) => ({
        id: `${plan.id}-day-${day.day}`,
        dayNumber: day.day,
        verseRef: day.verseRef,
        title: day.title,
        meditation: day.meditation,
        prayer: day.prayer,
        audioUrl: null,
        planId: plan.id,
      })),
      createdAt: new Date().toISOString(), // Date par défaut
      updatedAt: new Date().toISOString(),
      _count: {
        progress: progressMap.get(plan.id) || 0,
      },
    }))

    // Récupérer les IDs des plans système supprimés
    const deletedSystemPlans = await prisma.deletedSystemPlan.findMany({
      select: { planId: true },
    })
    const deletedPlanIds = new Set(deletedSystemPlans.map((d) => d.planId))

    // Combiner les plans (BDD en premier, puis plans du fichier)
    // Filtrer les plans du fichier qui existent déjà en BDD ou qui ont été supprimés
    const dbPlanIds = new Set(dbPlans.map((p) => p.id))
    const uniqueFilePlans = filePlans.filter(
      (p) => !dbPlanIds.has(p.id) && !deletedPlanIds.has(p.id)
    )

    const allPlans = [...dbPlans, ...uniqueFilePlans]

    return NextResponse.json(allPlans)
  } catch (error) {
    console.error('Erreur récupération plans:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/plans
 * Crée un nouveau plan (admin ou contributeur)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(await canCreatePlans())) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, theme, durationDays, imageGradient, icon, imageUrl, days } = body

    // Validation
    if (!title || !description || !theme || !durationDays) {
      return NextResponse.json(
        { error: 'Champs requis manquants (titre, description, thème, durée)' },
        { status: 400 }
      )
    }

    if (!days || !Array.isArray(days) || days.length === 0) {
      return NextResponse.json(
        { error: 'Au moins un jour de méditation est requis' },
        { status: 400 }
      )
    }

    // Valider que chaque jour a les champs requis
    for (const day of days) {
      if (!day.title || !day.verseRef || !day.meditation || !day.prayer) {
        return NextResponse.json(
          { error: `Le jour ${day.dayNumber || '?'} est incomplet (titre, référence, méditation et prière requis)` },
          { status: 400 }
        )
      }
    }

    // Création du plan avec les jours
    const plan = await prisma.plan.create({
      data: {
        title,
        description,
        theme,
        durationDays,
        imageUrl: imageUrl || null,
        imageGradient: imageGradient || null,
        icon: icon || null,
        createdById: session.user.id,
        days: {
          create: days.map((day: any, index: number) => ({
            dayNumber: day.dayNumber || index + 1,
            verseRef: day.verseRef,
            verseText: day.verseText || null,
            title: day.title,
            meditation: day.meditation,
            prayer: day.prayer,
            audioUrl: day.audioUrl || null,
          })),
        },
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

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error('Erreur création plan:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

