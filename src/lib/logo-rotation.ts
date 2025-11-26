/**
 * Système de rotation des logos Psaumes365
 * Alterne entre 3 logos selon la semaine ou la page
 */

export type LogoVariant = 1 | 2 | 3

/**
 * Calcule le numéro de semaine depuis le 1er janvier 2024
 * Retourne un nombre entre 1 et 3 pour alterner les logos
 */
export function getLogoByWeek(): LogoVariant {
  const startDate = new Date('2024-01-01')
  const now = new Date()
  const diffTime = now.getTime() - startDate.getTime()
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
  
  // Alterne entre 1, 2, 3 chaque semaine
  return ((diffWeeks % 3) + 1) as LogoVariant
}

/**
 * Obtient un logo selon le chemin de la page
 * Différentes pages peuvent avoir des logos différents
 */
export function getLogoByPage(pathname: string): LogoVariant {
  // Logos spécifiques par section
  const pageLogoMap: Record<string, LogoVariant> = {
    '/accueil': 1,        // Colombe (paix, accueil)
    '/plans': 2,          // Croix (plans spirituels)
    '/journal': 3,        // Livre (journal, écriture)
    '/meditation': 1,     // Colombe (méditation, paix)
    '/favoris': 2,        // Croix (versets favoris)
    '/statistiques': 3,   // Livre (suivi, progression)
    '/parametres': 1,     // Colombe (paramètres)
  }

  // Chercher une correspondance exacte
  if (pageLogoMap[pathname]) {
    return pageLogoMap[pathname]
  }

  // Chercher une correspondance partielle (pour les routes dynamiques)
  for (const [path, logo] of Object.entries(pageLogoMap)) {
    if (pathname.startsWith(path)) {
      return logo
    }
  }

  // Par défaut, utiliser la rotation hebdomadaire
  return getLogoByWeek()
}

/**
 * Obtient le chemin du logo selon le variant
 */
export function getLogoPath(variant: LogoVariant): string {
  return `/logos/logo-${variant}.png`
}

/**
 * Obtient le chemin du favicon selon le variant
 */
export function getFaviconPath(variant: LogoVariant): string {
  return `/logos/favicon-${variant}.png`
}

