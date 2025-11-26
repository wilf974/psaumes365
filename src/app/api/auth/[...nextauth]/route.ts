import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Route handler NextAuth pour l'authentification
 * Gère toutes les routes /api/auth/*
 */
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }


