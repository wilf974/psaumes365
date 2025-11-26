'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

/**
 * Provider de session NextAuth pour les composants clients
 * Encapsule l'application pour fournir le contexte de session
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}


