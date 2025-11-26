import { PrismaClient } from '@prisma/client'

/**
 * Instance globale de PrismaClient pour éviter les connexions multiples en développement
 * En production, une nouvelle instance est créée à chaque requête
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma


