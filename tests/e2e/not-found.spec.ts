import { expect, test } from '@playwright/test';
import { axeCheck } from './utils';

test.describe('CA-7.1: estado, idioma y noindex', () => {
  const cases = [
    {
      path: '/loquesea',
      lang: 'es',
      title: 'Esta página no existe',
      text: 'Puede que el enlace esté mal o que la página se haya movido.',
      home: 'Volver al inicio',
      work: 'Ver trabajos',
      goTo: 'O ve directamente a',
      links: ['/trabajos', '/servicios', '/sobre-mi', '/contacto'],
    },
    {
      path: '/en/loquesea',
      lang: 'en',
      title: "This page doesn't exist",
      text: 'The link may be broken, or the page may have moved.',
      home: 'Back to home',
      work: 'See my work',
      goTo: 'Or go straight to',
      links: ['/en/work', '/en/services', '/en/about', '/en/contact'],
    },
  ] as const;

  for (const c of cases) {
    test(`${c.path}: 404, <html lang="${c.lang}">, noindex y textos`, async ({ page }) => {
      const response = await page.goto(c.path);
      expect(response?.status()).toBe(404);
      await expect(page.locator('html')).toHaveAttribute('lang', c.lang);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

      await expect(page.getByRole('heading', { level: 1, name: c.title })).toBeVisible();
      await expect(page.getByText(c.text)).toBeVisible();
      await expect(page.getByRole('link', { name: c.home })).toHaveAttribute(
        'href',
        c.lang === 'es' ? '/' : '/en',
      );
      await expect(page.getByRole('link', { name: c.work })).toHaveAttribute(
        'href',
        c.lang === 'es' ? '/trabajos' : '/en/work',
      );

      const shortcuts = page.getByRole('navigation', { name: c.goTo });
      await expect(shortcuts.getByRole('link')).toHaveCount(4);
      for (const href of c.links) {
        await expect(shortcuts.locator(`a[href="${href}"]`)).toBeVisible();
      }
      // La cabecera y el pie siguen ahí.
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('contentinfo')).toBeVisible();
      await axeCheck(page);
    });
  }

  test('rutas anidadas y con un prefijo desconocido también dan 404 traducida', async ({
    page,
  }) => {
    for (const path of ['/trabajos/no-existe/otra', '/xx/loquesea', '/en/work/no-existe']) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
      await expect(page.getByRole('heading', { level: 1 }), path).toHaveText(
        path.startsWith('/en') ? "This page doesn't exist" : 'Esta página no existe',
      );
    }
  });
});

test.describe('ruta pedida (RequestedPath)', () => {
  test('muestra /<ruta> → 404 con el 404 en danger', async ({ page }) => {
    await page.goto('/loquesea');
    const line = page.locator('main p', { hasText: '→' });
    await expect(line).toHaveText('/loquesea→404');
    await expect(line.locator('span', { hasText: /^404$/ })).toBeVisible();
    await page.goto('/en/loquesea');
    await expect(page.locator('main p', { hasText: '→' })).toHaveText('/en/loquesea→404');
  });

  test('recorta a 60 caracteres', async ({ page }) => {
    await page.goto(`/${'a'.repeat(100)}`);
    const text = (await page.locator('main p', { hasText: '→' }).innerText()).replace(
      /\s*→\s*404$/,
      '',
    );
    expect(text).toBe(`/${'a'.repeat(59)}…`);
  });

  test('escapa el contenido: una ruta con HTML no inyecta nada', async ({ page }) => {
    const dialogs: string[] = [];
    page.on('dialog', (dialog) => dialogs.push(dialog.message()));
    await page.goto('/%3Cimg%20src=x%20onerror=alert(1)%3E');
    await expect(page.locator('main p', { hasText: '→' })).toContainText(
      '<img src=x onerror=alert(1)>',
    );
    await expect(page.locator('main img')).toHaveCount(0);
    expect(dialogs).toEqual([]);
  });

  test('con una secuencia % mal formada no se rompe', async ({ page }) => {
    const response = await page.goto('/100%25-mal/%E0%A4%A');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

test('el selector de idioma lleva a la portada del otro idioma', async ({ page }) => {
  await page.goto('/loquesea');
  await expect(page.getByRole('link', { name: /cambiar idioma a inglés/ })).toHaveAttribute(
    'href',
    '/en',
  );
  await page.goto('/en/loquesea');
  await expect(page.getByRole('link', { name: /switch language to Spanish/ })).toHaveAttribute(
    'href',
    '/',
  );
});

test('en móvil, el 404 grande va encima del título y no hay desbordamiento', async ({ page }) => {
  await page.goto('/loquesea');
  const title = await page.getByRole('heading', { level: 1 }).boundingBox();
  const big = await page
    .locator('main [aria-hidden="true"]', { hasText: '404' })
    .first()
    .boundingBox();
  if (!title || !big) throw new Error('faltan elementos');
  if ((page.viewportSize()?.width ?? 0) >= 1024) {
    expect(big.x).toBeGreaterThan(title.x + title.width / 2); // a la derecha
  } else {
    expect(big.y).toBeLessThan(title.y);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('la 404 se ve completa; de la ruta solo queda el 404', async ({ page }) => {
    const response = await page.goto('/loquesea');
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Esta página no existe' }),
    ).toBeVisible();
    await expect(page.locator('main p', { hasText: /^404$/ })).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: 'O ve directamente a' }).getByRole('link'),
    ).toHaveCount(4);
  });
});
