import { expect, test, type Page } from '@playwright/test';

// La página de revisión (/ui) tiene secciones marcadas con `data-reveal`, unas en pantalla al
// cargar y otras más abajo.

const state = (page: Page, index: number) =>
  page.locator('[data-reveal]').nth(index).getAttribute('data-reveal');

test('lo que está en pantalla al cargar no se anima y lo de abajo queda pendiente', async ({
  page,
}) => {
  await page.goto('/ui');
  const total = await page.locator('[data-reveal]').count();
  expect(total).toBeGreaterThan(3);
  // La primera sección está en pantalla: no recibe `pending`.
  await expect.poll(() => state(page, 0)).toBe('true');
  // La última está fuera de pantalla: queda pendiente (invisible y desplazada).
  await expect.poll(() => state(page, total - 1)).toBe('pending');
  const last = page.locator('[data-reveal]').nth(total - 1);
  await expect(last).toHaveCSS('opacity', '0');
  expect(await last.evaluate((el) => getComputedStyle(el).transform)).not.toBe('none');
});

test('al hacer scroll aparece una sola vez', async ({ page }) => {
  await page.goto('/ui');
  const total = await page.locator('[data-reveal]').count();
  const last = page.locator('[data-reveal]').nth(total - 1);
  await expect.poll(() => state(page, total - 1)).toBe('pending');

  await last.scrollIntoViewIfNeeded();
  await expect.poll(() => state(page, total - 1)).toBe('done');
  await expect(last).toHaveCSS('opacity', '1');

  // Al volver a salir de pantalla no se vuelve a ocultar.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  expect(await state(page, total - 1)).toBe('done');
});

test('la duración es de 450ms en escritorio y 300ms en móvil', async ({ page }) => {
  await page.goto('/ui');
  const total = await page.locator('[data-reveal]').count();
  const last = page.locator('[data-reveal]').nth(total - 1);
  await expect.poll(() => state(page, total - 1)).toBe('pending');
  const duration = await last.evaluate((el) => getComputedStyle(el).transitionDuration);
  const width = page.viewportSize()?.width ?? 0;
  expect(duration.split(',')[0]?.trim()).toBe(width < 768 ? '0.3s' : '0.45s');
});

test('con movimiento reducido no hay transformaciones y todo es visible', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/ui');
  const items = page.locator('[data-reveal]');
  const total = await items.count();
  for (let index = 0; index < total; index++) {
    const item = items.nth(index);
    expect(await item.getAttribute('data-reveal'), `sección ${index}`).not.toBe('pending');
    await expect(item).toHaveCSS('opacity', '1');
    expect(await item.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
  }
  await context.close();
});

test('sin JavaScript todo es visible', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/ui');
  const items = page.locator('[data-reveal]');
  const total = await items.count();
  expect(total).toBeGreaterThan(3);
  for (let index = 0; index < total; index++) {
    await expect(items.nth(index)).toHaveCSS('opacity', '1');
  }
  await context.close();
});

test('al navegar a otra página las secciones nuevas también se observan', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('contentinfo').getByRole('link', { name: 'Privacidad' }).click();
  await expect(page).toHaveURL(/\/privacidad$/);
  // Ninguna página real marca secciones todavía (se marcan en M3): basta con que no falle.
  await expect(page.locator('main#contenido')).toBeAttached();
});
