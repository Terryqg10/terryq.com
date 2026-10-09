import { expect, test } from '@playwright/test';
import { axeCheck } from './utils';

test('la portada responde 200 y tiene el contenido principal', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('main#contenido')).toBeAttached();
});

test('axeCheck pasa con un documento accesible', async ({ page }) => {
  await page.setContent(
    '<!doctype html><html lang="es"><head><title>Prueba</title></head><body><main><h1>Prueba</h1></main></body></html>',
  );
  await axeCheck(page);
});

test('axeCheck detecta una infracción', async ({ page }) => {
  await page.setContent(
    '<!doctype html><html lang="es"><head><title>Prueba</title></head><body><main><h1>Prueba</h1><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></main></body></html>',
  );
  await expect(axeCheck(page)).rejects.toThrow();
});
