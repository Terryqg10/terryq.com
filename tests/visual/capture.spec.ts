import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test, type Page } from '@playwright/test';
import { allRoutes } from '../e2e/utils';

/**
 * Revisión visual de M3 (T24): captura cada página a 390 y 1440 en claro y oscuro, y los artboards
 * que le corresponden, y genera `screenshots/index.html` para compararlos lado a lado. No hay
 * comparación automática píxel a píxel: lo mira Terry.
 */

const out = join(process.cwd(), 'screenshots');
const widths = [390, 1440] as const;
const schemes = ['light', 'dark'] as const;

/** Artboard que corresponde a cada ruta, por ancho. Solo existen en claro (salvo Inicio). */
const artboards: Record<string, Partial<Record<(typeof widths)[number], string>>> = {
  '/': { 1440: 'inicio-escritorio-claro', 390: 'inicio-movil' },
  '/en': { 1440: 'inicio-escritorio-en' },
  '/trabajos': { 1440: 'trabajos-escritorio' },
  '/trabajos/hb-construcciones': { 1440: 'caso-hb-escritorio', 390: 'caso-movil' },
  '/servicios': { 1440: 'servicios-escritorio', 390: 'servicios-movil' },
  '/sobre-mi': { 1440: 'sobre-mi-escritorio', 390: 'sobre-mi-movil' },
};
const darkArtboards: Record<string, string> = { '/': 'inicio-escritorio-oscuro' };

const slugOf = (route: string) => (route === '/' ? 'inicio' : route.slice(1).replaceAll('/', '--'));

/** Recorre la página para cargar las imágenes diferidas y espera a que estén todas. */
async function settle(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
    await document.fonts.ready;
    // Las imágenes con display:none (p. ej. el móvil del hero a 390) nunca cargan: se ignoran.
    const rendered = [...document.images].filter(
      (image) => !image.complete && image.getClientRects().length > 0,
    );
    await Promise.race([
      Promise.all(
        rendered.map((image) => new Promise((resolve) => (image.onload = image.onerror = resolve))),
      ),
      new Promise((resolve) => setTimeout(resolve, 10_000)),
    ]);
  });
}

type Shot = { route: string; scheme: string; width: number; impl: string; artboard?: string };
const shots: Shot[] = [];

test.beforeAll(() => {
  mkdirSync(join(out, 'impl'), { recursive: true });
  mkdirSync(join(out, 'artboard'), { recursive: true });
});

for (const route of allRoutes) {
  test(`capturas de ${route}`, async ({ browser }) => {
    for (const scheme of schemes) {
      for (const width of widths) {
        const context = await browser.newContext({
          viewport: { width, height: width === 390 ? 844 : 900 },
          colorScheme: scheme,
          reducedMotion: 'reduce', // sin apariciones a medias
          deviceScaleFactor: 1,
        });
        const page = await context.newPage();
        await page.goto(route);
        await settle(page);
        const name = `${slugOf(route)}__${scheme}__${width}.png`;
        await page.screenshot({ path: join(out, 'impl', name), fullPage: true });

        const artboard =
          scheme === 'dark' && width === 1440
            ? darkArtboards[route]
            : scheme === 'light'
              ? artboards[route]?.[width]
              : undefined;
        let artboardFile: string | undefined;
        if (artboard) {
          artboardFile = `${artboard}.png`;
          const artboardPage = await context.newPage();
          await artboardPage.goto(
            pathToFileURL(join(process.cwd(), 'docs/design/artboards', `${artboard}.html`)).href,
          );
          await artboardPage.waitForTimeout(800);
          await artboardPage.screenshot({
            path: join(out, 'artboard', artboardFile),
            fullPage: true,
          });
        }
        shots.push({
          route,
          scheme,
          width,
          impl: `impl/${name}`,
          artboard: artboardFile ? `artboard/${artboardFile}` : undefined,
        });
        await context.close();
      }
    }
  });
}

test.afterAll(() => {
  const rows = shots
    .sort(
      (a, b) =>
        a.route.localeCompare(b.route) || a.width - b.width || a.scheme.localeCompare(b.scheme),
    )
    .map(
      (shot) => `
      <section>
        <h2>${shot.route} · ${shot.width}px · ${shot.scheme === 'light' ? 'claro' : 'oscuro'}</h2>
        <div class="pair">
          <figure><figcaption>Implementación</figcaption><img loading="lazy" src="${shot.impl}" alt=""></figure>
          ${
            shot.artboard
              ? `<figure><figcaption>Artboard</figcaption><img loading="lazy" src="${shot.artboard}" alt=""></figure>`
              : '<figure><figcaption>Sin artboard para esta variante</figcaption></figure>'
          }
        </div>
      </section>`,
    )
    .join('\n');
  writeFileSync(
    join(out, 'index.html'),
    `<!doctype html><html lang="es"><meta charset="utf-8"><title>Revisión visual de M3</title>
<style>body{font:14px system-ui;margin:24px;background:#f2f0eb;color:#141414}h1{font-size:20px}h2{font-size:15px;margin:32px 0 8px}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}figure{margin:0}figcaption{font:12px monospace;color:#57534b;margin-bottom:4px}
img{width:100%;height:auto;border:1px solid #dad6cd;background:#fff}</style>
<h1>Revisión visual de M3 · implementación (izquierda) y artboard (derecha)</h1>${rows}`,
  );
});
