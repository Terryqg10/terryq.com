import { expect, test, type Page } from '@playwright/test';

const origin = 'http://localhost:3100'; // NEXT_PUBLIC_SITE_URL del webServer de Playwright
// Next escribe la portada sin la barra final.
const absolute = (path: string) => (path === '/' ? origin : `${origin}${path}`);

type Case = {
  path: string;
  title: string | RegExp;
  description?: string;
  canonical: string;
  es: string;
  en: string;
  lang: 'es' | 'en';
};

const cases: readonly Case[] = [
  {
    path: '/',
    lang: 'es',
    title: 'Terry Quiñonez · Diseño y desarrollo web en Madrid',
    description:
      'Webs rápidas y claras para autónomos y pequeñas empresas, pensadas para conseguir contactos. Presupuesto cerrado en 24 h.',
    canonical: '/',
    es: '/',
    en: '/en',
  },
  {
    path: '/en',
    lang: 'en',
    title: 'Terry Quiñonez · Web design and development in Madrid',
    description:
      'Fast, clear websites for freelancers and small businesses, built to bring in enquiries. Fixed quote within 24 hours.',
    canonical: '/en',
    es: '/',
    en: '/en',
  },
  {
    path: '/trabajos',
    lang: 'es',
    title: 'Trabajos · Terry Quiñonez',
    description:
      'Webs para clientes y productos propios: HB Construcciones, Zona F y Finanzas Personales.',
    canonical: '/trabajos',
    es: '/trabajos',
    en: '/en/work',
  },
  {
    path: '/en/work',
    lang: 'en',
    title: 'Work · Terry Quiñonez',
    description:
      'Client websites and own products: HB Construcciones, Zona F and Finanzas Personales.',
    canonical: '/en/work',
    es: '/trabajos',
    en: '/en/work',
  },
  {
    path: '/servicios',
    lang: 'es',
    title: 'Servicios de diseño web · Terry Quiñonez',
    description:
      'Landing pages, webs corporativas, aplicaciones a medida, logos y mantenimiento web. Cómo trabajo y cómo uso la IA.',
    canonical: '/servicios',
    es: '/servicios',
    en: '/en/services',
  },
  {
    path: '/en/about',
    lang: 'en',
    title: 'About · Terry Quiñonez',
    description: 'Web developer and Software Engineering student at UPM. Quijorna, Madrid.',
    canonical: '/en/about',
    es: '/sobre-mi',
    en: '/en/about',
  },
  {
    path: '/contacto',
    lang: 'es',
    title: 'Contacto · Terry Quiñonez',
    description: 'Cuéntame tu proyecto o tu propuesta y te respondo en 24 h laborables.',
    canonical: '/contacto',
    es: '/contacto',
    en: '/en/contact',
  },
  {
    path: '/en/contact',
    lang: 'en',
    title: 'Contact · Terry Quiñonez',
    description: "Tell me about your project or your offer and I'll reply within 24 working hours.",
    canonical: '/en/contact',
    es: '/contacto',
    en: '/en/contact',
  },
  {
    path: '/aviso-legal',
    lang: 'es',
    title: 'Aviso legal · Terry Quiñonez',
    canonical: '/aviso-legal',
    es: '/aviso-legal',
    en: '/en/legal-notice',
  },
  {
    path: '/en/privacy',
    lang: 'en',
    title: 'Privacy · Terry Quiñonez',
    canonical: '/en/privacy',
    es: '/privacidad',
    en: '/en/privacy',
  },
  {
    path: '/trabajos/zona-f',
    lang: 'es',
    title: /^Zona F · .+ · Terry Quiñonez$/,
    canonical: '/trabajos/zona-f',
    es: '/trabajos/zona-f',
    en: '/en/work/zona-f',
  },
  {
    path: '/en/work/hb-construcciones',
    lang: 'en',
    title: 'HB Construcciones · Case study · Terry Quiñonez',
    canonical: '/en/work/hb-construcciones',
    es: '/trabajos/hb-construcciones',
    en: '/en/work/hb-construcciones',
  },
];

const attr = (page: Page, selector: string, name: string) =>
  page.locator(selector).first().getAttribute(name);

for (const c of cases) {
  test(`${c.path}: title, description, canonical, alternates y Open Graph`, async ({ page }) => {
    await page.goto(c.path);
    await expect(page).toHaveTitle(c.title);
    const title = await page.title();

    if (c.description) {
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        c.description,
      );
    }
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      absolute(c.canonical),
    );

    const alternates = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((nodes) =>
        nodes.map((node) => [node.getAttribute('hreflang'), node.getAttribute('href')]),
      );
    expect(Object.fromEntries(alternates)).toEqual({
      es: absolute(c.es),
      en: absolute(c.en),
      'x-default': absolute(c.es),
    });

    expect(await attr(page, 'meta[property="og:title"]', 'content')).toBe(title);
    expect(await attr(page, 'meta[property="og:type"]', 'content')).toBe('website');
    expect(await attr(page, 'meta[property="og:locale"]', 'content')).toBe(
      c.lang === 'es' ? 'es_ES' : 'en_GB',
    );
    expect(await attr(page, 'meta[property="og:site_name"]', 'content')).toBe('Terry Quiñonez');
    expect(await attr(page, 'meta[property="og:url"]', 'content')).toBe(absolute(c.canonical));
    expect(await attr(page, 'meta[name="twitter:card"]', 'content')).toBe('summary_large_image');
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  });
}

test('los casos recortan el título a ~60 caracteres', async ({ page }) => {
  for (const slug of ['hb-construcciones', 'zona-f', 'finanzas-personales']) {
    for (const prefix of ['/trabajos', '/en/work']) {
      await page.goto(`${prefix}/${slug}`);
      expect((await page.title()).length, `${prefix}/${slug}`).toBeLessThanOrEqual(64);
    }
  }
});

test('la 404 tiene su título, está en el idioma de la URL y es noindex', async ({ page }) => {
  await page.goto('/loquesea');
  await expect(page).toHaveTitle('Página no encontrada · Terry Quiñonez');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await page.goto('/en/loquesea');
  await expect(page).toHaveTitle('Page not found · Terry Quiñonez');
});

test('todas las páginas indexables tienen título único', async ({ page }) => {
  const titles: string[] = [];
  for (const c of cases) {
    await page.goto(c.path);
    titles.push(await page.title());
  }
  expect(new Set(titles).size).toBe(titles.length);
});
