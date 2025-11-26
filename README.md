# Psaumes365 - Web-App Méditation Biblique

Application chrétienne gratuite de méditation de la Parole de Dieu.

## Fonctionnalités

- **Verset du jour** : Lecture biblique quotidienne avec audio (TTS)
- **Méditation guidée** : 5 étapes (Lire - Comprendre - Méditer - Prier - Appliquer)
- **Plans thématiques** : Paix, Identité, Combat spirituel, Guérison, Foi, Famille
- **Journal spirituel** : Notez vos réflexions et inspirations
- **PWA** : Installation sur mobile avec notifications de rappel

## Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | Next.js 14 (App Router) |
| Styling | TailwindCSS + shadcn/ui |
| State | Zustand |
| Animations | Framer Motion |
| Base de données | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js |
| Bible API | api.bible |
| Conteneurisation | Docker |

## Prérequis

- Docker & Docker Compose
- Node.js 20+ (pour le développement local sans Docker)

## Installation

### Avec Docker (recommandé)

```bash
# Cloner le projet
git clone <repository-url>
cd psaumes365

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec votre clé API Bible (optionnel)
# Obtenir une clé sur https://scripture.api.bible/

# Lancer les conteneurs
docker-compose up -d

# L'application est accessible sur http://localhost:10000
```

### Sans Docker

```bash
# Installer les dépendances
npm install

# Configurer la base de données PostgreSQL
# Éditer DATABASE_URL dans .env

# Générer le client Prisma
npx prisma generate

# Appliquer le schéma
npx prisma db push

# Lancer en développement
npm run dev
```

## Configuration

### Variables d'environnement

```env
DATABASE_URL="postgresql://user:password@localhost:5432/psaumes365_db"
NEXTAUTH_URL="http://localhost:10000"
NEXTAUTH_SECRET="votre-secret-securise"
BIBLE_API_KEY="votre-cle-api-bible"
```

## Structure du Projet

```
psaumes365/
├── docker-compose.yml
├── Dockerfile
├── prisma/
│   └── schema.prisma
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── icons/
│   └── audio/
├── src/
│   ├── app/
│   │   ├── (auth)/         # Pages login/register
│   │   ├── (main)/         # Pages authentifiées
│   │   └── api/            # Routes API
│   ├── components/
│   │   ├── ui/             # Composants shadcn
│   │   ├── bible/          # Composants bibliques
│   │   └── layout/         # Navigation
│   ├── lib/                # Utilitaires
│   └── stores/             # État Zustand
└── historique.md           # Journal des modifications
```

## Ports

- `10000` : Application Next.js
- `10001` : PostgreSQL

## Commandes utiles

```bash
# Logs Docker
docker-compose logs -f psaumes365-app

# Shell dans le conteneur
docker exec -it psaumes365-app sh

# Prisma Studio (visualiser la BDD)
docker exec -it psaumes365-app npx prisma studio

# Migrations Prisma
docker exec -it psaumes365-app npx prisma migrate dev

# Créer un administrateur
docker exec -it psaumes365-app node scripts/create-admin.js <email> <password> [name]
```

## Administration

### Système de rôles

L'application utilise un système de rôles à 3 niveaux :

- **USER** : Utilisateur standard (par défaut)
- **CONTRIBUTOR** : Peut créer et modifier ses propres plans de méditation
- **ADMIN** : Accès complet à l'administration (plans, utilisateurs, statistiques)

### Créer un administrateur

Après la première migration de la base de données, créez votre premier administrateur :

```bash
# Dans Docker
docker exec -it psaumes365-app node scripts/create-admin.js admin@example.com motdepasse123 "Nom Admin"

# Ou localement
npm run admin:create admin@example.com motdepasse123 "Nom Admin"
```

### Accès à l'administration

Une fois connecté avec un compte admin ou contributeur, le lien "Admin" apparaît dans la navigation.

**Fonctionnalités admin :**
- Vue d'ensemble des statistiques
- Gestion des plans (création, modification, activation/désactivation, suppression)
- Gestion des utilisateurs et attribution de rôles (admin uniquement)

**Fonctionnalités contributeur :**
- Vue d'ensemble de ses propres statistiques
- Gestion de ses propres plans (création, modification, activation/désactivation)

## Licence

Gratuit et open-source. Pour la gloire de Dieu.

---

*« Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »* — Psaume 119:105

