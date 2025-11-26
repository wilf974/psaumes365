/**
 * Script pour générer les icônes PWA
 * Génère des icônes SVG simples pour Psaumes365
 */

const fs = require('fs')
const path = require('path')

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

/**
 * Génère une icône SVG pour une taille donnée
 */
function generateIconSVG(size) {
  const fontSize = size * 0.4
  const padding = size * 0.1
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fond avec dégradé -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6A8847;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4388B5;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Rectangle de fond arrondi -->
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bgGradient)"/>
  
  <!-- Symbole livre/parchemin -->
  <g transform="translate(${size / 2}, ${size / 2})">
    <!-- Livre ouvert -->
    <path d="M ${-size * 0.25} ${-size * 0.15} L ${-size * 0.15} ${-size * 0.2} L ${-size * 0.15} ${size * 0.2} L ${-size * 0.25} ${size * 0.15} Z" 
          fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.5)" stroke-width="${size * 0.01}"/>
    <path d="M ${size * 0.15} ${-size * 0.2} L ${size * 0.25} ${-size * 0.15} L ${size * 0.25} ${size * 0.15} L ${size * 0.15} ${size * 0.2} Z" 
          fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.5)" stroke-width="${size * 0.01}"/>
    
    <!-- Lignes de texte -->
    <line x1="${-size * 0.2}" y1="${-size * 0.05}" x2="${size * 0.2}" y2="${-size * 0.05}" 
          stroke="rgba(106,136,71,0.6)" stroke-width="${size * 0.008}" stroke-linecap="round"/>
    <line x1="${-size * 0.2}" y1="0" x2="${size * 0.2}" y2="0" 
          stroke="rgba(106,136,71,0.6)" stroke-width="${size * 0.008}" stroke-linecap="round"/>
    <line x1="${-size * 0.2}" y1="${size * 0.05}" x2="${size * 0.2}" y2="${size * 0.05}" 
          stroke="rgba(106,136,71,0.6)" stroke-width="${size * 0.008}" stroke-linecap="round"/>
  </g>
</svg>`
}

/**
 * Génère toutes les icônes
 */
function generateIcons() {
  const iconsDir = path.join(__dirname, '..', 'public', 'icons')
  
  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true })
  }
  
  console.log('Génération des icônes PWA...')
  
  sizes.forEach(size => {
    const svg = generateIconSVG(size)
    const filename = `icon-${size}x${size}.svg`
    const filepath = path.join(iconsDir, filename)
    
    fs.writeFileSync(filepath, svg, 'utf8')
    console.log(`✓ ${filename} généré`)
  })
  
  console.log('\n✅ Toutes les icônes ont été générées!')
  console.log('Note: Pour une meilleure compatibilité PWA, convertissez les SVG en PNG.')
  console.log('Vous pouvez utiliser un outil en ligne comme https://cloudconvert.com/svg-to-png')
}

// Exécuter le script
generateIcons()

