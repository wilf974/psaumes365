/**
 * Optimisations et bonnes pratiques pour les requêtes Prisma
 * Guide pour améliorer les performances des requêtes
 */

import { Prisma } from '@prisma/client'

/**
 * Options d'optimisation pour les requêtes Prisma
 */
export const PrismaOptimizations = {
  /**
   * Sélection minimale des champs (évite de charger des données inutiles)
   */
  selectMinimal: {
    id: true,
    email: true,
    name: true,
  },

  /**
   * Pagination par défaut
   */
  pagination: {
    take: 20,
    skip: 0,
  },

  /**
   * Ordre par défaut pour les listes
   */
  defaultOrderBy: {
    createdAt: 'desc' as Prisma.SortOrder,
  },
}

/**
 * Helper pour créer une requête optimisée avec pagination
 */
export function createPaginatedQuery(page: number = 1, pageSize: number = 20) {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  }
}

/**
 * Helper pour créer un orderBy optimisé
 */
export function createOrderBy(field: string = 'createdAt', order: 'asc' | 'desc' = 'desc') {
  return {
    [field]: order,
  }
}

/**
 * Helper pour créer un where optimisé avec index
 */
export function createWhereWithIndex<T extends Record<string, any>>(
  filters: T,
  indexedFields: (keyof T)[]
): Partial<T> {
  // S'assurer que les champs indexés sont utilisés en premier
  const optimized: Partial<T> = {}
  
  indexedFields.forEach((field) => {
    if (filters[field] !== undefined) {
      optimized[field] = filters[field]
    }
  })

  // Ajouter les autres filtres
  Object.keys(filters).forEach((key) => {
    if (!indexedFields.includes(key as keyof T) && filters[key] !== undefined) {
      optimized[key as keyof T] = filters[key]
    }
  })

  return optimized
}

/**
 * Exemples de requêtes optimisées
 */
export const OptimizedQueries = {
  /**
   * Récupérer les entrées de journal avec pagination
   */
  journalEntries: (userId: string, page: number = 1) => ({
    where: { userId }, // Utilise l'index @@index([userId])
    ...createPaginatedQuery(page, 20),
    orderBy: { createdAt: 'desc' }, // Utilise l'index @@index([userId, createdAt])
    select: {
      id: true,
      content: true,
      verseRef: true,
      createdAt: true,
      updatedAt: true,
    },
  }),

  /**
   * Récupérer les sessions de méditation avec pagination
   */
  meditationSessions: (userId: string, page: number = 1) => ({
    where: { userId }, // Utilise l'index @@index([userId])
    ...createPaginatedQuery(page, 20),
    orderBy: { completedAt: 'desc' }, // Utilise l'index @@index([userId, completedAt])
    select: {
      id: true,
      planId: true,
      dayNumber: true,
      duration: true,
      verseRef: true,
      completedAt: true,
    },
  }),

  /**
   * Récupérer les plans actifs par thème
   */
  activePlansByTheme: (theme: string) => ({
    where: {
      isActive: true, // Utilise l'index composite @@index([isActive, theme])
      theme,
    },
    select: {
      id: true,
      title: true,
      description: true,
      theme: true,
      durationDays: true,
      imageUrl: true,
      imageGradient: true,
      icon: true,
    },
  }),
}

