'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface Stats {
  totalSessions: number
  totalMinutes: number
  totalDays: number
  streak: number
  plansCompleted: number
  plansInProgress: number
  lastSession: string | null
  weeklyData: number[]
}

/**
 * Page des statistiques de méditation
 */
export default function StatistiquesPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
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
      <div className="container max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <Skeleton className="h-8 w-8 mx-auto mb-2 rounded-full" />
                <Skeleton className="h-6 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto mb-1" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Streak',
      value: stats?.streak || 0,
      unit: 'jours',
      icon: '🔥',
      color: 'text-orange-500',
    },
    {
      title: 'Sessions',
      value: stats?.totalSessions || 0,
      unit: 'méditations',
      icon: '🧘',
      color: 'text-ciel-500',
    },
    {
      title: 'Temps total',
      value: stats?.totalMinutes || 0,
      unit: 'minutes',
      icon: '⏱️',
      color: 'text-olive-500',
    },
    {
      title: 'Jours actifs',
      value: stats?.totalDays || 0,
      unit: 'jours',
      icon: '📅',
      color: 'text-purple-500',
    },
  ]

  const maxWeekly = Math.max(...(stats?.weeklyData || [1]))

  return (
    <div className="container max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif text-foreground mb-2">
          📊 Mes Statistiques
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Suivez votre progression spirituelle
        </p>
      </motion.div>

      {/* Cartes principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <span className="text-3xl">{stat.icon}</span>
                <p className={`text-3xl font-bold mt-2 ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.unit}</p>
                <p className="text-sm font-medium mt-1">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Activité hebdomadaire */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">📈 Activité des 4 dernières semaines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-around h-32 gap-2">
              {stats?.weeklyData.map((count, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <motion.div
                    className="w-12 bg-olive-400 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ 
                      height: count > 0 ? `${(count / maxWeekly) * 100}%` : '4px' 
                    }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    style={{ minHeight: '4px' }}
                  />
                  <span className="text-xs text-muted-foreground">
                    S{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">✅</span>
                <div>
                  <p className="text-2xl font-bold text-olive-600">
                    {stats?.plansCompleted || 0}
                  </p>
                  <p className="text-muted-foreground">Plans terminés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">📖</span>
                <div>
                  <p className="text-2xl font-bold text-ciel-600">
                    {stats?.plansInProgress || 0}
                  </p>
                  <p className="text-muted-foreground">Plans en cours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Message encourageant */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="border-0 shadow-sm bg-gradient-to-r from-olive-50 to-ciel-50 dark:from-olive-900/20 dark:to-ciel-900/20">
          <CardContent className="p-6 text-center">
            {(stats?.streak || 0) >= 7 ? (
              <>
                <span className="text-4xl">🏆</span>
                <p className="mt-2 font-medium">
                  Excellent ! Vous maintenez une belle discipline spirituelle.
                </p>
              </>
            ) : (stats?.streak || 0) >= 3 ? (
              <>
                <span className="text-4xl">⭐</span>
                <p className="mt-2 font-medium">
                  Continuez ainsi ! Chaque jour compte dans votre marche avec Dieu.
                </p>
              </>
            ) : (
              <>
                <span className="text-4xl">🌱</span>
                <p className="mt-2 font-medium">
                  Chaque méditation est une graine plantée. Persévérez !
                </p>
              </>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              « Mais celui qui persévérera jusqu'à la fin sera sauvé. » — Matthieu 24:13
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}


