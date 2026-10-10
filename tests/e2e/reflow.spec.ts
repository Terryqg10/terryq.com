import { expect, test } from '@playwright/test';
import { allRoutes } from './utils';

/**
 * Spec §13 A11 (WCAG 1.4.10 Reflow): a 320px de ancho y con el zoom al 200 % (1440px → 720px)
 * no hay scroll horizontal en la página. La revisión visual de «sin pérdida de contenido» es manual
 * (docs/qa/guion-prueba-manual.md).
 */
const widths = [
  { name: '320px', width: 320, height: 640 },
  { name: 'zoom 200 % en un monitor de 1440px', width: 720, height: 450 },
] as const;

test.describe('reflow', () => {
  test.skip(
    ({ browserName, isMobile }) => browserName !== 'chromium' || isMobile,
    'Basta con Chromium de escritorio',
  );

  for (const size of widths) {
    test.describe(size.name, () => {
      test.use({ viewport: { width: size.width, height: size.height } });

      for (const path of [...allRoutes, '/loquesea']) {
        test(`${path}: sin scroll horizontal`, async ({ page }) => {
          await page.goto(path);
          // Recorre la página para que todo lo diferido ya esté en su sitio.
          await page.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += 600) {
              window.scrollTo(0, y);
              await new Promise((resolve) => setTimeout(resolve, 15));
            }
            window.scrollTo(0, 0);
          });
          const { scrollWidth, clientWidth } = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
          }));
          expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
        });
      }
    });
  }
});
