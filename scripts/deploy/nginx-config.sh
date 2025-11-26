#!/bin/bash

# Script de configuration Nginx pour Psaumes365
# À adapter avec votre domaine

set -e

DOMAIN="${1:-psaumes365.example.com}"
APP_PORT="${2:-10000}"

echo "🌐 Configuration de Nginx pour $DOMAIN..."

# Créer la configuration Nginx
sudo tee /etc/nginx/sites-available/psaumes365 > /dev/null <<EOF
# Configuration Nginx pour Psaumes365
server {
    listen 80;
    server_name $DOMAIN;

    # Redirection vers HTTPS (sera activée après configuration SSL)
    # return 301 https://\$server_name\$request_uri;

    # Configuration temporaire HTTP (à remplacer par HTTPS)
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
        
        # Timeouts
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

    # Cache pour les images
    location /logos {
        proxy_pass http://localhost:$APP_PORT;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # Cache pour les icônes
    location /icons {
        proxy_pass http://localhost:$APP_PORT;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

# Activer le site
sudo ln -sf /etc/nginx/sites-available/psaumes365 /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx

echo "✅ Configuration Nginx créée !"
echo ""
echo "📝 Pour activer HTTPS :"
echo "sudo certbot --nginx -d $DOMAIN"
echo ""
echo "⚠️  N'oubliez pas de décommenter la redirection HTTPS dans la config après avoir obtenu le certificat SSL"

