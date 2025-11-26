import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { prisma } from './db'

export enum UserRole {
  USER = 'USER',
  CONTRIBUTOR = 'CONTRIBUTOR',
  ADMIN = 'ADMIN',
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return false

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  return user?.role === role
}

/**
 * Vérifie si l'utilisateur est administrateur
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole(UserRole.ADMIN)
}

/**
 * Vérifie si l'utilisateur est contributeur ou admin
 */
export async function canCreatePlans(): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return false

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  return user?.role === UserRole.CONTRIBUTOR || user?.role === UserRole.ADMIN
}

/**
 * Récupère le rôle de l'utilisateur actuel
 */
export async function getUserRole(): Promise<UserRole | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  return user?.role as UserRole || null
}

/**
 * Vérifie si l'utilisateur peut modifier un plan
 * (propriétaire, contributeur ou admin)
 */
export async function canEditPlan(planId: string): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return false

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (!user) return false

  // Admin peut tout modifier
  if (user.role === UserRole.ADMIN) return true

  // Contributeur peut modifier ses propres plans
  if (user.role === UserRole.CONTRIBUTOR) {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      select: { createdById: true },
    })
    return plan?.createdById === session.user.id
  }

  return false
}

