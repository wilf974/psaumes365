#!/bin/bash

# Script de backup automatique PostgreSQL pour Psaumes365
# À exécuter via cron (ex: tous les jours à 2h du matin)

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/opt/psaumes365/backups}"
DB_NAME="${DB_NAME:-psaumes365_db}"
DB_USER="${DB_USER:-psaumes365_user}"
DB_HOST="${DB_HOST:-psaumes365-db}"
DB_PORT="${DB_PORT:-5432}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# Créer le répertoire de backup s'il n'existe pas
mkdir -p "$BACKUP_DIR"

# Nom du fichier de backup
BACKUP_FILE="$BACKUP_DIR/psaumes365_backup_$(date +%Y%m%d_%H%M%S).sql.gz"

echo "💾 Début du backup de la base de données..."

# Exécuter le backup depuis le conteneur Docker
docker exec psaumes365-db pg_dump -U "$DB_USER" -d "$DB_NAME" | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup créé : $BACKUP_FILE"
    
    # Nettoyer les anciens backups (garder les 30 derniers jours)
    find "$BACKUP_DIR" -name "psaumes365_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "🧹 Anciens backups supprimés (plus de $RETENTION_DAYS jours)"
    
    # Afficher la taille du backup
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "📊 Taille du backup : $BACKUP_SIZE"
else
    echo "❌ Erreur lors du backup"
    exit 1
fi

echo "✅ Backup terminé avec succès !"

