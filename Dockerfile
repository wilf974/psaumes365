# Dockerfile pour Psaumes365 - Next.js 14 App
FROM node:20-alpine

WORKDIR /app

# Installation des dépendances système
RUN apk add --no-cache libc6-compat openssl

# Copie des fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installation des dépendances
RUN npm install

# Génération du client Prisma
RUN npx prisma generate

# Copie du reste du code source
COPY . .

# Exposition du port
EXPOSE 3000

# Commande de démarrage en mode développement
CMD ["npm", "run", "dev"]

