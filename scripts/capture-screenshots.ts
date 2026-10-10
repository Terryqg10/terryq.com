import { chromium, type Browser, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

/**
 * Capturas definitivas de los proyectos (spec §9.5, T35): `pnpm screenshots [nombre…]`.
 * Abre las webs publicadas a 2x, sin barra de desplazamiento, y guarda cada captura en WebP en
 * `src/content/work/<slug>/images/`. Sin argumentos hace todas. Terry revisa cada una antes de subirla.
 *
 * Zona F: solo la interfaz (partidos en vivo, cuotas y boleto). Nunca el hero ni las promociones
 * con jugadores, escudos o patrocinadores. Finanzas: modo demo, con datos de ejemplo.
 */
const root = new URL('../src/content/work/', import.meta.url);

const desktop = { width: 1440, height: 900 } as const;
const phone = { width: 375, height: 812 } as const;

type Shot = {
  name: string;
  slug: string;
  url: string;
  viewport: { width: number; height: number };
  /** Deja la página lista para la captura (cookies, demo, desplazamiento…). */
  prepare?: (page: Page) => Promise<void>;
};

const settle = (page: Page) => page.waitForTimeout(1500);

/** Zona F: salta el hero y las promociones (jugadores, escudos) hasta «En vivo ahora». */
async function scrollLiveMatchesIntoView(page: Page, offset: number) {
  await page.getByRole('heading', { name: 'En vivo ahora' }).first().waitFor();
  await page.evaluate((offset) => {
    const heading = [...document.querySelectorAll('h3')].find((h) =>
      /en vivo ahora/i.test(h.textContent ?? ''),
    );
    window.scrollBy(0, (heading?.getBoundingClientRect().top ?? 0) - offset);
  }, offset);
}

const shots: Shot[] = [
  {
    name: 'hb-portada-escritorio',
    slug: 'hb-construcciones',
    url: 'https://hb-construcciones.vercel.app/',
    viewport: desktop,
  },
  {
    name: 'hb-movil',
    slug: 'hb-construcciones',
    url: 'https://hb-construcciones.vercel.app/',
    viewport: phone,
  },
  {
    name: 'hb-trabajos-escritorio',
    slug: 'hb-construcciones',
    url: 'https://hb-construcciones.vercel.app/',
    viewport: desktop,
    prepare: async (page) => {
      const gallery = page.locator('#galeria');
      await gallery.scrollIntoViewIfNeeded();
      // La cabecera de la galería arriba del todo, con un margen.
      await page.evaluate(() => {
        const top = document.querySelector('#galeria h2')?.getBoundingClientRect().top ?? 0;
        window.scrollBy(0, top - 112);
      });
    },
  },
  {
    name: 'zonaf-escritorio',
    slug: 'zona-f',
    url: 'https://zona-f.vercel.app/',
    viewport: desktop,
    prepare: async (page) => {
      await scrollLiveMatchesIntoView(page, 90);
      // Una selección en el boleto: el primer «Local» de la tarjeta de Alianza Lima.
      await page
        .getByRole('button', { name: /Local\s*2\.35/ })
        .last()
        .click();
      await page.getByText('Ganancia potencial').first().waitFor();
    },
  },
  {
    name: 'zonaf-movil',
    slug: 'zona-f',
    url: 'https://zona-f.vercel.app/',
    viewport: phone,
    prepare: (page) => scrollLiveMatchesIntoView(page, 130),
  },
  {
    name: 'finanzas-escritorio',
    slug: 'finanzas-personales',
    url: 'https://finanzas-personales-roan.vercel.app/login',
    viewport: desktop,
    prepare: async (page) => {
      await page.getByRole('button', { name: 'Probar la demo' }).click();
      await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 30_000 });
      await page.getByText('Modo demo').first().waitFor();
    },
  },
];

async function capture(browser: Browser, shot: Shot) {
  const context = await browser.newContext({
    viewport: shot.viewport,
    deviceScaleFactor: 2,
    locale: 'es-ES',
    reducedMotion: 'reduce',
    isMobile: shot.viewport.width < 500,
  });
  const page = await context.newPage();
  try {
    await page.goto(shot.url, { waitUntil: 'networkidle' });
    await page.addStyleTag({
      content: 'html{scrollbar-width:none}::-webkit-scrollbar{display:none}',
    });
    await shot.prepare?.(page);
    await settle(page);
    const png = await page.screenshot({ type: 'png' });
    const target = new URL(`${shot.slug}/images/${shot.name}.webp`, root);
    mkdirSync(fileURLToPath(new URL('.', target)), { recursive: true });
    const info = await sharp(png).webp({ quality: 88 }).toFile(fileURLToPath(target));
    console.log(`${shot.name}: ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`);
  } finally {
    await context.close();
  }
}

const wanted = process.argv.slice(2);
const selected = wanted.length ? shots.filter((shot) => wanted.includes(shot.name)) : shots;
if (!selected.length) throw new Error(`Ninguna captura se llama ${wanted.join(', ')}`);

const browser = await chromium.launch({ args: ['--hide-scrollbars'] });
let failed = 0;
for (const shot of selected) {
  try {
    await capture(browser, shot);
  } catch (error) {
    failed += 1;
    console.error(`${shot.name}: FALLÓ — ${error instanceof Error ? error.message : error}`);
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
