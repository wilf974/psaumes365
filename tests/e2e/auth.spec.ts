import { test, expect } from '@playwright/test'

/**
 * Tests E2E pour l'authentification
 */
test.describe('Authentification', () => {
  test('devrait permettre l\'inscription d\'un nouvel utilisateur', async ({ page }) => {
    await page.goto('/register')
    
    // Remplir le formulaire d'inscription
    await page.fill('input[type="email"]', `test-${Date.now()}@example.com`)
    await page.fill('input[type="password"]', 'password123')
    await page.fill('input[name="name"]', 'Test User')
    
    // Soumettre le formulaire
    await page.click('button[type="submit"]')
    
    // Vérifier la redirection vers la page d'accueil
    await expect(page).toHaveURL(/\/accueil/)
  })

  test('devrait permettre la connexion d\'un utilisateur existant', async ({ page }) => {
    // Note: Ce test nécessite un utilisateur de test existant
    // À adapter selon votre environnement de test
    await page.goto('/login')
    
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    await page.click('button[type="submit"]')
    
    // Vérifier la redirection
    await expect(page).toHaveURL(/\/accueil/)
  })

  test('devrait afficher une erreur pour des identifiants invalides', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    await page.click('button[type="submit"]')
    
    // Vérifier qu'une erreur est affichée
    await expect(page.locator('text=/erreur|incorrect|invalide/i')).toBeVisible()
  })
})

