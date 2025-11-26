import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/analytics
 * Enregistre un événement analytics anonymisé
 * Aucune donnée personnelle n'est stockée
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, timestamp, page, metadata } = body

    // Validation basique
    if (!event || !timestamp) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      )
    }

    // Anonymiser les données
    // Ne stocker que des données agrégées, pas de données personnelles
    const anonymizedData = {
      event,
      timestamp: new Date(timestamp),
      page: page || 'unknown',
      // Ne stocker que des métadonnées anonymes
      metadata: metadata ? JSON.stringify(metadata) : null,
      // Pas d'IP, pas d'user agent, pas d'identifiant utilisateur
    }

    // Stocker dans la base de données (table AnalyticsEvent à créer si nécessaire)
    // Pour l'instant, on peut simplement logger ou stocker de manière anonyme
    // Vous pouvez créer un modèle Prisma pour cela si vous voulez persister les données
    
    // Exemple de log (à remplacer par un stockage en base si nécessaire)
    console.log('Analytics event:', anonymizedData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur analytics:', error)
    // Ne pas exposer d'erreur à l'utilisateur
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

/**
 * GET /api/analytics
 * Récupère les statistiques analytics agrégées (Admin uniquement)
 * Retourne uniquement des données anonymes et agrégées
 */
export async function GET(request: NextRequest) {
  try {
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/auth')
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier les permissions (Admin uniquement)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 })
    }

    // Retourner des statistiques agrégées
    // Pour l'instant, retourner un objet vide
    // À implémenter avec un modèle AnalyticsEvent si nécessaire
    return NextResponse.json({
      stats: {
        totalEvents: 0,
        eventsByType: {},
        eventsByPage: {},
        // Aucune donnée personnelle
      },
    })
  } catch (error) {
    console.error('Erreur récupération analytics:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

