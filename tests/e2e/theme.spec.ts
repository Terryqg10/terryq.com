import { expect, test, type Page } from '@playwright/test';

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

/** ADR-0012: botón de modo oscuro que contradice al sistema y recuerda la elección. */
test.describe('selector de tema', () => {
  const toggle = (page: Page) =>
    page.getByRole('button', { name: 'Modo oscuro' }).filter({ visible: true });

  test('sin elección sigue al sistema y el botón lo refleja', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
    await expect(page.locator('body')).toHaveCSS('background-color', paper.dark);
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
  });

  test('un clic contradice al sistema, se guarda y sobrevive a la recarga sin parpadeo', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await toggle(page).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('body')).toHaveCSS('background-color', paper.light);
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
    expect(await page.evaluate(() => localStorage.getItem('tq-theme'))).toBe('light');

    // El script del <head> aplica la elección antes de que cargue ningún JS de la página.
    await page.reload({ waitUntil: 'commit' });
    const early = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(early).toBe('light');
    await page.waitForLoadState('load');
    await expect(page.locator('body')).toHaveCSS('background-color', paper.light);

    // …y se mantiene al cambiar de página y de idioma.
    await page.goto('/en/about');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('body')).toHaveCSS('background-color', paper.light);
  });

  test('de claro a oscuro, y otro clic vuelve atrás', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/contacto');
    await toggle(page).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('body')).toHaveCSS('background-color', paper.dark);
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
    await toggle(page).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('se maneja con el teclado y el icono cambia con el tema', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const button = toggle(page);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.keyboard.press('Space');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    // Claro → luna visible; oscuro → sol visible.
    await expect(button.locator('.tq-theme-moon')).toBeVisible();
    await expect(button.locator('.tq-theme-sun')).toBeHidden();
    await button.click();
    await expect(button.locator('.tq-theme-sun')).toBeVisible();
    await expect(button.locator('.tq-theme-moon')).toBeHidden();
  });

  test('mide al menos 44×44 y funciona sin el almacenamiento', async ({ page, context }) => {
    await context.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('bloqueado');
        },
      });
    });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const box = await toggle(page).boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(43.5);
    expect(box?.height).toBeGreaterThanOrEqual(43.5);
    await toggle(page).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
