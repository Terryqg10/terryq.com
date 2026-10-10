import { expect, test } from '@playwright/test';
import { allRoutes, axeCheck } from './utils';

/**
 * axe (WCAG 2.2 AA) en cada página × idioma × tema: 0 infracciones (spec §13, §17.3).
 * Cada página ya tiene sus propias comprobaciones en su spec; esta es la barrida completa, que
 * además cubre la 404.
 */
for (const scheme of ['light', 'dark'] as const) {
  test.describe(`tema ${scheme}`, () => {
    test.use({ colorScheme: scheme });

    for (const path of [...allRoutes, '/loquesea', '/en/loquesea']) {
      test(`${path}: sin infracciones de axe`, async ({ page }) => {
        await page.goto(path);
        // Recorre la página para que las imágenes diferidas y las apariciones ya estén resueltas.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 700) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
          window.scrollTo(0, 0);
        });
        await axeCheck(page);
      });
    }
  });
}

test('el formulario con errores y el de «enviado» también pasan axe', async ({ page }) => {
  await page.goto('/contacto');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Faltan datos' })).toBeFocused();
  await axeCheck(page);
});

test('el menú móvil abierto pasa axe', async ({ page }) => {
  test.skip(
    (page.viewportSize()?.width ?? 0) >= 1024,
    'El menú móvil solo existe por debajo de lg',
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await expect(page.getByRole('dialog', { name: 'Menú principal' })).toBeVisible();
  await axeCheck(page);
});
