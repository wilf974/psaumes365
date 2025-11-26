import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { validateEmail, validatePassword, validateName } from '@/lib/validation'

/**
 * API Route pour l'inscription d'un nouvel utilisateur
 * POST /api/auth/register
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting pour l'authentification
    const rateLimitResponse = rateLimitMiddleware(request, RATE_LIMITS.AUTH)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const body = await request.json()
    const { email, password, name } = body

    // Validation renforcée
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      )
    }

    const nameValidation = validateName(name)
    if (!nameValidation.valid) {
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400 }
      )
    }

    // Vérification si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Création de l'utilisateur (email déjà validé et nettoyé)
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(), // Normaliser l'email
        password: hashedPassword,
        name: name?.trim() || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { message: 'Compte créé avec succès', user },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    )
  }
}


