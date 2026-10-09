import { expect, test } from '@playwright/test';
import { routes } from './utils';

test('/servicios y /en/services responden 200 con su h1 y su idioma', async ({ page }) => {
  for (const [path, lang, h1] of [
    ['/servicios', 'es', 'Servicios'],
    ['/en/services', 'en', 'Services'],
  ] as const) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);
  }
});

test('/es/servicios redirige con 308 a /servicios', async ({ request }) => {
  const response = await request.get('/es/servicios', { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(new URL(response.headers()['location'] ?? '', 'http://localhost').pathname).toBe(
    '/servicios',
  );
});

test('todas las rutas de §5.2 existen en los dos idiomas', async ({ request }) => {
  for (const path of [...routes.es, ...routes.en]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
  }
});

test('ninguna respuesta lleva Set-Cookie, ni siquiera con Accept-Language en inglés', async ({
  request,
}) => {
  for (const path of [...routes.es, ...routes.en, '/es/servicios']) {
    const response = await request.get(path, {
      maxRedirects: 0,
      headers: { 'Accept-Language': 'en-GB,en;q=0.9' },
    });
    expect(response.headers()['set-cookie'], path).toBeUndefined();
  }
});

test('no se redirige según Accept-Language', async ({ request }) => {
  const response = await request.get('/', {
    maxRedirects: 0,
    headers: { 'Accept-Language': 'en-GB,en;q=0.9' },
  });
  expect(response.status()).toBe(200);
});

test('una ruta o un idioma que no existen dan 404', async ({ request }) => {
  for (const path of ['/fr', '/trabajos/no-existe', '/en/work/no-existe']) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(404);
  }
});

test('una ruta traducida en el idioma equivocado redirige a la correcta', async ({ request }) => {
  const response = await request.get('/en/trabajos', { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers()['location']).toBe('/en/work');
});
