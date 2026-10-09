import { expect, test } from '@playwright/test';

const paper = { light: 'rgb(242, 240, 235)', dark: 'rgb(17, 17, 16)' };

for (const scheme of ['light', 'dark'] as const) {
  test(`el fondo y la tinta siguen el modo ${scheme} del sistema`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toHaveCSS('background-color', paper[scheme]);
    await expect(body).toHaveCSS('color', scheme === 'light' ? 'rgb(20, 20, 20)' : paper.light);
  });
}
