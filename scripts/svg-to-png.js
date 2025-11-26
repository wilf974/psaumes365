/**
 * Script pour convertir les icônes SVG en PNG
 * Utilise sharp pour la conversion (meilleure compatibilité PWA)
 */

const fs = require('fs')
const path = require('path')

// Vérifier si sharp est disponible
let sharp
try {
  sharp = require('sharp')
} catch (error) {
  console.error('❌ Le package "sharp" n\'est pas installé.')
  console.log('\n📦 Installation requise:')
  console.log('   npm install --save-dev sharp')
  console.log('\nOu utilisez un outil en ligne pour convertir les SVG en PNG:')
  console.log('   https://cloudconvert.com/svg-to-png')
  process.exit(1)
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const iconsDir = path.join(__dirname, '..', 'public', 'icons')

/**
 * Convertit un fichier SVG en PNG
 */
async function convertSVGToPNG(size) {
  const svgFilename = `icon-${size}x${size}.svg`
  const pngFilename = `icon-${size}x${size}.png`
  const svgPath = path.join(iconsDir, svgFilename)
  const pngPath = path.join(iconsDir, pngFilename)

  // Vérifier que le SVG existe
  if (!fs.existsSync(svgPath)) {
    console.warn(`⚠️  ${svgFilename} n'existe pas, ignoré`)
    return false
  }

  try {
    // Lire le SVG
    const svgBuffer = fs.readFileSync(svgPath)

    // Convertir en PNG avec sharp
    await sharp(svgBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(pngPath)

    console.log(`✓ ${pngFilename} généré`)
    return true
  } catch (error) {
    console.error(`❌ Erreur conversion ${svgFilename}:`, error.message)
    return false
  }
}

/**
 * Convertit toutes les icônes SVG en PNG
 */
async function convertAllIcons() {
  console.log('🔄 Conversion des icônes SVG en PNG...\n')

  if (!fs.existsSync(iconsDir)) {
    console.error(`❌ Le dossier ${iconsDir} n'existe pas`)
    console.log('   Exécutez d\'abord: node scripts/generate-icons.js')
    process.exit(1)
  }

  let successCount = 0
  let failCount = 0

  for (const size of sizes) {
    const success = await convertSVGToPNG(size)
    if (success) {
      successCount++
    } else {
      failCount++
    }
  }

  console.log(`\n✅ Conversion terminée: ${successCount} réussies, ${failCount} échouées`)
  
  if (successCount > 0) {
    console.log('\n📝 N\'oubliez pas de mettre à jour manifest.json pour utiliser les PNG')
  }
}

// Exécuter le script
convertAllIcons().catch((error) => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})

