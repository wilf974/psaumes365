'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsOverviewProps {
  isAdmin: boolean
}

interface Stats {
  totalUsers: number
  totalPlans: number
  activePlans: number
  totalSessions: number
  recentUsers: number
}

/**
 * Vue d'ensemble des statistiques de l'application
 */
export function StatsOverview({ isAdmin }: StatsOverviewProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-8 bg-muted rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = isAdmin
    ? [
        {
          title: 'Utilisateurs',
          value: stats?.totalUsers || 0,
          icon: '👥',
          color: 'text-ciel-500',
        },
        {
          title: 'Plans totaux',
          value: stats?.totalPlans || 0,
          icon: '📖',
          color: 'text-olive-500',
        },
        {
          title: 'Plans actifs',
          value: stats?.activePlans || 0,
          icon: '✨',
          color: 'text-purple-500',
        },
        {
          title: 'Sessions',
          value: stats?.totalSessions || 0,
          icon: '🧘',
          color: 'text-orange-500',
        },
      ]
    : [
        {
          title: 'Mes plans',
          value: stats?.totalPlans || 0,
          icon: '📖',
          color: 'text-olive-500',
        },
        {
          title: 'Plans actifs',
          value: stats?.activePlans || 0,
          icon: '✨',
          color: 'text-purple-500',
        },
      ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Informations système</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Version de l'application : 1.0.0
              <br />
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

