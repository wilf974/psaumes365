/**
 * Script pour créer un administrateur
 * Usage: node scripts/create-admin.js <email> <password> [name]
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  const email = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4] || null

  if (!email || !password) {
    console.error('Usage: node scripts/create-admin.js <email> <password> [name]')
    process.exit(1)
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // Mettre à jour le rôle si l'utilisateur existe
      const updated = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
      })
      console.log(`✅ Utilisateur ${email} promu administrateur`)
      console.log(`   Nom: ${updated.name || 'N/A'}`)
      console.log(`   Rôle: ${updated.role}`)
    } else {
      // Créer un nouvel administrateur
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'ADMIN',
        },
      })
      console.log(`✅ Administrateur créé avec succès`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Nom: ${user.name || 'N/A'}`)
      console.log(`   Rôle: ${user.role}`)
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()

