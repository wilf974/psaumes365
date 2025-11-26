/**
 * Fonctions de validation renforcée pour les entrées utilisateur
 */

/**
 * Valide un email
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email requis' }
  }

  const trimmed = email.trim()
  if (trimmed.length === 0) {
    return { valid: false, error: 'Email ne peut pas être vide' }
  }

  if (trimmed.length > 255) {
    return { valid: false, error: 'Email trop long (max 255 caractères)' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Format d\'email invalide' }
  }

  // Vérifier les caractères dangereux
  if (/[<>\"']/.test(trimmed)) {
    return { valid: false, error: 'Email contient des caractères invalides' }
  }

  return { valid: true }
}

/**
 * Valide un mot de passe
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Mot de passe requis' }
  }

  if (password.length < 8) {
    return { valid: false, error: 'Le mot de passe doit contenir au moins 8 caractères' }
  }

  if (password.length > 128) {
    return { valid: false, error: 'Le mot de passe est trop long (max 128 caractères)' }
  }

  // Vérifier qu'il n'y a pas que des espaces
  if (password.trim().length === 0) {
    return { valid: false, error: 'Le mot de passe ne peut pas être uniquement des espaces' }
  }

  return { valid: true }
}

/**
 * Valide un nom d'utilisateur
 */
export function validateName(name: string | null | undefined): { valid: boolean; error?: string } {
  if (!name) {
    return { valid: true } // Optionnel
  }

  if (typeof name !== 'string') {
    return { valid: false, error: 'Le nom doit être une chaîne de caractères' }
  }

  const trimmed = name.trim()
  if (trimmed.length === 0) {
    return { valid: true } // Vide = null
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Le nom est trop long (max 100 caractères)' }
  }

  // Vérifier les caractères dangereux
  if (/[<>\"']/.test(trimmed)) {
    return { valid: false, error: 'Le nom contient des caractères invalides' }
  }

  return { valid: true }
}

/**
 * Nettoie et valide un texte (pour journal, commentaires, etc.)
 */
export function validateText(
  text: string,
  options: { minLength?: number; maxLength?: number; required?: boolean } = {}
): { valid: boolean; cleaned?: string; error?: string } {
  const { minLength = 1, maxLength = 10000, required = true } = options

  if (!text) {
    if (required) {
      return { valid: false, error: 'Texte requis' }
    }
    return { valid: true, cleaned: '' }
  }

  if (typeof text !== 'string') {
    return { valid: false, error: 'Le texte doit être une chaîne de caractères' }
  }

  const trimmed = text.trim()

  if (required && trimmed.length === 0) {
    return { valid: false, error: 'Le texte ne peut pas être vide' }
  }

  if (trimmed.length < minLength) {
    return { valid: false, error: `Le texte doit contenir au moins ${minLength} caractère(s)` }
  }

  if (trimmed.length > maxLength) {
    return { valid: false, error: `Le texte est trop long (max ${maxLength} caractères)` }
  }

  // Nettoyer les caractères de contrôle (sauf sauts de ligne et tabulations)
  const cleaned = trimmed.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')

  return { valid: true, cleaned }
}

/**
 * Valide une référence biblique
 */
export function validateVerseRef(verseRef: string): { valid: boolean; error?: string } {
  if (!verseRef || typeof verseRef !== 'string') {
    return { valid: false, error: 'Référence biblique requise' }
  }

  const trimmed = verseRef.trim()
  if (trimmed.length === 0) {
    return { valid: false, error: 'Référence biblique ne peut pas être vide' }
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Référence biblique trop longue' }
  }

  // Format basique : Livre Chapitre:Verset(s)
  // Exemples valides : "Jean 3:16", "Psaume 23:1-6", "1 Corinthiens 13:4-7"
  const verseRefRegex = /^[A-Za-zÀ-ÿ0-9\s]+(?:\s+\d+)?\s*\d+:\d+(?:-\d+)?$/
  if (!verseRefRegex.test(trimmed)) {
    return { valid: false, error: 'Format de référence biblique invalide' }
  }

  return { valid: true }
}

/**
 * Valide un ID (cuid, uuid, etc.)
 */
export function validateId(id: string, fieldName: string = 'ID'): { valid: boolean; error?: string } {
  if (!id || typeof id !== 'string') {
    return { valid: false, error: `${fieldName} requis` }
  }

  if (id.trim().length === 0) {
    return { valid: false, error: `${fieldName} ne peut pas être vide` }
  }

  // Vérifier qu'il n'y a pas de caractères dangereux
  if (/[<>\"'&]/.test(id)) {
    return { valid: false, error: `${fieldName} contient des caractères invalides` }
  }

  return { valid: true }
}

/**
 * Sanitize une chaîne pour éviter les injections
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    .replace(/[<>\"']/g, '') // Supprimer les caractères dangereux
    .replace(/\x00/g, '') // Supprimer les null bytes
}

