import { test, expect } from '@playwright/test'

const baseURL = 'http://localhost:5173'

 test('generate flow', async ({ page }) => {
  await page.goto(baseURL)
  await page.getByText('Generate Demo Data').click()
  await expect(page.getByText('Created run')).toBeVisible({ timeout: 10000 })
})
