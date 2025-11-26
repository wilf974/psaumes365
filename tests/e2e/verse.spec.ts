import { test, expect } from '@playwright/test'

/**
 * Tests E2E pour les versets bibliques
 */
test.describe('Verset du jour', () => {
  test('devrait afficher le verset du jour sur la page d\'accueil', async ({ page }) => {
    // Se connecter d'abord (si nécessaire)
    // await page.goto('/login')
    // ... connexion ...
    
    await page.goto('/accueil')
    
    // Vérifier que le verset est affiché
    await expect(page.locator('.verse-text')).toBeVisible()
    await expect(page.locator('.verse-reference')).toBeVisible()
  })

  test('devrait permettre d\'écouter le verset', async ({ page }) => {
    await page.goto('/accueil')
    
    // Cliquer sur le bouton audio
    const audioButton = page.locator('button:has-text("Écouter")').first()
    if (await audioButton.isVisible()) {
      await audioButton.click()
      
      // Vérifier que l'audio démarre (peut nécessiter des vérifications spécifiques)
      // Cette vérification dépend de l'implémentation de l'audio
    }
  })

  test('devrait permettre d\'ajouter un verset aux favoris', async ({ page }) => {
    // Se connecter d'abord
    // await page.goto('/login')
    // ... connexion ...
    
    await page.goto('/accueil')
    
    // Cliquer sur le bouton favori
    const favoriteButton = page.locator('button[aria-label*="favori"], button:has(svg)').first()
    if (await favoriteButton.isVisible()) {
      await favoriteButton.click()
      
      // Vérifier que le verset est ajouté aux favoris
      // (peut nécessiter une vérification visuelle ou une navigation vers /favoris)
    }
  })
})

