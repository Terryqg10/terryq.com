import { expect, test } from '@playwright/test';

const origin = 'http://localhost:3100'; // NEXT_PUBLIC_SITE_URL del webServer

test('el sitemap lista las páginas indexables × 2 idiomas con sus alternates', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const xml = await response.text();

  const urls = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expected = [
    '',
    '/trabajos',
    '/trabajos/hb-construcciones',
    '/trabajos/zona-f',
    '/trabajos/finanzas-personales',
    '/servicios',
    '/sobre-mi',
    '/contacto',
    '/aviso-legal',
    '/privacidad',
    '/en',
    '/en/work',
    '/en/work/hb-construcciones',
    '/en/work/zona-f',
    '/en/work/finanzas-personales',
    '/en/services',
    '/en/about',
    '/en/contact',
    '/en/legal-notice',
    '/en/privacy',
  ].map((path) => `${origin}${path || ''}`);
  expect([...urls].sort()).toEqual([...expected].sort());
  expect(new Set(urls).size).toBe(urls.length);

  // Cada entrada lleva sus alternates es y en.
  expect(xml).toContain(`hreflang="es" href="${origin}/servicios"`);
  expect(xml).toContain(`hreflang="en" href="${origin}/en/services"`);
  expect((xml.match(/hreflang="es"/g) ?? []).length).toBe(20);
  expect((xml.match(/hreflang="en"/g) ?? []).length).toBe(20);
  expect(xml).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}/);
});

test('el sitemap no incluye la 404 ni la página de revisión de UI', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).not.toMatch(/not-found|\/ui<|\/en\/ui</);
});

test('todas las URLs del sitemap responden 200 y no son noindex', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const urls = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? '');
  for (const url of urls) {
    const response = await request.get(url);
    expect(response.status(), url).toBe(200);
    expect(await response.text(), url).not.toMatch(/<meta name="robots" content="[^"]*noindex/);
  }
});

test('en local robots.txt no deja indexar nada', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.status()).toBe(200);
  const text = await response.text();
  expect(text).toMatch(/User-Agent: \*\s+Disallow: \//);
  expect(text).not.toContain('Sitemap:');
});
