# Commandes Rapides - Déploiement VPS

**Domaine :** psaumes365.woutils.com  
**Chemin :** /opt/apps/psaumes365

## Commandes essentielles pour déployer Psaumes365 sur votre VPS

### 1. Connexion au VPS
```bash
ssh root@VOTRE_IP_VPS
```

### 2. Installation des dépendances
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo apt install docker-compose nginx certbot python3-certbot-nginx git -y
```

### 3. Cloner le projet
```bash
sudo mkdir -p /opt/apps
cd /opt/apps
sudo git clone https://github.com/wilf974/psaumes365.git
cd psaumes365
sudo chown -R $USER:$USER /opt/apps/psaumes365
```

**OU utiliser le script automatique :**
```bash
# Télécharger et exécuter le script de déploiement
cd /opt/apps/psaumes365
chmod +x deploy-vps.sh
sudo ./deploy-vps.sh
```

### 4. Configuration .env
```bash
cd /opt/apps/psaumes365
nano .env
```

Contenu minimal du `.env` :
```env
DATABASE_URL="postgresql://psaumes365_user:VOTRE_MDP@psaumes365-db:5432/psaumes365_db?schema=public"
NEXTAUTH_URL="https://psaumes365.woutils.com"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
BIBLE_API_KEY="Uof6_k9CYF-tc8vly8mm8"
ELEVENLABS_API_KEY="sk_a3f6403079bb53fb5f47bafb63e14fb8f204a3356eb2313b"
NODE_ENV="production"
```

### 5. Configuration Nginx
```bash
sudo nano /etc/nginx/sites-available/psaumes365
```

Coller cette configuration :
```nginx
server {
    listen 80;
    server_name psaumes365.woutils.com www.psaumes365.woutils.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name psaumes365.woutils.com www.psaumes365.woutils.com;

    ssl_certificate /etc/letsencrypt/live/psaumes365.woutils.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/psaumes365.woutils.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

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
    }
}
```

Activer :
```bash
sudo ln -sf /etc/nginx/sites-available/psaumes365 /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
```

### 6. Obtenir le certificat SSL
```bash
sudo certbot --nginx -d psaumes365.woutils.com -d www.psaumes365.woutils.com
```

### 7. Démarrer l'application
```bash
cd /opt/apps/psaumes365
docker-compose up -d --build
```

### 8. Initialiser la base de données
```bash
docker exec psaumes365-app npx prisma generate
docker exec psaumes365-app npx prisma db push
docker exec -it psaumes365-app node scripts/create-admin.js admin@psaumes365.woutils.com VOTRE_MDP "Admin"
```

### 9. Vérifier
```bash
curl https://psaumes365.woutils.com/api/health
docker-compose ps
docker-compose logs -f
```

## Commandes de maintenance

### Mettre à jour
```bash
cd /opt/apps/psaumes365
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker exec psaumes365-app npx prisma migrate deploy
```

### Redémarrer
```bash
cd /opt/apps/psaumes365
docker-compose restart
```

### Logs
```bash
docker-compose logs -f psaumes365-app
docker-compose logs -f psaumes365-db
```

### Backup
```bash
docker exec psaumes365-db pg_dump -U psaumes365_user psaumes365_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

