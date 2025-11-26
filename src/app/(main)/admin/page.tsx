'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'

// Lazy loading des composants admin (chargés uniquement quand nécessaire)
const PlansManagement = dynamic(() => import('@/components/admin/plans-management').then((mod) => ({ default: mod.PlansManagement })), {
  loading: () => <div className="animate-pulse space-y-4"><div className="h-8 bg-muted rounded w-1/2" /></div>,
})

const UsersManagement = dynamic(() => import('@/components/admin/users-management').then((mod) => ({ default: mod.UsersManagement })), {
  loading: () => <div className="animate-pulse space-y-4"><div className="h-8 bg-muted rounded w-1/2" /></div>,
})

const StatsOverview = dynamic(() => import('@/components/admin/stats-overview').then((mod) => ({ default: mod.StatsOverview })), {
  loading: () => <div className="animate-pulse space-y-4"><div className="h-8 bg-muted rounded w-1/2" /></div>,
})

const MeditationsManagement = dynamic(() => import('@/components/admin/meditations-management').then((mod) => ({ default: mod.MeditationsManagement })), {
  loading: () => <div className="animate-pulse space-y-4"><div className="h-8 bg-muted rounded w-1/2" /></div>,
})

type TabType = 'overview' | 'plans' | 'meditations' | 'users'

/**
 * Page d'administration
 * Accessible uniquement aux administrateurs et contributeurs
 */
export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    // Vérifier le rôle
    const role = (session.user as any)?.role
    setUserRole(role)

    if (!role || (role !== 'ADMIN' && role !== 'CONTRIBUTOR')) {
      router.push('/accueil')
    }
  }, [session, status, router])

  if (status === 'loading' || !userRole) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    )
  }

  const isAdmin = userRole === 'ADMIN'
  const isContributor = userRole === 'CONTRIBUTOR'

  return (
    <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-foreground mb-2">
          Administration
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {isAdmin ? 'Gestion complète de l\'application' : 'Gestion de vos plans'}
        </p>
      </motion.div>

      {/* Onglets */}
      <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-3 sm:mx-0 px-3 sm:px-0">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('overview')}
          className="flex-shrink-0"
        >
          📊 Vue d'ensemble
        </Button>
        <Button
          variant={activeTab === 'plans' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('plans')}
          className="flex-shrink-0"
        >
          📖 Plans
        </Button>
        <Button
          variant={activeTab === 'meditations' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('meditations')}
          className="flex-shrink-0"
        >
          🧘 Méditations
        </Button>
        {isAdmin && (
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('users')}
            className="flex-shrink-0"
          >
            👥 Utilisateurs
          </Button>
        )}
      </div>

      {/* Contenu des onglets */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && <StatsOverview isAdmin={isAdmin} />}
        {activeTab === 'plans' && <PlansManagement isAdmin={isAdmin} />}
        {activeTab === 'meditations' && <MeditationsManagement isAdmin={isAdmin} />}
        {activeTab === 'users' && isAdmin && <UsersManagement />}
      </motion.div>
    </div>
  )
}

