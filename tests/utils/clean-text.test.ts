import { describe, it, expect } from 'vitest'

/**
 * Fonction de nettoyage de texte (similaire à celle utilisée dans l'app)
 */
function cleanText(text: string): string {
  if (!text) return ''
  
  let cleaned = text.trim()
  
  // Supprimer les guillemets français au début et à la fin
  cleaned = cleaned.replace(/^«\s*/, '').replace(/\s*»$/, '')
  
  // Supprimer les guillemets droits au début et à la fin
  cleaned = cleaned.replace(/^"\s*/, '').replace(/\s*"$/, '')
  
  // Supprimer l'em dash au début ou à la fin
  cleaned = cleaned.replace(/^—\s*/, '').replace(/\s*—$/, '')
  
  return cleaned.trim()
}

describe('cleanText', () => {
  it('devrait supprimer les guillemets français', () => {
    expect(cleanText('« Texte avec guillemets »')).toBe('Texte avec guillemets')
    expect(cleanText('«Texte sans espace»')).toBe('Texte sans espace')
  })

  it('devrait supprimer les guillemets droits', () => {
    expect(cleanText('" Texte avec guillemets "')).toBe('Texte avec guillemets')
    expect(cleanText('"Texte sans espace"')).toBe('Texte sans espace')
  })

  it('devrait supprimer l\'em dash au début ou à la fin', () => {
    expect(cleanText('— Texte avec em dash')).toBe('Texte avec em dash')
    expect(cleanText('Texte avec em dash —')).toBe('Texte avec em dash')
    expect(cleanText('— Texte —')).toBe('Texte')
  })

  it('devrait gérer les combinaisons', () => {
    expect(cleanText('« — Texte — »')).toBe('Texte')
    expect(cleanText('" — Texte — "')).toBe('Texte')
  })

  it('ne devrait pas supprimer les guillemets au milieu du texte', () => {
    expect(cleanText('Texte "avec" guillemets')).toBe('Texte "avec" guillemets')
    expect(cleanText('Texte « avec » guillemets')).toBe('Texte « avec » guillemets')
  })

  it('devrait gérer les chaînes vides', () => {
    expect(cleanText('')).toBe('')
    expect(cleanText('   ')).toBe('')
  })

  it('devrait préserver le texte normal', () => {
    expect(cleanText('Texte normal sans guillemets')).toBe('Texte normal sans guillemets')
  })
})

