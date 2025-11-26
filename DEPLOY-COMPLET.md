# Commandes Complètes - Déploiement VPS

**Domaine :** psaumes365.woutils.com  
**Chemin :** /opt/apps/psaumes365

## Situation actuelle
Vous êtes dans `/opt/apps/psaumes365` et le projet est déjà cloné.

## Commandes à exécuter

### 1. Vérifier et nettoyer la structure
```bash
# Vous êtes déjà dans /opt/apps/psaumes365
pwd
# Doit afficher : /opt/apps/psaumes365

# Vérifier si le projet est bien là
ls -la

# Si vous êtes dans /opt/apps/psaumes365/psaumes365, remonter d'un niveau
cd /opt/apps/psaumes365
```

### 2. Récupérer le script de déploiement depuis GitHub
```bash
cd /opt/apps/psaumes365

# Mettre à jour depuis GitHub
git pull origin main

# Vérifier que le script existe
ls -la deploy-vps.sh

# Si le script n'existe pas, le créer manuellement
cat > deploy-vps.sh << 'EOF'
#!/bin/bash
# Script simplifié pour votre cas
set -e
cd /opt/apps/psaumes365
docker-compose down 2>/dev/null || true
docker-compose up -d --build
sleep 10
docker exec psaumes365-app npx prisma generate || true
docker exec psaumes365-app npx prisma db push || true
echo "✅ Application démarrée"
EOF

chmod +x deploy-vps.sh
```

### 3. Configurer le fichier .env
```bash
cd /opt/apps/psaumes365

# Créer ou modifier .env
nano .env
```

Contenu du `.env` :
```env
DATABASE_URL="postgresql://psaumes365_user:$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-25)@psaumes365-db:5432/psaumes365_db?schema=public"
NEXTAUTH_URL="https://psaumes365.woutils.com"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
BIBLE_API_KEY="Uof6_k9CYF-tc8vly8mm8"
ELEVENLABS_API_KEY="sk_a3f6403079bb53fb5f47bafb63e14fb8f204a3356eb2313b"
NODE_ENV="production"
```

**OU générer les secrets et les copier :**
```bash
# Générer le mot de passe DB
openssl rand -base64 24 | tr -d "=+/" | cut -c1-25

# Générer le secret NextAuth
openssl rand -base64 32
```

### 4. Configuration Nginx (sans www)
```bash
sudo nano /etc/nginx/sites-available/psaumes365
```

Contenu (sans www car le DNS n'est pas configuré) :
```nginx
server {
    listen 80;
    server_name psaumes365.woutils.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name psaumes365.woutils.com;

    ssl_certificate /etc/letsencrypt/live/psaumes365.woutils.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/psaumes365.woutils.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    location / {
        proxy_pass http://localhost:10000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activer :
```bash
sudo ln -sf /etc/nginx/sites-available/psaumes365 /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Obtenir le certificat SSL (sans www)
```bash
# Seulement pour psaumes365.woutils.com (sans www)
sudo certbot --nginx -d psaumes365.woutils.com --non-interactive --agree-tos --email admin@woutils.com
```

### 6. Démarrer l'application
```bash
cd /opt/apps/psaumes365

# Vérifier que docker-compose.yml existe
ls -la docker-compose.yml

# Démarrer
docker-compose down 2>/dev/null || true
docker-compose up -d --build

# Attendre que les conteneurs démarrent
sleep 15

# Vérifier les conteneurs
docker-compose ps
```

### 7. Initialiser la base de données
```bash
cd /opt/apps/psaumes365

# Générer Prisma
docker exec psaumes365-app npx prisma generate

# Appliquer le schéma
docker exec psaumes365-app npx prisma db push

# Créer un administrateur
docker exec -it psaumes365-app node scripts/create-admin.js admin@psaumes365.woutils.com VOTRE_MOT_DE_PASSE "Admin User"
```

### 8. Vérifier
```bash
# Vérifier la santé
curl https://psaumes365.woutils.com/api/health

# Voir les logs
docker-compose logs -f
```

## Si vous avez des erreurs

### Erreur : conteneur ne démarre pas
```bash
docker-compose logs psaumes365-app
docker-compose logs psaumes365-db
```

### Erreur : base de données
```bash
# Vérifier que la DB est prête
docker exec psaumes365-db pg_isready -U psaumes365_user

# Tester la connexion
docker exec -it psaumes365-db psql -U psaumes365_user -d psaumes365_db
```

### Erreur : Nginx
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

