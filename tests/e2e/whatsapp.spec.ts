import { expect, test } from '@playwright/test';
import { routes } from './utils';

const href = {
  es: /^https:\/\/wa\.me\/34614312673\?text=Hola%20Terry%2C%20vengo%20de%20tu%20web%20y%20quer%C3%ADa%20hablarte%20de%20$/,
  en: /^https:\/\/wa\.me\/34614312673\?text=Hi%20Terry%2C%20I%20found%20your%20website%20and%20I%27d%20like%20to%20talk%20about%20$/,
};

for (const locale of ['es', 'en'] as const) {
  test(`el botón de WhatsApp aparece en todas las páginas con el enlace en ${locale}`, async ({
    page,
  }) => {
    const label = locale === 'es' ? 'Escríbeme por WhatsApp' : 'Message me on WhatsApp';
    for (const path of routes[locale]) {
      await page.goto(path);
      const fab = page.getByRole('link', { name: label });
      await expect(fab, path).toBeVisible();
      await expect(fab, path).toHaveAttribute('href', href[locale]);
    }
  });
}

test('el botón mide 56×56 y está fijo abajo a la derecha', async ({ page }) => {
  await page.goto('/');
  const fab = page.getByRole('link', { name: 'Escríbeme por WhatsApp' });
  const box = await fab.boundingBox();
  const viewport = page.viewportSize();
  expect(box?.width).toBe(56);
  expect(box?.height).toBe(56);
  expect(await fab.evaluate((el) => getComputedStyle(el).position)).toBe('fixed');
  expect((viewport?.width ?? 0) - ((box?.x ?? 0) + (box?.width ?? 0))).toBeGreaterThanOrEqual(16);
  expect((viewport?.height ?? 0) - ((box?.y ?? 0) + (box?.height ?? 0))).toBeGreaterThanOrEqual(16);
});

test('sin Vercel no se pide el script de analítica', async ({ page }) => {
  const insights: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/_vercel/')) insights.push(request.url());
  });
  await page.goto('/');
  expect(insights).toEqual([]);
});
