import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { canCreatePlans } from '@/lib/permissions'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'

/**
 * POST /api/admin/plans/upload-image
 * Upload une image pour un plan
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(await canCreatePlans())) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('image') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Le fichier doit être une image' },
        { status: 400 }
      )
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'L\'image ne doit pas dépasser 5MB' },
        { status: 400 }
      )
    }

    // Créer le dossier de destination
    const uploadDir = path.join(process.cwd(), 'public', 'plans', 'images')
    await mkdir(uploadDir, { recursive: true })

    // Générer un nom de fichier unique
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const uniqueId = randomBytes(16).toString('hex')
    const fileName = `${uniqueId}.${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    // Convertir le fichier en buffer et l'écrire
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Retourner l'URL publique de l'image
    const publicUrl = `/plans/images/${fileName}`

    return NextResponse.json({ imageUrl: publicUrl })
  } catch (error) {
    console.error('Erreur upload image:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de l\'image' },
      { status: 500 }
    )
  }
}

