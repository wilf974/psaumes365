# Historique du Projet Psaumes365

## Description
Web-App Chrétienne de Méditation de la Parole - Application gratuite pour la lecture biblique quotidienne et la méditation guidée.

---

## 2024-12-XX - Gestion des Méditations Guidées dans l'Admin

### Actions effectuées
- Création du modèle `GuidedMeditation` dans Prisma
- API routes pour CRUD des méditations guidées (`/api/admin/meditations`)
- Composant `MeditationsManagement` pour l'interface d'administration
- Ajout de l'onglet "Méditations" dans la page admin
- Modification de la page de méditation pour utiliser les méditations de la DB
- Sélection de méditation avec liste des méditations disponibles

### Fichiers créés
- `src/app/api/admin/meditations/route.ts` - CRUD des méditations (admin)
- `src/app/api/admin/meditations/[id]/route.ts` - Opérations sur une méditation spécifique
- `src/app/api/meditations/route.ts` - Liste des méditations actives (public)
- `src/app/api/meditations/[id]/route.ts` - Détails d'une méditation (public)
- `src/components/admin/meditations-management.tsx` - Interface de gestion des méditations

### Fichiers modifiés
- `prisma/schema.prisma` - Ajout du modèle `GuidedMeditation`
- `src/app/(main)/admin/page.tsx` - Ajout de l'onglet "Méditations"
- `src/app/(main)/meditation/page.tsx` - Utilisation des méditations de la DB avec sélection

### Modèle GuidedMeditation
```prisma
model GuidedMeditation {
  id            String   @id @default(cuid())
  title         String
  description   String?  @db.Text
  verseRef      String
  verseText     String   @db.Text
  theme         String?
  reflection    String   @db.Text
  estimatedDuration Int   @default(5)
  audioUrl      String?
  isActive      Boolean  @default(true)
  createdById   String?
  createdBy     User?    @relation("MeditationCreator", ...)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Fonctionnalités
- Création, modification et suppression de méditations guidées
- Activation/désactivation des méditations
- Validation renforcée des champs
- Rate limiting sur les API
- Sélection de méditation dans l'interface utilisateur
- Fallback sur le verset du jour si aucune méditation sélectionnée

---

## 2024-12-XX - Phase 3 - Sécurité et Production (Complétée)

### Actions effectuées
- Implémentation d'un système de rate limiting pour toutes les API
- Validation renforcée des entrées utilisateur avec fonctions dédiées
- Headers de sécurité complets (CSP, HSTS, X-Frame-Options, etc.)
- Optimisation des requêtes Prisma avec index composites
- Scripts de déploiement VPS (setup, Nginx, backup)
- Configuration CI/CD avec GitHub Actions
- Endpoint de santé pour monitoring
- Guide de déploiement complet

### Fichiers créés
- `src/lib/rate-limit.ts` - Système de rate limiting
- `src/lib/middleware/rate-limit.ts` - Middleware de rate limiting
- `src/lib/validation.ts` - Fonctions de validation renforcée
- `src/lib/prisma-optimizations.ts` - Guide d'optimisation Prisma
- `src/middleware.ts` - Middleware Next.js pour les headers de sécurité
- `src/app/api/health/route.ts` - Endpoint de santé
- `scripts/deploy/vps-setup.sh` - Script de configuration VPS
- `scripts/deploy/nginx-config.sh` - Configuration Nginx
- `scripts/deploy/backup-db.sh` - Script de backup automatique
- `.github/workflows/deploy.yml` - CI/CD GitHub Actions
- `README-DEPLOY.md` - Guide de déploiement complet

### Fichiers modifiés
- `next.config.js` - Headers de sécurité
- `prisma/schema.prisma` - Index composites pour optimisation
- `src/app/api/auth/register/route.ts` - Rate limiting et validation
- `src/app/api/audio/generate/route.ts` - Rate limiting
- `src/app/api/bible/search/route.ts` - Rate limiting et validation
- `src/app/api/journal/route.ts` - Rate limiting, validation et optimisation
- `src/app/api/stats/route.ts` - Optimisation des requêtes

### Fonctionnalités de sécurité
- Rate limiting par type d'endpoint (Auth: 5/15min, API: 60/min, Audio: 10/min, Search: 30/min)
- Validation stricte des emails, mots de passe, textes, références bibliques
- Headers de sécurité complets (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.)
- Protection contre les injections et XSS
- Sanitization des entrées utilisateur
- Content Security Policy configurée

### Optimisations Prisma
- Index composites pour les requêtes fréquentes :
  - `@@index([userId, createdAt])` pour JournalEntry
  - `@@index([userId, completedAt])` pour MeditationSession
  - `@@index([userId, planId, currentDay])` pour PlanProgress
  - `@@index([isActive, theme])` pour Plan
- Sélection minimale des champs (select) pour réduire la charge
- Guide d'optimisation avec exemples de requêtes

### Scripts de déploiement
- `vps-setup.sh` : Configuration automatique du VPS (Docker, Nginx, Certbot)
- `nginx-config.sh` : Configuration Nginx avec reverse proxy et cache
- `backup-db.sh` : Script de backup automatique PostgreSQL avec rétention
- `deploy.yml` : CI/CD avec GitHub Actions pour déploiement automatique

### Rate Limits configurés
- **AUTH** : 5 requêtes / 15 minutes (protection contre brute force)
- **PUBLIC_API** : 60 requêtes / minute
- **AUTHENTICATED_API** : 120 requêtes / minute
- **AUDIO_GENERATION** : 10 requêtes / minute (coûteux)
- **SEARCH** : 30 requêtes / minute

### Prochaines étapes manuelles
- Configurer le VPS Debian (exécuter vps-setup.sh)
- Installer Docker sur le VPS (automatique via script)
- Configurer Nginx (exécuter nginx-config.sh)
- Obtenir SSL avec Let's Encrypt (certbot)
- Configurer les secrets GitHub pour CI/CD

---

## 2024-12-XX - Phase 3 - Sécurité et Production

### Actions effectuées
- Implémentation d'un système de rate limiting pour toutes les API
- Validation renforcée des entrées utilisateur
- Headers de sécurité (CSP, HSTS, X-Frame-Options, etc.)
- Optimisation des requêtes Prisma avec index composites
- Scripts de déploiement VPS (setup, Nginx, backup)
- Configuration CI/CD avec GitHub Actions
- Endpoint de santé pour monitoring

### Fichiers créés
- `src/lib/rate-limit.ts` - Système de rate limiting
- `src/lib/middleware/rate-limit.ts` - Middleware de rate limiting
- `src/lib/validation.ts` - Fonctions de validation renforcée
- `src/lib/prisma-optimizations.ts` - Guide d'optimisation Prisma
- `src/middleware.ts` - Middleware Next.js pour les headers de sécurité
- `src/app/api/health/route.ts` - Endpoint de santé
- `scripts/deploy/vps-setup.sh` - Script de configuration VPS
- `scripts/deploy/nginx-config.sh` - Configuration Nginx
- `scripts/deploy/backup-db.sh` - Script de backup automatique
- `.github/workflows/deploy.yml` - CI/CD GitHub Actions

### Fichiers modifiés
- `next.config.js` - Headers de sécurité
- `prisma/schema.prisma` - Index composites pour optimisation
- `src/app/api/auth/register/route.ts` - Rate limiting et validation
- `src/app/api/audio/generate/route.ts` - Rate limiting
- `src/app/api/bible/search/route.ts` - Rate limiting et validation
- `src/app/api/journal/route.ts` - Rate limiting et validation
- `src/app/api/stats/route.ts` - Optimisation des requêtes

### Fonctionnalités de sécurité
- Rate limiting par type d'endpoint (Auth: 5/15min, API: 60/min, Audio: 10/min)
- Validation stricte des emails, mots de passe, textes
- Headers de sécurité complets (CSP, HSTS, X-Frame-Options, etc.)
- Protection contre les injections et XSS
- Sanitization des entrées utilisateur

### Optimisations Prisma
- Index composites pour les requêtes fréquentes
- Sélection minimale des champs (select)
- Pagination par défaut
- Guide d'optimisation avec exemples

### Scripts de déploiement
- Configuration automatique du VPS (Docker, Nginx, Certbot)
- Configuration Nginx avec reverse proxy
- Script de backup automatique PostgreSQL
- CI/CD avec GitHub Actions pour déploiement automatique

### Rate Limits configurés
- **AUTH** : 5 requêtes / 15 minutes
- **PUBLIC_API** : 60 requêtes / minute
- **AUTHENTICATED_API** : 120 requêtes / minute
- **AUDIO_GENERATION** : 10 requêtes / minute
- **SEARCH** : 30 requêtes / minute

---

## 2024-12-XX - Support des fichiers audio pré-enregistrés

### Actions effectuées
- Création d'un système de gestion des fichiers audio pré-enregistrés
- API route pour récupérer les informations sur les fichiers audio pré-enregistrés
- Modification du composant AudioPlayer pour vérifier d'abord les fichiers pré-enregistrés
- Structure pour organiser les fichiers audio par type (verse, meditation, prayer, ambient)
- Fallback automatique sur ElevenLabs si aucun fichier pré-enregistré n'est disponible

### Fichiers créés
- `src/lib/audio-files.ts` - Gestion des fichiers audio pré-enregistrés
- `src/app/api/audio/prerecorded/route.ts` - API pour récupérer les fichiers audio pré-enregistrés

### Fichiers modifiés
- `src/components/audio-player.tsx` - Support des fichiers pré-enregistrés avec fallback ElevenLabs

### Fonctionnalités
- Vérification automatique des fichiers audio pré-enregistrés avant génération
- Support de différents types d'audio (versets, méditations, prières, ambiance)
- Fallback transparent sur ElevenLabs si aucun fichier n'est disponible
- Structure extensible pour ajouter facilement de nouveaux fichiers

### Structure des fichiers
Les fichiers MP3 doivent être placés dans `public/audio/prerecorded/` et référencés dans `PRE_RECORDED_AUDIO` dans `src/lib/audio-files.ts`

---

## 2024-12-XX - Analytics respectueux de la vie privée

### Actions effectuées
- Création d'un système d'analytics sans cookies et sans données personnelles
- API route pour enregistrer les événements anonymisés
- Intégration des analytics dans les composants principaux
- Option dans les paramètres pour activer/désactiver l'analytics
- Tracking des événements : page views, versets lus, méditations, favoris, audio, recherche, partage

### Fichiers créés
- `src/lib/analytics.ts` - Système d'analytics avec fonctions de tracking
- `src/app/api/analytics/route.ts` - API pour enregistrer et récupérer les analytics

### Fichiers modifiés
- `src/app/(main)/parametres/page.tsx` - Ajout de l'option analytics
- `src/app/(main)/accueil/page.tsx` - Tracking des page views et versets lus
- `src/components/bible/verse-card.tsx` - Tracking des favoris et audio
- `src/components/ui/share-button.tsx` - Tracking des partages
- `src/app/(main)/recherche/page.tsx` - Tracking des recherches
- `src/app/(main)/meditation/page.tsx` - Tracking des méditations

### Fonctionnalités
- Analytics 100% anonyme (aucune donnée personnelle)
- Aucun cookie utilisé
- Option utilisateur pour activer/désactiver
- Tracking des événements principaux de l'application
- Données agrégées uniquement (Admin peut voir les stats)

### Événements trackés
- `page_view` - Vues de pages
- `verse_read` - Versets lus
- `meditation_started` - Démarrage de méditation
- `meditation_completed` - Complétion de méditation
- `favorite_added` - Ajout de favori
- `audio_played` - Lecture audio
- `search_performed` - Recherche effectuée
- `share_clicked` - Partage sur réseaux sociaux

---

## 2024-12-XX - Configuration des tests

### Actions effectuées
- Configuration de Vitest pour les tests unitaires
- Configuration de Playwright pour les tests E2E
- Création de tests unitaires pour les fonctions utilitaires (cleanText)
- Création de tests E2E pour l'authentification et les versets
- Configuration des scripts npm pour exécuter les tests
- Setup des mocks pour Next.js (router, image)

### Fichiers créés
- `vitest.config.ts` - Configuration Vitest
- `tests/setup.ts` - Configuration globale des tests
- `tests/utils/clean-text.test.ts` - Tests unitaires pour cleanText
- `playwright.config.ts` - Configuration Playwright
- `tests/e2e/auth.spec.ts` - Tests E2E pour l'authentification
- `tests/e2e/verse.spec.ts` - Tests E2E pour les versets

### Fichiers modifiés
- `package.json` - Ajout des dépendances de test et scripts

### Fonctionnalités
- Tests unitaires avec Vitest et jsdom
- Tests E2E avec Playwright (Chrome, Firefox, Safari, Mobile)
- Mocks pour Next.js router et image
- Configuration pour CI/CD

### Commandes disponibles
- `npm test` - Exécuter les tests unitaires
- `npm run test:ui` - Interface graphique pour les tests
- `npm run test:e2e` - Exécuter les tests E2E
- `npm run test:e2e:ui` - Interface graphique pour les tests E2E

---

## 2024-12-XX - Banque de versets commentés

### Actions effectuées
- Création du modèle `CommentedVerse` dans Prisma pour stocker les versets avec commentaires
- API routes pour gérer les commentaires (GET, POST, DELETE)
- Intégration des commentaires dans le composant `VerseCard`
- Affichage conditionnel des commentaires avec animation
- Support des thèmes et auteurs pour les commentaires
- Permissions : Admin et Contributor peuvent créer/modifier, Admin peut désactiver

### Fichiers créés
- `src/app/api/bible/comments/route.ts` - API pour lister et créer des commentaires
- `src/app/api/bible/comments/[verseRef]/route.ts` - API pour un commentaire spécifique

### Fichiers modifiés
- `prisma/schema.prisma` - Ajout du modèle `CommentedVerse`
- `src/components/bible/verse-card.tsx` - Affichage des commentaires avec animation

### Fonctionnalités
- Stockage de versets avec commentaires/explications
- Affichage élégant des commentaires dans les cartes de versets
- Support des thèmes et auteurs
- Animation d'ouverture/fermeture des commentaires
- Gestion des permissions (Admin/Contributor)

### Structure du modèle
- `verseRef` : Référence biblique unique
- `verseText` : Texte du verset
- `commentary` : Commentaire/explication
- `theme` : Thème associé (optionnel)
- `author` : Auteur du commentaire (optionnel)
- `translation` : Traduction utilisée (défaut: LSG)
- `isActive` : Pour activer/désactiver un commentaire

---

## 2024-12-XX - Conversion des icônes SVG en PNG

### Actions effectuées
- Création d'un script de conversion SVG vers PNG utilisant sharp
- Génération de toutes les icônes PNG aux différentes tailles (72x72 à 512x512)
- Mise à jour du manifest.json pour utiliser les PNG au lieu des SVG
- Ajout de scripts npm pour faciliter la génération et conversion des icônes

### Fichiers créés
- `scripts/svg-to-png.js` - Script de conversion SVG vers PNG

### Fichiers modifiés
- `package.json` - Ajout de `sharp` en devDependency et scripts `icons:generate` et `icons:convert`
- `public/manifest.json` - Mise à jour pour utiliser les icônes PNG

### Fonctionnalités
- Conversion automatique des icônes SVG en PNG
- Meilleure compatibilité PWA avec les icônes PNG
- Scripts npm pour faciliter la maintenance des icônes

### Commandes disponibles
- `npm run icons:generate` - Génère les icônes SVG
- `npm run icons:convert` - Convertit les SVG en PNG

---

## 2024-12-XX - Amélioration de la méditation guidée

### Actions effectuées
- Remplacement du verset statique par le verset du jour réel
- Chargement du verset depuis l'API avec fallback sur le cache
- Sauvegarde automatique des sessions de méditation complétées
- Affichage du loading pendant le chargement du verset
- Intégration avec le système de statistiques

### Fichiers modifiés
- `src/app/(main)/meditation/page.tsx` - Utilisation du verset du jour réel et sauvegarde des sessions

### Fonctionnalités
- Verset du jour dynamique dans la méditation
- Fallback sur le cache en cas de problème réseau
- Sauvegarde automatique des sessions complétées
- Calcul de la durée totale de méditation
- Intégration avec les statistiques utilisateur

---

## 2024-12-XX - Mode hors-ligne avancé

### Actions effectuées
- Création d'un système de cache côté client avec localStorage
- Amélioration du service worker avec stratégies de cache différenciées
- Cache des versets du jour (24h)
- Cache des plans en cours (1h)
- Cache de la liste des plans (6h)
- Cache des détails de plans (12h)
- Nettoyage automatique des caches expirés
- Provider pour enregistrer le service worker automatiquement

### Fichiers créés
- `src/lib/offline-cache.ts` - Système de cache avec localStorage
- `src/components/providers/offline-provider.tsx` - Provider pour le mode hors-ligne

### Fichiers modifiés
- `public/sw.js` - Service worker amélioré avec cache API et statique séparés
- `src/app/(main)/accueil/page.tsx` - Intégration du cache pour verset du jour et plan en cours
- `src/app/(main)/plans/page.tsx` - Intégration du cache pour la liste des plans
- `src/app/(main)/plans/[id]/page.tsx` - Intégration du cache pour les détails de plans
- `src/app/layout.tsx` - Ajout du OfflineProvider

### Fonctionnalités
- Cache intelligent avec durées de validité différentes selon le type de données
- Fallback automatique sur le cache en cas de perte de connexion
- Service worker avec stratégies Network First et Cache First
- Nettoyage automatique des caches expirés
- Support du mode hors-ligne pour les fonctionnalités principales

### Stratégies de cache
- **Pages statiques** : Cache First avec mise à jour en arrière-plan
- **Routes API** : Network First avec fallback cache
- **Données utilisateur** : localStorage avec validation de version et expiration

---

## 2024-12-XX - Optimisation des images

### Actions effectuées
- Remplacement de toutes les balises `<img>` par le composant `Image` de Next.js
- Configuration des attributs `sizes` pour un chargement adaptatif
- Utilisation de `fill` pour les images responsives
- Ajout d'attributs `alt` descriptifs pour l'accessibilité
- Configuration des formats modernes (AVIF, WebP) dans next.config.js

### Fichiers modifiés
- `src/app/(main)/plans/page.tsx` - Images des plans et modal plein écran
- `src/app/(main)/plans/[id]/page.tsx` - Image du plan détaillé et modal
- `src/components/admin/plans-management.tsx` - Aperçu de l'image dans le formulaire
- `next.config.js` - Configuration des formats d'images (déjà fait précédemment)

### Fonctionnalités
- Chargement adaptatif selon la taille d'écran
- Optimisation automatique des images par Next.js
- Support des formats modernes (AVIF, WebP)
- Lazy loading automatique
- Meilleure accessibilité avec attributs alt

### Bénéfices
- Réduction de la taille des images
- Amélioration des performances de chargement
- Meilleure expérience utilisateur
- SEO amélioré avec images optimisées

---

## 2024-12-XX - Optimisation des performances

### Actions effectuées
- Implémentation du lazy loading pour les composants lourds
- Code splitting avec dynamic imports de Next.js
- Optimisation des imports de packages (lucide-react, framer-motion)
- Compression activée dans Next.js
- Optimisation des images (AVIF, WebP)

### Fichiers modifiés
- `src/app/(main)/accueil/page.tsx` - Lazy loading du OnboardingModal
- `src/app/(main)/admin/page.tsx` - Lazy loading des composants admin (PlansManagement, UsersManagement, StatsOverview)
- `src/app/(main)/plans/[id]/page.tsx` - Lazy loading de l'AmbientPlayer
- `next.config.js` - Configuration de la compression et optimisation des packages

### Fonctionnalités
- Composants admin chargés uniquement quand l'onglet est actif
- Modal d'onboarding chargé uniquement si nécessaire
- Lecteur de musique d'ambiance chargé uniquement sur la page des plans
- Compression automatique des assets
- Optimisation des imports de packages volumineux
- Support des formats d'images modernes (AVIF, WebP)

### Bénéfices
- Réduction du bundle initial
- Amélioration du temps de chargement initial
- Meilleure expérience utilisateur
- Optimisation du code splitting automatique

---

## 2024-12-XX - Implémentation du SEO avancé

### Actions effectuées
- Création d'un sitemap.xml dynamique avec toutes les pages de l'application
- Création d'un robots.txt pour guider les moteurs de recherche
- Amélioration des métadonnées OpenGraph pour le partage sur les réseaux sociaux
- Ajout des Twitter Cards pour un meilleur affichage sur Twitter/X
- Configuration des robots pour optimiser l'indexation

### Fichiers créés
- `src/app/sitemap.ts` - Génération dynamique du sitemap XML
- `src/app/robots.ts` - Configuration du robots.txt

### Fichiers modifiés
- `src/app/layout.tsx` - Amélioration des métadonnées SEO (OpenGraph, Twitter Cards, robots)

### Fonctionnalités
- Sitemap avec toutes les pages publiques et authentifiées
- Priorités et fréquences de mise à jour configurées
- Robots.txt avec règles d'exclusion pour les routes API et admin
- Métadonnées OpenGraph complètes pour le partage social
- Twitter Cards pour un meilleur rendu sur Twitter/X
- Configuration robots pour Google et autres moteurs de recherche

---

## 2024-12-XX - Implémentation du système d'onboarding

### Actions effectuées
- Ajout du champ `hasCompletedOnboarding` dans le modèle User
- Création d'un composant OnboardingModal avec 5 étapes interactives
- Guide des fonctionnalités principales (verset du jour, plans, recherche, partage, musique)
- API route pour marquer l'onboarding comme complété
- Affichage automatique du modal pour les nouveaux utilisateurs
- Indicateur de progression visuel (points)
- Navigation entre les étapes avec boutons Précédent/Suivant

### Fichiers créés
- `src/components/onboarding/onboarding-modal.tsx` - Modal d'onboarding interactif
- `src/app/api/user/onboarding/route.ts` - API pour gérer l'état d'onboarding

### Fichiers modifiés
- `prisma/schema.prisma` - Ajout du champ `hasCompletedOnboarding` et correction des relations
- `src/app/(main)/accueil/page.tsx` - Intégration du modal d'onboarding
- `src/lib/auth.ts` - Ajout de `hasCompletedOnboarding` dans les données utilisateur
- `src/types/next-auth.d.ts` - Extension des types pour inclure l'onboarding

### Fonctionnalités
- Modal d'accueil avec 5 étapes de présentation
- Présentation des fonctionnalités principales (verset du jour, plans, recherche, partage, musique)
- Indicateur de progression visuel
- Navigation fluide entre les étapes
- Sauvegarde de l'état d'onboarding en base de données
- Affichage unique pour les nouveaux utilisateurs

---

## 2024-12-XX - Implémentation du partage de versets

### Actions effectuées
- Création d'un composant ShareButton réutilisable avec menu déroulant
- Support du Web Share API natif (mobile)
- Partage sur les réseaux sociaux (Facebook, Twitter/X, WhatsApp)
- Copie dans le presse-papiers avec feedback visuel
- Intégration du bouton de partage dans tous les composants de versets

### Fichiers créés
- `src/components/ui/share-button.tsx` - Composant de partage réutilisable
- `src/components/ui/dropdown-menu.tsx` - Composant DropdownMenu (shadcn/ui)

### Fichiers modifiés
- `src/components/bible/verse-card.tsx` - Ajout du bouton de partage
- `src/app/(main)/accueil/page.tsx` - Partage sur le verset du jour
- `src/app/(main)/plans/[id]/page.tsx` - Partage sur les versets des plans
- `src/app/(main)/recherche/page.tsx` - Partage sur les résultats de recherche
- `src/app/(main)/favoris/page.tsx` - Partage sur les favoris

### Fonctionnalités
- Partage natif via Web Share API (iOS/Android)
- Partage sur Facebook avec citation
- Partage sur Twitter/X avec texte formaté
- Partage sur WhatsApp avec formatage
- Copie dans le presse-papiers avec confirmation visuelle
- Menu déroulant élégant avec icônes
- Format de texte cohérent : "Texte" — Référence — Partagé via Psaumes365

---

## 2024-12-XX - Implémentation de la recherche de versets

### Actions effectuées
- Création d'une fonction de recherche dans l'API Bible (recherche textuelle et par référence)
- Ajout d'une fonction de parsing de références bibliques (ex: "Jean 3:16" → "JHN.3.16")
- Création d'une page de recherche avec interface utilisateur complète
- Intégration de la recherche dans la navigation principale
- Support de la recherche par mots-clés et par référence biblique
- Debounce pour optimiser les requêtes API

### Fichiers créés
- `src/app/api/bible/search/route.ts` - API route pour la recherche de versets
- `src/app/(main)/recherche/page.tsx` - Page de recherche avec interface utilisateur

### Fichiers modifiés
- `src/lib/bible-api.ts` - Ajout des fonctions `searchVerses()` et `parseReference()`
- `src/components/layout/main-nav.tsx` - Ajout du lien "Recherche" dans la navigation

### Fonctionnalités
- Recherche textuelle dans le contenu des versets
- Recherche par référence biblique (ex: "Jean 3:16", "Psaume 23:1-6")
- Debounce de 500ms pour optimiser les requêtes
- Affichage des résultats avec audio playback
- Gestion des erreurs et états de chargement
- Suggestions de recherche pour guider l'utilisateur
- Support de jusqu'à 30 résultats par recherche

---

## 2024-12-XX - Ajout des skeletons loaders pour améliorer l'UX

### Actions effectuées
- Création d'un composant Skeleton réutilisable basé sur shadcn/ui
- Intégration des skeletons loaders sur toutes les pages principales
- Remplacement des anciens indicateurs de chargement par des skeletons plus élégants
- Amélioration de l'expérience utilisateur pendant le chargement des données

### Fichiers créés
- `src/components/ui/skeleton.tsx` - Composant Skeleton réutilisable

### Fichiers modifiés
- `src/app/(main)/accueil/page.tsx` - Skeleton pour le verset du jour
- `src/app/(main)/plans/page.tsx` - Skeleton pour la liste des plans
- `src/app/(main)/favoris/page.tsx` - Skeleton pour les favoris
- `src/app/(main)/statistiques/page.tsx` - Skeleton pour les statistiques
- `src/components/ui/loading-screen.tsx` - Correction des imports manquants

### Améliorations
- Skeletons avec animation pulse pour un feedback visuel
- Structure des skeletons correspondant au layout final
- Meilleure perception de performance pour l'utilisateur
- Design cohérent avec le thème de l'application

---

## 2024-12-XX - Amélioration du responsive design pour mobile (iPhone 16 Pro)

### Actions effectuées
- Correction des problèmes de responsive sur iPhone 16 Pro et autres appareils mobiles
- Ajustement des espacements (padding, margin) pour mobile
- Optimisation des tailles de police avec breakpoints adaptatifs
- Amélioration de la navigation mobile (menu hamburger, largeur du menu)
- Optimisation des grilles et layouts pour petits écrans
- Ajustement des boutons et éléments interactifs pour le tactile
- Correction des formulaires admin pour mobile
- Amélioration de l'affichage des cartes et composants

### Fichiers modifiés
- `src/components/layout/main-nav.tsx` - Navigation mobile optimisée (hauteur header, largeur menu)
- `src/app/(main)/plans/page.tsx` - Espacements et tailles de police adaptatifs
- `src/app/(main)/plans/[id]/page.tsx` - Responsive pour la page de détail des plans
- `src/app/(main)/accueil/page.tsx` - Ajustements responsive
- `src/app/(main)/journal/page.tsx` - Optimisation mobile
- `src/app/(main)/favoris/page.tsx` - Responsive amélioré
- `src/app/(main)/parametres/page.tsx` - Ajustements mobile
- `src/app/(main)/statistiques/page.tsx` - Grilles et espacements adaptatifs
- `src/app/(main)/admin/page.tsx` - Responsive pour l'administration
- `src/components/admin/plans-management.tsx` - Formulaires et cartes optimisés pour mobile
- `src/components/audio-player.tsx` - Tailles de boutons adaptatives

### Améliorations spécifiques
- Padding réduit sur mobile (`px-3` au lieu de `px-4` sur très petits écrans)
- Tailles de police adaptatives (`text-xl sm:text-2xl md:text-3xl`)
- Menu mobile avec largeur adaptative (`w-[85vw] max-w-xs`)
- Boutons en pleine largeur sur mobile (`w-full sm:w-auto`)
- Grilles avec gaps réduits sur mobile (`gap-2 sm:gap-3 md:gap-4`)
- Filtres et onglets avec scroll horizontal sur mobile
- Cartes admin avec layout flex-col sur mobile
- Formulaires avec espacements réduits sur mobile

---

## 2024-11-25 - Initialisation du projet

### Actions effectuées
- Création de l'infrastructure Docker (docker-compose.yml, Dockerfile)
- Configuration Next.js 14 avec App Router
- Setup Prisma avec PostgreSQL
- Configuration TailwindCSS avec palette calme (beige, sable, bleu ciel, vert olive)
- Création du schéma de base de données

### Fichiers créés
- `docker-compose.yml` - Configuration Docker Compose (ports 10000, 10001)
- `Dockerfile` - Image Next.js 14
- `package.json` - Dépendances du projet
- `tsconfig.json` - Configuration TypeScript
- `next.config.js` - Configuration Next.js
- `tailwind.config.ts` - Configuration Tailwind avec palette personnalisée
- `postcss.config.js` - Configuration PostCSS
- `prisma/schema.prisma` - Schéma de base de données
- `.gitignore` - Fichiers ignorés par Git
- `historique.md` - Ce fichier

### Architecture choisie
- **Frontend**: Next.js 14 (App Router) + TailwindCSS + shadcn/ui
- **State**: Zustand
- **Animations**: Framer Motion
- **Backend**: Next.js API Routes
- **Base de données**: PostgreSQL (Docker)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Bible API**: api.bible (externe)
- **Conteneurisation**: Docker + Docker Compose

### Ports configurés
- `10000` - Application Next.js
- `10001` - PostgreSQL

---

## 2024-11-25 - Développement MVP complet

### Actions effectuées
- Création du système d'authentification (NextAuth.js)
- Pages login et register avec formulaires
- Layout principal avec navigation responsive
- Intégration API api.bible avec fallback local
- Composant VerseCard avec TTS (Web Speech API)
- Module de méditation guidée en 5 étapes (Lire - Comprendre - Méditer - Prier - Appliquer)
- Plans de méditation thématiques (Paix, Identité, Combat, Guérison, Foi, Famille)
- Journal spirituel avec CRUD complet
- Configuration PWA (manifest.json, Service Worker, notifications)
- Store Zustand pour la gestion de l'état global

### Fichiers créés
- `src/lib/auth.ts` - Configuration NextAuth
- `src/lib/bible-api.ts` - Client API Bible
- `src/lib/notifications.ts` - Service de notifications PWA
- `src/stores/app-store.ts` - Store Zustand
- `src/app/(auth)/login/page.tsx` - Page de connexion
- `src/app/(auth)/register/page.tsx` - Page d'inscription
- `src/app/(main)/layout.tsx` - Layout authentifié
- `src/app/(main)/accueil/page.tsx` - Tableau de bord
- `src/app/(main)/meditation/page.tsx` - Méditation guidée
- `src/app/(main)/plans/page.tsx` - Liste des plans
- `src/app/(main)/plans/[id]/page.tsx` - Détail d'un plan
- `src/app/(main)/journal/page.tsx` - Journal spirituel
- `src/app/api/auth/register/route.ts` - API inscription
- `src/app/api/bible/daily-verse/route.ts` - API verset du jour
- `src/app/api/journal/route.ts` - API journal (GET, POST)
- `src/app/api/journal/[id]/route.ts` - API journal item (GET, PUT, DELETE)
- `src/components/layout/main-nav.tsx` - Navigation principale
- `src/components/bible/verse-card.tsx` - Affichage verset avec TTS
- `src/components/ui/*` - Composants UI (button, card, input, label, textarea, progress)
- `public/manifest.json` - Manifest PWA
- `public/sw.js` - Service Worker

### Fonctionnalités MVP implémentées
1. ✅ Lecture du jour avec verset et TTS
2. ✅ Méditation guidée (5 étapes avec timer)
3. ✅ Plans thématiques 7/14/21/30 jours
4. ✅ Journal spirituel (CRUD)
5. ✅ Authentification utilisateur
6. ✅ UI calme et épurée (palette beige/sable/ciel/olive)
7. ✅ Configuration PWA avec notifications

### Prochaines étapes
- Générer les icônes PWA (72x72 à 512x512)
- Ajouter des fichiers audio pré-enregistrés
- Statistiques de méditation
- Mode hors-ligne avancé

---

## 2024-11-25 - Phase 2 : Améliorations

### Actions effectuées
- Création fichier de données centralisé pour les plans (`src/data/plans.ts`)
- Ajout de 5 plans de méditation complets (7 jours chacun) :
  - La Paix intérieure
  - Identité en Christ
  - La Foi qui déplace les montagnes
  - Combat spirituel
  - Guérison intérieure
- Implémentation du mode sombre avec toggle
- Création de la page Paramètres utilisateur
- Ajout du lien Paramètres dans la navigation

### Fichiers créés/modifiés
- `src/data/plans.ts` - Données des 5 plans de méditation
- `src/components/theme-toggle.tsx` - Toggle thème clair/sombre
- `src/app/(main)/parametres/page.tsx` - Page paramètres
- `src/app/(main)/plans/page.tsx` - Mise à jour avec nouvelles données
- `src/app/(main)/plans/[id]/page.tsx` - Mise à jour avec TTS et message de fin
- `src/components/layout/main-nav.tsx` - Ajout paramètres et toggle thème

---

## 2024-11-25 - Intégration ElevenLabs Audio

### Actions effectuées
- Intégration de l'API ElevenLabs pour la génération de voix IA
- Création du service `elevenlabs.ts` pour la génération audio
- API Route `/api/audio/generate` avec mise en cache des fichiers générés
- Composant `AudioPlayer` réutilisable avec génération à la demande
- Intégration dans les plans de méditation (versets, méditations, prières)
- Dossier de cache `public/audio/generated/` pour les MP3

### Fichiers créés
- `src/lib/elevenlabs.ts` - Client API ElevenLabs
- `src/app/api/audio/generate/route.ts` - API de génération audio
- `src/components/audio-player.tsx` - Lecteur audio avec génération

### Configuration
- Variable d'environnement `ELEVENLABS_API_KEY` ajoutée
- Voix utilisée : Charlotte (française, calme)
- Modèle : eleven_multilingual_v2

---

## 2024-11-25 - Cache Audio en Base de Données

### Actions effectuées
- Création du modèle `GeneratedAudio` dans Prisma pour stocker les métadonnées audio
- Système de hash MD5 pour identifier les textes uniques et éviter la régénération
- Mise à jour de l'API `/api/audio/generate` :
  - Vérifie d'abord en base si l'audio existe (économie de crédits)
  - Stocke les nouveaux audios en base avec leur chemin fichier
  - Retourne l'URL directement si le fichier est en cache
- Ajout du lecteur audio ElevenLabs sur le verset du jour (page accueil)
- Endpoint GET pour consulter les statistiques d'utilisation audio

### Fichiers modifiés
- `prisma/schema.prisma` - Ajout modèle `GeneratedAudio`
- `src/app/api/audio/generate/route.ts` - Logique de cache en DB
- `src/app/(main)/accueil/page.tsx` - AudioPlayer sur le verset du jour

### Schéma GeneratedAudio
```prisma
model GeneratedAudio {
  id          String   @id @default(cuid())
  textHash    String   @unique // Hash MD5 pour identification
  text        String   @db.Text
  audioPath   String   // Chemin du fichier MP3
  voiceId     String   @default("XB0fDUnXU5powFXDhCwa")
  duration    Int?
  fileSize    Int?
  createdAt   DateTime @default(now())
}
```

### Avantages
- ⚡ Économie de crédits ElevenLabs (pas de double génération)
- 🚀 Temps de réponse immédiat pour les audios déjà générés
- 📊 Possibilité de suivre l'utilisation et le stockage

---

## 2024-11-25 - Extension des Plans de Méditation

### Actions effectuées
- Mise à jour de toutes les prières pour finir par "au nom de Jésus, Amen"
- Ajout de 5 nouveaux plans de méditation (total : 10 plans)

### Nouveaux plans ajoutés
6. **La Gratitude** - Cultiver un cœur reconnaissant (7 jours)
7. **L'Amour de Dieu** - Plonger dans l'amour du Père (7 jours)
8. **La Sagesse divine** - Rechercher la sagesse d'en haut (7 jours)
9. **La Prière efficace** - Approfondir sa vie de prière (7 jours)
10. **La Persévérance** - Rester ferme dans les épreuves (7 jours)

### Fichiers modifiés
- `src/data/plans.ts` - 10 plans complets avec 70 jours de méditation au total

---

## 2024-11-25 - Configuration API Bible

### Actions effectuées
- Configuration de la clé API api.bible
- Mise à jour du endpoint API vers `https://rest.api.bible`
- Ajout des variables d'environnement `BIBLE_API_KEY` et `BIBLE_API_URL`

### Fichiers modifiés
- `.env` - Ajout des clés API
- `docker-compose.yml` - Ajout des variables d'environnement
- `src/lib/bible-api.ts` - Mise à jour du endpoint API

### Configuration API
- Clé API : `Uof6_k9CYF-tc8vly8mm9`
- Endpoint : `https://rest.api.bible`
- Bible utilisée : Louis Segond (ID: `61fd76eafa1577c2-01`)

---

## 2024-11-25 - Statistiques et Favoris

### Actions effectuées
- Création des modèles Prisma `MeditationSession` et `FavoriteVerse`
- API `/api/stats` pour les statistiques de méditation
- API `/api/favorites` pour gérer les versets favoris
- Page `/statistiques` avec affichage du streak, temps total, jours actifs
- Page `/favoris` pour consulter et gérer les versets sauvegardés
- Bouton favori (❤️) ajouté au composant VerseCard
- Navigation mise à jour avec liens Stats et Favoris

### Fichiers créés
- `src/app/api/stats/route.ts` - API statistiques
- `src/app/api/favorites/route.ts` - API favoris
- `src/app/(main)/statistiques/page.tsx` - Page statistiques
- `src/app/(main)/favoris/page.tsx` - Page favoris

### Fichiers modifiés
- `prisma/schema.prisma` - Ajout MeditationSession et FavoriteVerse
- `src/components/bible/verse-card.tsx` - Ajout bouton favori
- `src/components/layout/main-nav.tsx` - Ajout liens navigation

### Fonctionnalités statistiques
- Streak (jours consécutifs de méditation)
- Nombre total de sessions
- Temps total de méditation
- Jours actifs
- Graphique d'activité hebdomadaire
- Plans complétés / en cours

---

## 2024-11-25 - Lecteur Musique d'Ambiance

### Actions effectuées
- Création du composant `AmbientPlayer` pour la musique de fond
- Intégration dans la page de méditation des plans
- Support pour 4 pistes d'ambiance : Paix, Adoration, Méditation, Nature
- Contrôle du volume intégré
- Mode compact disponible

### Fichiers créés
- `src/components/ambient-player.tsx` - Lecteur de musique d'ambiance
- `public/audio/ambient/.gitkeep` - Dossier pour les fichiers MP3

### Fichiers modifiés
- `src/app/(main)/plans/[id]/page.tsx` - Ajout du lecteur d'ambiance

### Usage
Pour ajouter des musiques d'ambiance :
1. Placer des fichiers MP3 dans `public/audio/ambient/`
2. Nommer les fichiers : `peace.mp3`, `worship.mp3`, `meditation.mp3`, `nature.mp3`
3. Les pistes apparaîtront automatiquement dans le lecteur

### Note
L'API ElevenMusic n'est pas encore documentée publiquement. 
Le lecteur utilise des fichiers locaux en attendant.

---

## 2024-11-25 - Correction docker-compose.yml

### Problème identifié
Le fichier `docker-compose.yml` était vide, causant l'erreur "empty compose file" lors de l'exécution de `docker-compose up -d`.

### Actions effectuées
- Recréation complète du fichier `docker-compose.yml` avec la configuration correcte
- Configuration des services `psaumes365-app` et `psaumes365-db`
- Configuration des ports (10000 pour l'app, 10001 pour la DB)
- Configuration des variables d'environnement (DATABASE_URL, NEXTAUTH_URL, ELEVENLABS_API_KEY, BIBLE_API_KEY)
- Configuration du réseau et des volumes persistants

### Fichiers modifiés
- `docker-compose.yml` - Recréé avec la configuration complète

---

## 2024-11-25 - Améliorations UI/UX et génération d'icônes PWA

### Actions effectuées
- Création d'un script de génération d'icônes PWA (SVG) pour toutes les tailles requises
- Génération des 8 icônes PWA (72x72 à 512x512) avec design cohérent (livre ouvert, dégradé vert/bleu)
- Création d'un composant `PageTransition` pour des transitions fluides entre pages avec Framer Motion
- Création d'un composant `LoadingScreen` pour un écran de chargement personnalisé avec animations
- Création d'un composant `FadeIn` réutilisable pour les animations d'apparition
- Intégration des transitions de page dans le layout principal
- Mise à jour du manifest.json pour utiliser les icônes SVG générées

### Fichiers créés
- `scripts/generate-icons.js` - Script Node.js pour générer les icônes PWA
- `src/components/layout/page-transition.tsx` - Composant de transition de page
- `src/components/layout/main-layout-wrapper.tsx` - Wrapper client pour les transitions
- `src/components/ui/loading-screen.tsx` - Écran de chargement personnalisé
- `src/components/ui/fade-in.tsx` - Composant d'animation d'apparition
- `public/icons/icon-*.svg` - 8 icônes PWA générées (72x72 à 512x512)

### Fichiers modifiés
- `public/manifest.json` - Mise à jour pour utiliser les icônes SVG
- `src/app/layout.tsx` - Mise à jour du lien apple-touch-icon
- `src/app/(main)/layout.tsx` - Intégration du wrapper de transition

### Améliorations UX
- Transitions douces entre les pages (fade + slide)
- Écran de chargement élégant avec animation
- Micro-interactions améliorées avec Framer Motion
- Design cohérent des icônes PWA avec le thème de l'application

---

## 2024-11-25 - Responsive Design Complet

### Actions effectuées
- Création d'un menu hamburger pour la navigation mobile avec animation slide
- Optimisation de toutes les pages pour mobile, tablette et desktop
- Amélioration des espacements et tailles de texte pour petits écrans
- Adaptation des composants audio et lecteurs pour mobile
- Utilisation cohérente des breakpoints Tailwind (sm, md, lg)

### Fichiers modifiés
- `src/components/layout/main-nav.tsx` - Menu hamburger mobile avec overlay animé
- `src/app/(main)/accueil/page.tsx` - Responsive padding, titres et grilles
- `src/app/(main)/plans/page.tsx` - Grilles responsive et espacements adaptatifs
- `src/app/(main)/plans/[id]/page.tsx` - Layout flexible pour mobile, audio responsive
- `src/app/(main)/journal/page.tsx` - Formulaire et liste adaptés mobile
- `src/app/(main)/statistiques/page.tsx` - Grilles responsive pour cartes stats
- `src/app/(main)/favoris/page.tsx` - Liste responsive
- `src/app/(main)/parametres/page.tsx` - Formulaire responsive
- `src/components/ambient-player.tsx` - Contrôles adaptés mobile

### Améliorations Responsive
- **Navigation** : Menu hamburger avec slide-in sur mobile, navigation desktop sur écrans larges
- **Typographie** : Tailles de texte adaptatives (text-2xl sm:text-3xl)
- **Espacements** : Padding responsive (px-4 sm:px-6, py-6 sm:py-8)
- **Grilles** : grid-cols-1 sm:grid-cols-2 pour s'adapter aux écrans
- **Composants** : Flex direction adaptative (flex-col sm:flex-row)
- **Audio** : Boutons et contrôles optimisés pour le tactile

### Breakpoints utilisés
- `sm:` : 640px+ (tablettes et plus)
- `md:` : 768px+ (desktop)
- `lg:` : 1024px+ (large desktop)

---

## 2024-11-25 - Intégration des logos avec rotation automatique

### Actions effectuées
- Création d'un système de rotation des logos (3 variantes)
- Intégration des 3 logos dans l'application
- Système d'alternance par page (logo différent selon la section)
- Système d'alternance hebdomadaire (rotation automatique chaque semaine)
- Composant Logo réutilisable avec support de rotation automatique
- Route dynamique pour le favicon (change chaque semaine)
- Mise à jour de toutes les pages pour utiliser les logos

### Fichiers créés
- `src/lib/logo-rotation.ts` - Logique de rotation des logos (par page et par semaine)
- `src/components/ui/logo.tsx` - Composant Logo réutilisable
- `src/app/favicon/route.ts` - Route dynamique pour favicon avec rotation hebdomadaire
- `public/logos/logo-1.png` - Logo 1 (Colombe avec branche d'olivier)
- `public/logos/logo-2.png` - Logo 2 (Croix dorée sur colline)
- `public/logos/logo-3.png` - Logo 3 (Livre ouvert avec soleil)

### Fichiers modifiés
- `src/components/layout/main-nav.tsx` - Utilisation du composant Logo
- `src/app/page.tsx` - Logo sur la page d'accueil publique
- `src/app/(auth)/login/page.tsx` - Logo sur la page de connexion (variant 1)
- `src/app/(auth)/register/page.tsx` - Logo sur la page d'inscription (variant 2)
- `src/app/layout.tsx` - Favicon dynamique

### Système de rotation
- **Par page** : Chaque section a un logo spécifique
  - Accueil/Méditation : Logo 1 (Colombe - paix)
  - Plans/Favoris : Logo 2 (Croix - spiritualité)
  - Journal/Statistiques : Logo 3 (Livre - écriture, progression)
- **Par semaine** : Rotation automatique basée sur le numéro de semaine depuis le 1er janvier 2024
- **Favicon** : Change automatiquement chaque semaine via route dynamique

### Logos intégrés
1. **Logo 1** : Colombe avec branche d'olivier (teal/bleu-vert) - Symbole de paix
2. **Logo 2** : Croix dorée sur colline dorée - Symbole spirituel
3. **Logo 3** : Livre ouvert avec soleil levant - Symbole de connaissance et nouveau départ

---

## 2024-11-25 - Système d'Administration avec Gestion des Rôles

### Actions effectuées
- Ajout du système de rôles dans le schéma Prisma (USER, CONTRIBUTOR, ADMIN)
- Création des helpers de vérification des permissions
- Mise à jour de l'authentification pour inclure le rôle dans la session
- Création de la page d'administration avec navigation par onglets
- API routes pour la gestion des plans (CRUD)
- API routes pour la gestion des utilisateurs et attribution de rôles
- Interfaces de gestion des plans et utilisateurs
- Protection des routes avec vérification des permissions
- Ajout du lien admin dans la navigation pour admins et contributeurs

### Fichiers créés
- `src/lib/permissions.ts` - Helpers de vérification des permissions
- `src/app/(main)/admin/page.tsx` - Page principale d'administration
- `src/components/admin/stats-overview.tsx` - Vue d'ensemble des statistiques
- `src/components/admin/plans-management.tsx` - Gestion des plans
- `src/components/admin/users-management.tsx` - Gestion des utilisateurs
- `src/app/api/admin/plans/route.ts` - API CRUD pour les plans
- `src/app/api/admin/plans/[id]/route.ts` - API pour un plan spécifique
- `src/app/api/admin/users/route.ts` - API pour la gestion des utilisateurs
- `src/app/api/admin/stats/route.ts` - API pour les statistiques admin

### Fichiers modifiés
- `prisma/schema.prisma` - Ajout du champ `role` au modèle User, enum UserRole, relation createdBy pour Plan
- `src/lib/auth.ts` - Inclusion du rôle dans la session JWT
- `src/types/next-auth.d.ts` - Extension des types pour inclure le rôle
- `src/components/layout/main-nav.tsx` - Ajout du lien admin conditionnel

### Système de rôles
- **USER** : Utilisateur standard (par défaut)
- **CONTRIBUTOR** : Peut créer et modifier ses propres plans
- **ADMIN** : Accès complet (gestion plans, utilisateurs, rôles)

### Permissions
- `isAdmin()` : Vérifie si l'utilisateur est administrateur
- `canCreatePlans()` : Vérifie si l'utilisateur peut créer des plans
- `canEditPlan(planId)` : Vérifie si l'utilisateur peut modifier un plan spécifique

### Fonctionnalités Admin
- **Vue d'ensemble** : Statistiques globales de l'application
- **Gestion des plans** : Liste, création, modification, activation/désactivation, suppression
- **Gestion des utilisateurs** : Liste, modification des rôles, statistiques par utilisateur

### Note importante
✅ **Migration Prisma effectuée** : Le schéma a été synchronisé avec `prisma db push`
✅ **Premier administrateur créé** : admin@psaumes365.com

Pour créer d'autres administrateurs ou promouvoir des utilisateurs :
```bash
docker exec psaumes365-app node scripts/create-admin.js <email> <password> [name]
```

### Intégration des plans existants
- Les 10 plans existants de `src/data/plans.ts` apparaissent maintenant dans la page d'administration
- Les plans système sont marqués comme "Plan système" et ne sont pas modifiables
- Comptage automatique des utilisateurs pour les plans système
- Les plans créés par les utilisateurs apparaissent en premier, suivis des plans système

### Affichage des plans dans l'application
- Création de l'API `/api/plans` pour récupérer tous les plans actifs (BDD + plans système)
- Création de l'API `/api/plans/[id]` pour récupérer un plan spécifique
- Mise à jour de la page `/plans` pour charger les plans depuis l'API
- Mise à jour de la page `/plans/[id]` pour charger les plans depuis l'API ou les données statiques
- Les nouveaux plans créés dans l'administration apparaissent automatiquement dans l'application
- Les plans système et les plans créés par les utilisateurs sont tous visibles dans la liste

---

