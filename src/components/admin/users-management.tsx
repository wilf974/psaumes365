'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserRole } from '@/lib/permissions'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
  _count: {
    journalEntries: number
    planProgress: number
    createdPlans: number
  }
}

/**
 * Gestion des utilisateurs et rôles (admin seulement)
 */
export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (response.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        )
      }
    } catch (error) {
      console.error('Erreur mise à jour rôle:', error)
    }
  }

  const getRoleBadge = (role: string) => {
    const badges = {
      ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      CONTRIBUTOR: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      USER: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    }
    return badges[role as keyof typeof badges] || badges.USER
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Gestion des utilisateurs</h2>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {user.name || user.email}
                    <span
                      className={`text-xs px-2 py-1 rounded ${getRoleBadge(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="px-3 py-1 rounded-lg border border-border bg-background text-sm"
                  >
                    <option value={UserRole.USER}>Utilisateur</option>
                    <option value={UserRole.CONTRIBUTOR}>Contributeur</option>
                    <option value={UserRole.ADMIN}>Administrateur</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Journal</p>
                  <p className="font-medium">{user._count.journalEntries}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Plans suivis</p>
                  <p className="font-medium">{user._count.planProgress}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Plans créés</p>
                  <p className="font-medium">{user._count.createdPlans}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

