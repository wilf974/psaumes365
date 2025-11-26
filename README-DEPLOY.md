# Guide de Déploiement - Psaumes365

Ce guide explique comment déployer Psaumes365 sur un VPS Debian.

## Prérequis

- VPS Debian 11+ avec accès root/sudo
- Nom de domaine pointant vers l'IP du VPS
- Accès SSH au serveur

## Étape 1 : Configuration du VPS

Exécutez le script de configuration sur le VPS :

```bash
# Sur le VPS
chmod +x scripts/deploy/vps-setup.sh
./scripts/deploy/vps-setup.sh
```

Ce script installe :
- Docker et Docker Compose
- Nginx
- Certbot (Let's Encrypt)

## Étape 2 : Déploiement de l'application

1. **Cloner le projet sur le VPS** :
```bash
cd /opt
git clone <votre-repo> psaumes365
cd psaumes365
```

2. **Configurer les variables d'environnement** :
```bash
cp .env.example .env
nano .env
```

Remplir les variables :
- `DATABASE_URL` - URL de connexion PostgreSQL
- `NEXTAUTH_URL` - URL de votre domaine (https://votre-domaine.com)
- `NEXTAUTH_SECRET` - Secret aléatoire (générer avec `openssl rand -base64 32`)
- `BIBLE_API_KEY` - Clé API api.bible
- `ELEVENLABS_API_KEY` - Clé API ElevenLabs

3. **Construire et démarrer les conteneurs** :
```bash
docker-compose up -d --build
```

4. **Initialiser la base de données** :
```bash
docker exec psaumes365-app npx prisma generate
docker exec psaumes365-app npx prisma db push
```

5. **Créer un administrateur** :
```bash
docker exec -it psaumes365-app node scripts/create-admin.js admin@example.com password123 "Admin User"
```

## Étape 3 : Configuration Nginx

1. **Configurer Nginx** :
```bash
chmod +x scripts/deploy/nginx-config.sh
./scripts/deploy/nginx-config.sh votre-domaine.com 10000
```

2. **Obtenir un certificat SSL** :
```bash
sudo certbot --nginx -d votre-domaine.com
```

Certbot configurera automatiquement HTTPS et redirigera HTTP vers HTTPS.

## Étape 4 : Backup automatique

Configurer le backup automatique via cron :

```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne (backup tous les jours à 2h du matin)
0 2 * * * /opt/psaumes365/scripts/deploy/backup-db.sh >> /var/log/psaumes365-backup.log 2>&1
```

## Étape 5 : CI/CD (Optionnel)

Pour activer le déploiement automatique via GitHub Actions :

1. **Ajouter les secrets GitHub** :
   - `VPS_SSH_KEY` : Clé privée SSH pour accéder au VPS
   - `VPS_USER` : Utilisateur SSH (ex: `root` ou `deploy`)
   - `VPS_HOST` : IP ou domaine du VPS
   - `VPS_DOMAIN` : Domaine de l'application

2. **Le workflow se déclenchera automatiquement** lors d'un push sur `main`

## Maintenance

### Voir les logs
```bash
docker logs psaumes365-app -f
docker logs psaumes365-db -f
```

### Redémarrer l'application
```bash
cd /opt/psaumes365
docker-compose restart
```

### Mettre à jour l'application
```bash
cd /opt/psaumes365
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker exec psaumes365-app npx prisma migrate deploy
```

### Restaurer un backup
```bash
gunzip < /opt/psaumes365/backups/psaumes365_backup_YYYYMMDD_HHMMSS.sql.gz | docker exec -i psaumes365-db psql -U psaumes365_user -d psaumes365_db
```

## Sécurité

- ✅ Rate limiting activé sur toutes les API
- ✅ Headers de sécurité configurés (CSP, HSTS)
- ✅ Validation renforcée des entrées
- ✅ SSL/TLS avec Let's Encrypt
- ✅ Backups automatiques quotidiens

## Support

En cas de problème, vérifier :
1. Les logs Docker : `docker logs psaumes365-app`
2. Les logs Nginx : `sudo tail -f /var/log/nginx/error.log`
3. L'état des conteneurs : `docker ps`
4. La santé de l'application : `curl https://votre-domaine.com/api/health`

