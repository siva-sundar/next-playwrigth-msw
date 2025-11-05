import { test, expect } from './setup';

test('should display SSR and CSR data with mocked APIs', async ({ page }) => {
  await page.goto('/');

  // Verify page loads
  await expect(page.locator('h1')).toContainText('Next.js SSR + CSR Example');

  // Verify SSR data shows mocked server API response (intercepted by MSW for Node.js)
  await expect(page.locator('text=Mocked Server API Response')).toBeVisible();
  await expect(page.locator('text=Mocked Server Data')).toBeVisible();

  // Verify CSR shows loading state
  await expect(page.locator('text=Loading client-side data...')).toBeVisible();

  // Verify CSR data shows mocked client API response (intercepted by @msw/playwright, with 5s latency)
  await expect(page.locator('text=Mocked Client API Response')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('text=Mocked Client Data')).toBeVisible();
});
