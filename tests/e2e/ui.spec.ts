import { expect, test } from '@playwright/test';
import { axeCheck } from './utils';

for (const scheme of ['light', 'dark'] as const) {
  test(`la página de revisión de primitivas pasa axe en modo ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    const response = await page.goto('/ui');
    expect(response?.status()).toBe(200);
    await axeCheck(page);
  });
}

test('un botón externo lleva ↗ decorativo y el texto oculto «(sitio externo)»', async ({
  page,
}) => {
  await page.goto('/ui');
  const link = page.getByRole('link', { name: /GitHub/ }).first();
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
  await expect(link.locator('[aria-hidden="true"]')).toHaveText('↗');
  await expect(link).toContainText('(sitio externo)');
});

test('en inglés el texto oculto de los enlaces externos está en inglés', async ({ page }) => {
  await page.goto('/en/ui');
  await expect(page.getByRole('link', { name: /GitHub/ }).first()).toContainText('(external site)');
});

test('un campo con error se marca como inválido y apunta a su mensaje', async ({ page }) => {
  await page.goto('/ui');
  const field = page.getByLabel('Email o teléfono');
  await expect(field).toHaveAttribute('aria-invalid', 'true');
  const messageId = await field.getAttribute('aria-describedby');
  expect(messageId).toBeTruthy();
  await expect(page.locator(`[id="${messageId}"]`)).toContainText('Revisa el formato');
  await expect(page.locator(`[id="${messageId}"] svg[aria-hidden="true"]`)).toBeVisible();
  await expect(page.getByLabel('Nombre')).not.toHaveAttribute('aria-invalid', /.*/);
});

test('un campo opcional muestra «Opcional» y conserva su texto de ayuda', async ({ page }) => {
  await page.goto('/ui');
  await expect(page.locator('label[for="demo-web"]')).toContainText('Opcional');
  await expect(page.getByLabel('Tu web')).toHaveAttribute('aria-describedby', 'demo-web-help');
});

test('RadioPills son radios reales dentro de un fieldset con legend', async ({ page }) => {
  await page.goto('/ui');
  const group = page.getByRole('group', { name: 'Qué necesitas' });
  await expect(group.getByRole('radio')).toHaveCount(3);
  await expect(group.getByRole('radio', { name: 'Rediseño' })).toBeChecked();
  await group.getByText('Marca').click();
  await expect(group.getByRole('radio', { name: 'Marca' })).toBeChecked();
});

test('los signos < > del titular son decorativos', async ({ page }) => {
  await page.goto('/ui');
  const quote = page.locator('blockquote').first();
  await expect(quote.locator('[aria-hidden="true"]')).toHaveCount(2);
  await expect(quote).toContainText('Desarrollador');
});

test('el foco por teclado se ve en los botones', async ({ page }) => {
  await page.goto('/ui');
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(
    () => getComputedStyle(document.activeElement as Element).outlineStyle,
  );
  expect(outline).toBe('solid');
});
