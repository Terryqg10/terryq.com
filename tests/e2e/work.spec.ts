import { expect, test, type Page } from '@playwright/test';
import { axeCheck } from './utils';

const rows = (page: Page) => page.locator('[data-row]');
const visibleRows = (page: Page) => page.locator('[data-row]:visible');
const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 768;

test('cabecera: etiqueta, h1, entradilla y el contador calculado', async ({ page }) => {
  await page.goto('/trabajos');
  await expect(page.getByRole('heading', { level: 1, name: 'Trabajos' })).toBeVisible();
  await expect(page.locator('main p', { hasText: /^\/trabajos$/ })).toBeVisible();
  await expect(page.getByText('3 proyectos · 2026')).toBeVisible();
  await expect(page.getByText('Webs para clientes, productos propios')).toBeVisible();

  await page.goto('/en/work');
  await expect(page.getByRole('heading', { level: 1, name: 'Work' })).toBeVisible();
  await expect(page.getByText('3 projects · 2026')).toBeVisible();
  await expect(page.locator('main p', { hasText: /^\/work$/ })).toBeVisible();
});

test('filtros: grupo con 3 botones, contadores y aria-pressed', async ({ page }) => {
  await page.goto('/trabajos');
  const group = page.getByRole('group', { name: 'Filtrar por tipo' });
  await expect(group).toBeVisible();
  const all = group.getByRole('button', { name: /^Todo\s*3$/ });
  const web = group.getByRole('button', { name: /^Web\s*3$/ });
  const brand = group.getByRole('button', { name: /^Marca\s*1$/ });
  await expect(all).toHaveAttribute('aria-pressed', 'true');
  await expect(web).toHaveAttribute('aria-pressed', 'false');
  await expect(brand).toHaveAttribute('aria-pressed', 'false');

  await brand.click();
  await expect(brand).toHaveAttribute('aria-pressed', 'true');
  await expect(all).toHaveAttribute('aria-pressed', 'false');
});

test('CA-2.1: con «Marca» solo queda HB; con «Todo», las 3 filas en el orden del índice', async ({
  page,
}) => {
  await page.goto('/trabajos');
  await expect(visibleRows(page)).toHaveCount(3);

  await page.getByRole('button', { name: /^Marca/ }).click();
  await expect(visibleRows(page)).toHaveCount(1);
  await expect(visibleRows(page).first()).toContainText('HB Construcciones');

  await page.getByRole('button', { name: /^Web/ }).click();
  await expect(visibleRows(page)).toHaveCount(3);

  await page.getByRole('button', { name: /^Todo/ }).click();
  const names = await visibleRows(page)
    .locator('a')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(names).toEqual([
    '/trabajos/hb-construcciones',
    '/trabajos/zona-f',
    '/trabajos/finanzas-personales',
  ]);
});

test('una región aria-live anuncia el número de proyectos al filtrar', async ({ page }) => {
  await page.goto('/trabajos');
  const live = page.locator('[aria-live="polite"]');
  await page.getByRole('button', { name: /^Marca/ }).click();
  await expect(live).toHaveText('1 proyecto');
  await page.getByRole('button', { name: /^Todo/ }).click();
  await expect(live).toHaveText('3 proyectos');
});

test('sin JavaScript se ven todas las filas y los filtros no se muestran', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/trabajos');
  await expect(visibleRows(page)).toHaveCount(3);
  await expect(page.getByRole('group', { name: 'Filtrar por tipo' })).toBeHidden();
  await context.close();
});

test('la tabla es una región enfocable y cada fila es un único enlace al caso', async ({
  page,
}) => {
  await page.goto('/trabajos');
  const region = page.getByRole('region', { name: 'Tabla de proyectos' });
  await expect(region).toHaveAttribute('tabindex', '0');
  await expect(rows(page)).toHaveCount(3);
  for (const row of await rows(page).all()) {
    await expect(row.locator('a')).toHaveCount(1);
  }
  await expect(page.getByRole('region', { name: 'Tabla de proyectos' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Finanzas Personales/ })).toHaveAttribute(
    'href',
    '/trabajos/finanzas-personales',
  );
});

test('CA-2.2: con el teclado, Tab recorre filtros → región de la tabla → filas', async ({
  page,
  browserName,
}) => {
  test.skip(browserName === 'webkit', 'WebKit no enfoca enlaces con Tab por defecto');
  await page.goto('/trabajos');
  await page.getByRole('button', { name: /^Todo/ }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /^Web/ })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /^Marca/ })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('region', { name: 'Tabla de proyectos' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(rows(page).nth(0).locator('a')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(rows(page).nth(1).locator('a')).toBeFocused();
});

test('bloque de GitHub con su botón', async ({ page }) => {
  await page.goto('/trabajos');
  await expect(
    page.getByRole('heading', { level: 2, name: 'Más código y experimentos en GitHub' }),
  ).toBeVisible();
  await expect(
    page.getByText('Incluido el código de esta web, con su especificación y sus tareas.'),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /Ver GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/Terryqg10',
  );
});

test.describe('escritorio (desde md)', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 768, 'solo desde md');

  test('cabecera de columnas y las columnas de cada fila', async ({ page }) => {
    await page.goto('/trabajos');
    for (const label of ['Año', 'Proyecto', 'Tipo', 'Estado']) {
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
    }
    const first = rows(page).first();
    await expect(first).toContainText('2026');
    await expect(first).toContainText('Web para cliente · Propuesta de identidad');
    await expect(first).toContainText('Online');
    await expect(rows(page).nth(1)).toContainText('Producto propio · Demo');
  });

  test('la vista previa flotante sigue a la fila y desaparece al salir', async ({ page }) => {
    await page.goto('/trabajos');
    const preview = page.locator('div.fixed.z-30 > div > div');
    await expect(preview).toHaveCSS('opacity', '0');

    const box = await rows(page).nth(0).boundingBox();
    await page.mouse.move((box?.x ?? 0) + 200, (box?.y ?? 0) + (box?.height ?? 0) / 2);
    await expect(preview).toHaveCSS('opacity', '1');
    await expect(preview.locator('img')).toBeVisible();
    await expect(page.locator('div.fixed.z-30')).toHaveAttribute('aria-hidden', 'true');
    expect(
      await page.locator('div.fixed.z-30').evaluate((el) => getComputedStyle(el).pointerEvents),
    ).toBe('none');

    // Pasa a la segunda fila: la vista previa baja con ella.
    const first = (await preview.boundingBox())?.y ?? 0;
    const second = await rows(page).nth(1).boundingBox();
    await page.mouse.move((second?.x ?? 0) + 200, (second?.y ?? 0) + (second?.height ?? 0) / 2);
    await expect
      .poll(async () => (await preview.boundingBox())?.y ?? 0)
      .toBeGreaterThan(first + 20);

    await page.mouse.move(2, 2);
    await expect(preview).toHaveCSS('opacity', '0');
  });

  test('con movimiento reducido la vista previa aparece fija, sin desplazarse', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto('/trabajos');
    const preview = page.locator('div.fixed.z-30 > div > div');
    const row = await rows(page).nth(0).boundingBox();
    await page.mouse.move((row?.x ?? 0) + 200, (row?.y ?? 0) + 20);
    await expect(preview).toHaveCSS('opacity', '1');
    const x1 = (await preview.boundingBox())?.x ?? 0;
    await page.mouse.move((row?.x ?? 0) + 600, (row?.y ?? 0) + 20);
    const x2 = (await preview.boundingBox())?.x ?? 0;
    expect(Math.abs(x2 - x1)).toBeLessThan(1);
    await context.close();
  });

  test('la pista de la vista previa solo se ve con puntero fino', async ({ page }) => {
    await page.goto('/trabajos');
    await expect(
      page.getByText('Pasa el ratón por una fila para ver la vista previa.'),
    ).toBeVisible();
  });
});

test.describe('móvil (por debajo de md)', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 768, 'solo por debajo de md');

  test('CA-2.3: sin scroll horizontal y cada fila mide al menos 44px', async ({ page }) => {
    await page.goto('/trabajos');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    for (const row of await rows(page).all()) {
      const box = await row.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });

  test('filas apiladas: la línea mono lleva año, tipo y estado, y no hay vista previa ni pista', async ({
    page,
  }) => {
    await page.goto('/trabajos');
    await expect(rows(page).first()).toContainText(
      '2026 · Web para cliente · Propuesta de identidad · Online',
    );
    await expect(page.getByText('Pasa el ratón por una fila')).toBeHidden();
    await expect(page.locator('div.fixed.z-30')).toBeHidden();
    // La cabecera de columnas no se ve.
    await expect(page.getByText('Proyecto', { exact: true })).toBeHidden();
  });
});

test('en inglés: filtros, columnas y rutas de los casos', async ({ page }) => {
  await page.goto('/en/work');
  await expect(page.getByRole('group', { name: 'Filter by type' })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Brand\s*1$/ })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Project table' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Zona F/ })).toHaveAttribute(
    'href',
    '/en/work/zona-f',
  );
  await expect(page.getByRole('link', { name: /See GitHub/ })).toBeVisible();
  if (isDesktop(page))
    await expect(page.getByText('Hover over a row to see a preview.')).toBeVisible();
});

for (const path of ['/trabajos', '/en/work']) {
  for (const scheme of ['light', 'dark'] as const) {
    test(`axe: ${path} en modo ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      await axeCheck(page, { ignore: ['document-title'] }); // sin <title> hasta T30
    });
  }
}
