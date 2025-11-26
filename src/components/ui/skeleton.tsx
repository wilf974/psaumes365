import { cn } from '@/lib/utils'

/**
 * Composant Skeleton pour afficher des placeholders de chargement
 * Utilisé pour améliorer l'UX pendant le chargement des données
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

export { Skeleton }

