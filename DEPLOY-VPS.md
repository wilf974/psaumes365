# Guide de Déploiement VPS - Psaumes365

**Domaine :** psaumes365.woutils.com  
**Chemin :** /opt/apps/psaumes365

Ce guide vous permet de déployer Psaumes365 sur votre VPS Debian avec HTTPS.

## Prérequis

- VPS Debian 11+ avec accès root/sudo
- Domaine `psaumes365.woutils.com` pointant vers l'IP du VPS
- Accès SSH au serveur

## Étape 1 : Connexion au VPS

```bash
ssh root@VOTRE_IP_VPS
# ou
ssh utilisateur@VOTRE_IP_VPS
```

**OU utiliser le script automatique :**
```bash
# Après connexion au VPS
cd /opt/apps/psaumes365
chmod +x deploy-vps.sh
sudo ./deploy-vps.sh
```

## Étape 2 : Installation des dépendances

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Installation de Docker Compose
sudo apt install docker-compose -y

# Installation de Nginx
sudo apt install nginx -y

# Installation de Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx -y

# Installation de Git
sudo apt install git -y
```

## Étape 3 : Cloner le projet

```bash
# Créer le répertoire
sudo mkdir -p /opt/apps
cd /opt/apps

# Cloner le dépôt
sudo git clone https://github.com/wilf974/psaumes365.git
cd psaumes365

# Donner les permissions
sudo chown -R $USER:$USER /opt/apps/psaumes365
```

## Étape 4 : Configuration de l'environnement

```bash
cd /opt/apps/psaumes365

# Créer le fichier .env
nano .env
```

Ajoutez le contenu suivant (remplacez les valeurs) :

```env
# Base de données
DATABASE_URL="postgresql://psaumes365_user:VOTRE_MOT_DE_PASSE_SECURISE@psaumes365-db:5432/psaumes365_db?schema=public"

# NextAuth
NEXTAUTH_URL="https://psaumes365.woutils.com"
NEXTAUTH_SECRET="GENERER_AVEC_openssl_rand_-base64_32"

# API Keys
BIBLE_API_KEY="Uof6_k9CYF-tc8vly8mm8"
ELEVENLABS_API_KEY="sk_a3f6403079bb53fb5f47bafb63e14fb8f204a3356eb2313b"

# Node
NODE_ENV="production"
```

Générer le secret NextAuth :
```bash
openssl rand -base64 32
```

## Étape 5 : Configuration Nginx

```bash
# Créer la configuration Nginx
sudo nano /etc/nginx/sites-available/psaumes365
```

Ajoutez cette configuration :

```nginx
server {
    listen 80;
    server_name psaumes365.woutils.com www.psaumes365.woutils.com;

    # Redirection vers HTTPS (sera activée après configuration SSL)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    # Certificats SSL (seront générés par Certbot)
    ssl_certificate /etc/letsencrypt/live/psaumes365.woutils.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/psaumes365.woutils.com/privkey.pem;
    
    # Configuration SSL recommandée
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Headers de sécurité
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy vers l'application Docker
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache pour les assets statiques
    location /_next/static {
        proxy_pass http://localhost:10000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Cache pour les images
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        proxy_pass http://localhost:10000;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

Activer le site :
```bash
sudo ln -sf /etc/nginx/sites-available/psaumes365 /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t
```

## Étape 6 : Obtenir le certificat SSL

```bash
# Obtenir le certificat Let's Encrypt
sudo certbot --nginx -d psaumes365.woutils.com -d www.psaumes365.woutils.com

# Suivre les instructions interactives
# Certbot configurera automatiquement HTTPS dans Nginx
```

## Étape 7 : Démarrer l'application

```bash
cd /opt/apps/psaumes365

# Construire et démarrer les conteneurs
docker-compose up -d --build

# Vérifier que les conteneurs sont en cours d'exécution
docker-compose ps

# Voir les logs
docker-compose logs -f
```

## Étape 8 : Initialiser la base de données

```bash
# Générer le client Prisma
docker exec psaumes365-app npx prisma generate

# Appliquer le schéma à la base de données
docker exec psaumes365-app npx prisma db push

# Créer un administrateur
docker exec -it psaumes365-app node scripts/create-admin.js admin@psaumes365.woutils.com VOTRE_MOT_DE_PASSE "Admin User"
```

## Étape 9 : Vérifier le déploiement

```bash
# Vérifier la santé de l'application
curl https://psaumes365.woutils.com/api/health
```

# Vérifier les logs
docker-compose logs psaumes365-app
docker-compose logs psaumes365-db
```

## Étape 10 : Configuration du renouvellement automatique SSL

Certbot configure automatiquement le renouvellement, mais vous pouvez le tester :

```bash
# Tester le renouvellement
sudo certbot renew --dry-run
```

## Commandes utiles

### Redémarrer l'application
```bash
cd /opt/apps/psaumes365
docker-compose restart
```

### Mettre à jour l'application
```bash
cd /opt/apps/psaumes365
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker exec psaumes365-app npx prisma generate
docker exec psaumes365-app npx prisma migrate deploy
```

### Voir les logs
```bash
# Logs de l'application
docker-compose logs -f psaumes365-app

# Logs de la base de données
docker-compose logs -f psaumes365-db

# Logs Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Arrêter l'application
```bash
cd /opt/apps/psaumes365
docker-compose down
```

### Backup de la base de données
```bash
# Backup manuel
docker exec psaumes365-db pg_dump -U psaumes365_user psaumes365_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurer un backup
cat backup_YYYYMMDD_HHMMSS.sql | docker exec -i psaumes365-db psql -U psaumes365_user -d psaumes365_db
```

### Configuration du backup automatique (cron)
```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne (backup tous les jours à 2h du matin)
0 2 * * * cd /opt/apps/psaumes365 && docker exec psaumes365-db pg_dump -U psaumes365_user psaumes365_db > /opt/apps/psaumes365/backups/backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql && find /opt/apps/psaumes365/backups -name "backup_*.sql" -mtime +30 -delete
```

## Dépannage

### L'application ne démarre pas
```bash
# Vérifier les logs
docker-compose logs

# Vérifier les conteneurs
docker ps -a

# Vérifier les ports
sudo netstat -tulpn | grep 10000
```

### Problème de connexion à la base de données
```bash
# Vérifier que le conteneur DB est en cours d'exécution
docker ps | grep psaumes365-db

# Vérifier les logs de la DB
docker-compose logs psaumes365-db

# Tester la connexion
docker exec -it psaumes365-db psql -U psaumes365_user -d psaumes365_db
```

### Problème avec Nginx
```bash
# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx

# Vérifier le statut
sudo systemctl status nginx
```

### Problème avec SSL
```bash
# Vérifier les certificats
sudo certbot certificates

# Renouveler manuellement
sudo certbot renew
```

## Sécurité

- ✅ Firewall configuré (UFW recommandé)
- ✅ SSL/TLS avec Let's Encrypt
- ✅ Headers de sécurité dans Nginx
- ✅ Rate limiting activé dans l'application
- ✅ Validation des entrées renforcée
- ✅ Backups automatiques configurés

## Support

En cas de problème, vérifier :
1. Les logs Docker : `docker-compose logs`
2. Les logs Nginx : `sudo tail -f /var/log/nginx/error.log`
3. L'état des conteneurs : `docker ps`
4. La santé de l'application : `curl https://votre-domaine.com/api/health`

