'use client'

import { PageTransition } from './page-transition'

interface MainLayoutWrapperProps {
  children: React.ReactNode
}

/**
 * Wrapper client pour le layout principal
 * Permet d'utiliser les transitions de page côté client
 */
export function MainLayoutWrapper({ children }: MainLayoutWrapperProps) {
  return <PageTransition>{children}</PageTransition>
}

