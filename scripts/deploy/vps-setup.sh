#!/bin/bash

# Script de configuration VPS Debian pour Psaumes365
# À exécuter sur le serveur VPS

set -e

echo "🚀 Configuration du VPS pour Psaumes365..."

# Mise à jour du système
echo "📦 Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# Installation de Docker
echo "🐳 Installation de Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "✅ Docker installé"
else
    echo "✅ Docker déjà installé"
fi

# Installation de Docker Compose
echo "🐳 Installation de Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo apt install docker-compose -y
    echo "✅ Docker Compose installé"
else
    echo "✅ Docker Compose déjà installé"
fi

# Installation de Nginx
echo "🌐 Installation de Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt install nginx -y
    sudo systemctl enable nginx
    echo "✅ Nginx installé"
else
    echo "✅ Nginx déjà installé"
fi

# Installation de Certbot (Let's Encrypt)
echo "🔒 Installation de Certbot..."
if ! command -v certbot &> /dev/null; then
    sudo apt install certbot python3-certbot-nginx -y
    echo "✅ Certbot installé"
else
    echo "✅ Certbot déjà installé"
fi

# Création du répertoire pour l'application
echo "📁 Création des répertoires..."
sudo mkdir -p /opt/psaumes365
sudo chown $USER:$USER /opt/psaumes365

echo "✅ Configuration de base terminée !"
echo ""
echo "📝 Prochaines étapes :"
echo "1. Copier les fichiers du projet dans /opt/psaumes365"
echo "2. Configurer le fichier .env avec vos variables d'environnement"
echo "3. Configurer Nginx (voir scripts/deploy/nginx-config.sh)"
echo "4. Obtenir un certificat SSL : sudo certbot --nginx -d votre-domaine.com"
echo "5. Démarrer l'application : cd /opt/psaumes365 && docker-compose up -d"

