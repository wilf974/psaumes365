#!/bin/bash

# Script de déploiement automatique pour Psaumes365
# Domaine : psaumes365.woutils.com
# Chemin : /opt/apps/psaumes365

set -e

DOMAIN="psaumes365.woutils.com"
APP_PATH="/opt/apps/psaumes365"
APP_PORT="10000"

echo "🚀 Déploiement de Psaumes365 sur $DOMAIN"
echo "=========================================="

# Vérifier si on est root ou sudo
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Ce script nécessite les privilèges sudo"
    exit 1
fi

# 1. Installation des dépendances
echo ""
echo "📦 Installation des dépendances..."
apt update && apt upgrade -y
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi
apt install -y docker-compose nginx certbot python3-certbot-nginx git

# 2. Créer le répertoire et cloner
echo ""
echo "📁 Clonage du projet..."
mkdir -p /opt/apps
if [ ! -d "$APP_PATH" ]; then
    cd /opt/apps
    git clone https://github.com/wilf974/psaumes365.git
    chown -R $SUDO_USER:$SUDO_USER "$APP_PATH"
else
    echo "⚠️  Le répertoire existe déjà. Mise à jour..."
    cd "$APP_PATH"
    git pull
fi

# 3. Configuration .env
echo ""
echo "⚙️  Configuration de l'environnement..."
if [ ! -f "$APP_PATH/.env" ]; then
    cat > "$APP_PATH/.env" << EOF
# Base de données
DATABASE_URL="postgresql://psaumes365_user:$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-25)@psaumes365-db:5432/psaumes365_db?schema=public"

# NextAuth
NEXTAUTH_URL="https://$DOMAIN"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# API Keys
BIBLE_API_KEY="Uof6_k9CYF-tc8vly8mm8"
ELEVENLABS_API_KEY="sk_a3f6403079bb53fb5f47bafb63e14fb8f204a3356eb2313b"

# Node
NODE_ENV="production"
EOF
    echo "✅ Fichier .env créé. Veuillez le vérifier et ajuster si nécessaire."
    echo "   Fichier : $APP_PATH/.env"
else
    echo "✅ Fichier .env existe déjà"
fi

# 4. Configuration Nginx
echo ""
echo "🌐 Configuration de Nginx..."
cat > /etc/nginx/sites-available/psaumes365 << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # Certificats SSL (seront générés par Certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
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
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache pour les assets statiques
    location /_next/static {
        proxy_pass http://localhost:$APP_PORT;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
EOF

# Activer le site
ln -sf /etc/nginx/sites-available/psaumes365 /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Tester la configuration
nginx -t

# 5. Obtenir le certificat SSL
echo ""
echo "🔒 Configuration du certificat SSL..."
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@woutils.com || {
        echo "⚠️  Échec de l'obtention du certificat SSL. Vérifiez que le DNS pointe vers ce serveur."
        echo "   Vous pouvez réessayer plus tard avec : certbot --nginx -d $DOMAIN"
    }
else
    echo "✅ Certificat SSL existe déjà"
    certbot renew --quiet
fi

# 6. Démarrer l'application
echo ""
echo "🐳 Démarrage de l'application Docker..."
cd "$APP_PATH"
docker-compose down 2>/dev/null || true
docker-compose up -d --build

# Attendre que les conteneurs soient prêts
echo "⏳ Attente du démarrage des conteneurs..."
sleep 10

# 7. Initialiser la base de données
echo ""
echo "🗄️  Initialisation de la base de données..."
docker exec psaumes365-app npx prisma generate || echo "⚠️  Erreur Prisma generate"
docker exec psaumes365-app npx prisma db push || echo "⚠️  Erreur Prisma db push"

# 8. Créer un administrateur
echo ""
echo "👤 Création d'un administrateur..."
echo "   Exécutez manuellement :"
echo "   docker exec -it psaumes365-app node scripts/create-admin.js admin@$DOMAIN VOTRE_MDP \"Admin User\""

# 9. Redémarrer Nginx
echo ""
echo "🔄 Redémarrage de Nginx..."
systemctl reload nginx

# 10. Vérification
echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "📋 Vérifications :"
echo "   - Application : https://$DOMAIN"
echo "   - Health check : https://$DOMAIN/api/health"
echo "   - Logs : docker-compose logs -f (dans $APP_PATH)"
echo ""
echo "🔧 Commandes utiles :"
echo "   cd $APP_PATH"
echo "   docker-compose logs -f"
echo "   docker-compose restart"
echo "   docker-compose ps"

