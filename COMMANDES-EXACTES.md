# Commandes Exactes - Déploiement VPS

**Vous êtes actuellement dans :** `/opt/apps/psaumes365`  
**Domaine :** `psaumes365.woutils.com` (sans www)

## Commandes à exécuter dans l'ordre

### 1. Vérifier votre position et mettre à jour depuis GitHub
```bash
# Vous êtes déjà dans /opt/apps/psaumes365
pwd
# Doit afficher : /opt/apps/psaumes365

# Mettre à jour depuis GitHub
git pull origin main
```

### 2. Créer le fichier .env
```bash
cd /opt/apps/psaumes365

# Générer les secrets
DB_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-25)
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Créer le .env
cat > .env << EOF
DATABASE_URL="postgresql://psaumes365_user:${DB_PASSWORD}@psaumes365-db:5432/psaumes365_db?schema=public"
NEXTAUTH_URL="https://psaumes365.woutils.com"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
BIBLE_API_KEY="Uof6_k9CYF-tc8vly8mm8"
ELEVENLABS_API_KEY="sk_a3f6403079bb53fb5f47bafb63e14fb8f204a3356eb2313b"
NODE_ENV="production"
EOF

# Vérifier
cat .env
```

### 3. Configurer Nginx (sans www)
```bash
sudo tee /etc/nginx/sites-available/psaumes365 > /dev/null << 'EOF'
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
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:10000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://localhost:10000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
EOF

# Activer le site
sudo ln -sf /etc/nginx/sites-available/psaumes365 /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Tester
sudo nginx -t

# Recharger
sudo systemctl reload nginx
```

### 4. Obtenir le certificat SSL (sans www)
```bash
# Seulement pour psaumes365.woutils.com (sans www car le DNS n'est pas configuré)
sudo certbot --nginx -d psaumes365.woutils.com --non-interactive --agree-tos --email admin@woutils.com
```

### 5. Démarrer l'application Docker
```bash
cd /opt/apps/psaumes365

# Arrêter si déjà en cours
docker-compose down 2>/dev/null || true

# Démarrer
docker-compose up -d --build

# Attendre 15 secondes que les conteneurs démarrent
sleep 15

# Vérifier
docker-compose ps
```

### 6. Initialiser la base de données
```bash
cd /opt/apps/psaumes365

# Générer Prisma Client
docker exec psaumes365-app npx prisma generate

# Appliquer le schéma
docker exec psaumes365-app npx prisma db push

# Vérifier que ça a fonctionné
docker exec psaumes365-app npx prisma db push
```

### 7. Créer un administrateur
```bash
cd /opt/apps/psaumes365

# Remplacer VOTRE_MOT_DE_PASSE par un mot de passe sécurisé
docker exec -it psaumes365-app node scripts/create-admin.js admin@psaumes365.woutils.com VOTRE_MOT_DE_PASSE "Admin User"
```

### 8. Vérifier que tout fonctionne
```bash
# Vérifier la santé de l'application
curl https://psaumes365.woutils.com/api/health

# Voir les logs
docker-compose logs -f
```

## Commandes de vérification

```bash
# Vérifier les conteneurs
docker ps

# Vérifier les logs
docker-compose logs psaumes365-app
docker-compose logs psaumes365-db

# Vérifier Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log

# Tester la connexion à la base de données
docker exec -it psaumes365-db psql -U psaumes365_user -d psaumes365_db -c "SELECT version();"
```

## En cas d'erreur

### Si docker-compose ne trouve pas le fichier
```bash
cd /opt/apps/psaumes365
ls -la docker-compose.yml
# Si le fichier n'existe pas, le récupérer depuis GitHub
git pull origin main
```

### Si les conteneurs ne démarrent pas
```bash
# Voir les erreurs
docker-compose logs

# Vérifier le .env
cat .env

# Vérifier que les ports ne sont pas utilisés
sudo netstat -tulpn | grep 10000
sudo netstat -tulpn | grep 10001
```

### Si la base de données ne répond pas
```bash
# Redémarrer la base de données
docker-compose restart psaumes365-db

# Attendre 10 secondes
sleep 10

# Réessayer Prisma
docker exec psaumes365-app npx prisma db push
```

