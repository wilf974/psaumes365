import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { SessionProvider } from '@/components/providers/session-provider'
import { MainNav } from '@/components/layout/main-nav'
import { MainLayoutWrapper } from '@/components/layout/main-layout-wrapper'

/**
 * Layout principal pour les pages authentifiées
 * Inclut la navigation et vérifie l'authentification
 */
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Redirection si non authentifié
  if (!session) {
    redirect('/login')
  }

  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col relative">
        <MainNav user={session.user} />
        <main className="flex-1">
          <MainLayoutWrapper>{children}</MainLayoutWrapper>
        </main>
      </div>
    </SessionProvider>
  )
}


