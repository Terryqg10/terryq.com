import { expect, test } from '@playwright/test';
import { allRoutes } from './utils';

/** Spec §11.3: cada página y cada caso (las legales no llevan) anuncia una imagen Open Graph PNG de 1200×630 que existe. */
const pngSize = (body: Buffer) => ({ width: body.readUInt32BE(16), height: body.readUInt32BE(20) });

const pages = allRoutes.filter(
  (path) => !/\/(ui|aviso-legal|privacidad|legal-notice|privacy)$/.test(path),
);

test.describe('imágenes Open Graph', () => {
  for (const path of pages) {
    test(`${path} anuncia una imagen válida`, async ({ page, request }) => {
      await page.goto(path);
      const og = await page.locator('meta[property="og:image"]').getAttribute('content');
      const twitter = await page.locator('meta[name="twitter:image"]').getAttribute('content');
      expect(og).toBeTruthy();
      expect(twitter).toBe(og);
      await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
        'content',
        '1200',
      );
      await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
        'content',
        '630',
      );

      const url = new URL(og ?? '');
      const response = await request.get(url.pathname + url.search);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toBe('image/png');
      const body = await response.body();
      expect(pngSize(body)).toEqual({ width: 1200, height: 630 });
      expect(body.length).toBeGreaterThan(10_000);
    });
  }
});
