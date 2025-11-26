# TODO - Psaumes365

## MVP Complété ✅

- [x] Infrastructure Docker (Next.js 14 + PostgreSQL)
- [x] Configuration Prisma + schéma base de données
- [x] Authentification NextAuth.js (credentials)
- [x] UI de base : layout, thème calme, shadcn/ui
- [x] Intégration API api.bible + composant verset du jour
- [x] Module méditation guidée (5 étapes + TTS)
- [x] Plans thématiques 7/14/30 jours avec progression
- [x] Journal spirituel (CRUD + lien versets)
- [x] Configuration PWA + notifications rappel
- [x] Renommage du projet : Meditatio → Psaumes365

---

## En cours 🔄

### Priorité haute
- [x] Obtenir clé API api.bible (https://scripture.api.bible/) ✅
- [x] Générer les icônes PWA ✅
- [ ] Tester le flux complet (inscription → méditation → journal)
- [x] Utiliser le verset du jour réel dans la méditation guidée ✅
- [x] Sauvegarder les sessions de méditation complétées ✅

### Récemment complété ✅
- [x] Page statistiques avec streak, temps, sessions
- [x] Page favoris pour les versets sauvegardés
- [x] Bouton favori sur les versets
- [x] Configuration clé API api.bible
- [x] 10 plans de méditation complets (7 jours chacun, 70 jours total)
- [x] Prières terminées par "au nom de Jésus, Amen"
- [x] Cache audio en base de données (économie crédits ElevenLabs)
- [x] Audio ElevenLabs sur le verset du jour
- [x] Mode sombre avec toggle
- [x] Page paramètres utilisateur
- [x] Fichier de données centralisé pour les plans
- [x] Génération des icônes PWA (8 tailles SVG)
- [x] Transitions de page avec Framer Motion
- [x] Écran de chargement personnalisé
- [x] Menu hamburger responsive pour mobile
- [x] Design responsive complet (mobile, tablette, desktop)
- [x] Composant AmbientPlayer pour musique de fond
- [x] Micro-interactions et animations améliorées
- [x] Système d'onboarding pour les nouveaux utilisateurs
- [x] Partage de versets sur les réseaux sociaux (Facebook, Twitter, WhatsApp)
- [x] Recherche de versets par texte ou référence
- [x] Affichage du passage biblique dans la méditation guidée
- [x] Affichage des vraies informations du plan en cours sur l'accueil
- [x] SEO avancé (sitemap.xml, robots.txt, métadonnées)
- [x] Optimisation des performances (lazy loading, code splitting)

---

## Phase 2 - Améliorations

### Configuration
- [x] Générer les icônes PWA (72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512) ✅
- [x] Créer un favicon personnalisé (SVG) ✅
- [x] Convertir les icônes SVG en PNG pour meilleure compatibilité PWA ✅

### Contenu
- [x] Ajouter plus de plans de méditation (minimum 10 plans) ✅
- [x] Enrichir les données de chaque jour de plan ✅
- [x] Ajouter des fichiers audio pré-enregistrés pour les méditations ✅
- [x] Créer une banque de versets commentés ✅

### Fonctionnalités
- [x] Statistiques de méditation (streak, temps total, jours actifs) ✅
- [x] Système d'administration avec gestion des rôles ✅
- [x] Gestion des plans (CRUD) pour admins et contributeurs ✅
- [x] Gestion des utilisateurs et attribution de rôles (admin) ✅
- [x] Partage de versets sur les réseaux sociaux ✅
- [x] Affichage du passage biblique dans la méditation guidée ✅
- [x] Affichage des vraies informations du plan en cours ✅
- [x] Mode hors-ligne avancé (cache des plans en cours) ✅
- [x] Historique des méditations complétées ✅
- [x] Favoris / marque-pages pour les versets ✅
- [x] Recherche de versets ✅

### UI/UX
- [x] Mode sombre complet ✅
- [x] Animations de transition entre pages ✅
- [x] Écran de chargement personnalisé ✅
- [x] Paramètres utilisateur (heure de rappel, thème) ✅
- [x] Design responsive complet (mobile, tablette, desktop) ✅
- [x] Menu hamburger pour navigation mobile ✅
- [x] Micro-interactions et animations Framer Motion ✅
- [x] Onboarding pour les nouveaux utilisateurs ✅
- [x] Améliorer les animations de chargement ✅
- [x] Ajouter des skeletons loaders ✅

### Technique
- [x] Script de génération d'icônes PWA ✅
- [x] Composants réutilisables (FadeIn, PageTransition, LoadingScreen) ✅
- [x] Architecture responsive avec breakpoints Tailwind ✅
- [x] Tests unitaires (Jest/Vitest) ✅
- [x] Tests E2E (Playwright) ✅
- [x] Optimisation des images ✅
- [x] SEO avancé (sitemap, robots.txt) ✅
- [x] Analytics (respect vie privée) ✅
- [x] Optimisation des performances (lazy loading, code splitting) ✅

---

## Phase 3 - Production

### Déploiement VPS
- [x] Scripts de configuration VPS ✅
- [x] Configuration Nginx reverse proxy ✅
- [x] Script de backup automatique PostgreSQL ✅
- [x] CI/CD (GitHub Actions) ✅
- [ ] Configurer le VPS Debian (manuel)
- [ ] Installer Docker sur le VPS (manuel)
- [ ] SSL avec Let's Encrypt (manuel)

### Sécurité
- [x] Rate limiting sur les API ✅
- [x] Validation des entrées renforcée ✅
- [x] Headers de sécurité (CSP, HSTS) ✅
- [ ] Audit de sécurité

### Performance
- [ ] Mise en cache Redis (optionnel)
- [x] Optimisation des requêtes Prisma ✅
- [x] Lazy loading des composants ✅
- [x] Compression des assets ✅

---

## Idées futures

- [ ] Application mobile native (React Native)
- [ ] Communauté / groupes de prière
- [ ] Méditations audio par des pasteurs
- [ ] Intégration calendrier (rappels)
- [ ] Widget pour l'écran d'accueil mobile
- [ ] Multi-langues (EN, ES, PT)
- [ ] Différentes traductions de la Bible
- [ ] Lecteur audio avec fichiers mp3 pré-enregistrés
- [ ] Système de badges/récompenses spirituelles
- [ ] Export PDF du journal

---

## Notes techniques

### Ports utilisés
- `10000` : Application Next.js (psaumes365-app)
- `10001` : PostgreSQL (psaumes365-db)

### Commandes utiles
```bash
# Démarrer le projet
docker-compose up -d --build

# Voir les logs
docker logs psaumes365-app -f

# Prisma Studio (visualiser la BDD)
docker exec -it psaumes365-app npx prisma studio

# Migrations
docker exec -it psaumes365-app npx prisma migrate dev

# Créer un administrateur
docker exec -it psaumes365-app node scripts/create-admin.js <email> <password> [name]
```

### Système d'administration
- **Rôles** : USER (par défaut), CONTRIBUTOR (peut créer des plans), ADMIN (accès complet)
- **Page admin** : `/admin` (accessible aux admins et contributeurs)
- **Création admin** : Utiliser le script `scripts/create-admin.js`

### API Bible
- URL : https://scripture.api.bible/
- Version utilisée : Louis Segond (LSG)
- ID Bible : `61fd76eafa1577c2-01`

---

---

## Réalisations récentes (Novembre 2024)

### ✅ Responsive Design Complet
- Menu hamburger avec animation slide-in pour mobile
- Toutes les pages optimisées pour mobile, tablette et desktop
- Breakpoints Tailwind cohérents (sm: 640px, md: 768px, lg: 1024px)
- Composants audio et lecteurs adaptés au tactile

### ✅ Améliorations UI/UX
- Transitions de page fluides avec Framer Motion
- Écran de chargement personnalisé avec animations
- Composant FadeIn réutilisable pour animations d'apparition
- Micro-interactions améliorées sur tous les éléments interactifs

### ✅ Icônes PWA
- Script de génération automatique (`scripts/generate-icons.js`)
- 8 icônes SVG générées (72x72 à 512x512)
- Design cohérent avec le thème de l'application (livre ouvert, dégradé vert/bleu)
- Manifest.json mis à jour

### ✅ Composants Audio
- AmbientPlayer pour musique de fond chrétienne
- Support de 4 pistes d'ambiance (paix, adoration, méditation, nature)
- Contrôle de volume intégré
- Mode compact pour mobile

### ✅ Système d'Administration
- Système de rôles (USER, CONTRIBUTOR, ADMIN)
- Page d'administration avec onglets (Vue d'ensemble, Plans, Utilisateurs)
- API routes pour gestion des plans (CRUD)
- API routes pour gestion des utilisateurs et rôles
- Protection des routes admin avec vérification des permissions
- Interface de gestion des plans pour contributeurs et admins
- Interface de gestion des utilisateurs pour admins uniquement
- Lien admin dans la navigation (visible pour admins et contributeurs)

---

---

## Réalisations récentes (Décembre 2024)

### ✅ Skeletons Loaders
- Composant Skeleton réutilisable basé sur shadcn/ui
- Intégration sur toutes les pages principales (accueil, plans, favoris, statistiques)
- Amélioration de la perception de performance
- Design cohérent avec animations pulse

### ✅ Recherche de versets
- Recherche textuelle dans le contenu des versets
- Recherche par référence biblique (ex: "Jean 3:16", "Psaume 23:1-6")
- Page de recherche dédiée avec interface complète
- Debounce de 500ms pour optimiser les requêtes
- Support de jusqu'à 30 résultats par recherche
- Lien "Recherche" ajouté dans la navigation principale

### ✅ Partage de versets
- Composant ShareButton réutilisable avec menu déroulant
- Support du Web Share API natif (mobile iOS/Android)
- Partage sur Facebook, Twitter/X, WhatsApp
- Copie dans le presse-papiers avec feedback visuel
- Intégration dans tous les composants de versets
- Format de texte cohérent pour tous les partages

### ✅ Corrections Responsive
- Correction des problèmes d'affichage sur iPhone 16 Pro
- Menu hamburger fonctionnel avec z-index optimisés
- Amélioration des espacements et tailles de police
- Configuration réseau pour accès depuis mobile (0.0.0.0)

---

## Réalisations récentes (Décembre 2024 - Suite)

### ✅ Système d'onboarding
- Modal interactif avec 5 étapes de présentation
- Guide des fonctionnalités principales (verset du jour, plans, recherche, partage, musique)
- Indicateur de progression visuel
- Sauvegarde de l'état d'onboarding en base de données
- Affichage automatique pour les nouveaux utilisateurs

### ✅ Améliorations méditation
- Affichage du passage biblique pendant l'étape "Lire"
- Intégration de l'audio ElevenLabs pour le passage
- Design cohérent avec le reste de l'application

### ✅ Plan en cours sur l'accueil
- API route pour récupérer le plan en cours de l'utilisateur
- Affichage dynamique avec vraies données (titre, progression, jour actuel)
- Support des plans système et des plans créés par les admins
- Calcul automatique du pourcentage de progression

### ✅ SEO avancé
- Sitemap.xml dynamique avec toutes les pages
- Robots.txt configuré pour guider les moteurs de recherche
- Métadonnées OpenGraph complètes pour le partage social
- Twitter Cards pour un meilleur rendu sur Twitter/X
- Configuration robots pour optimiser l'indexation

### ✅ Optimisation des performances
- Lazy loading des composants lourds (OnboardingModal, composants admin, AmbientPlayer)
- Code splitting avec dynamic imports de Next.js
- Compression activée dans Next.js
- Optimisation des imports de packages (lucide-react, framer-motion)
- Support des formats d'images modernes (AVIF, WebP)

---

*Dernière mise à jour : 26 décembre 2024*

