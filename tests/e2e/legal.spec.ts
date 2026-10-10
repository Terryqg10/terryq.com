import { expect, test } from '@playwright/test';
import { axeCheck } from './utils';

const pages = [
  {
    path: '/aviso-legal',
    lang: 'es',
    label: /^\/aviso-legal$/,
    h1: 'Aviso legal',
    updated: /^Última actualización: 10 de octubre de 2026$/,
    h2: [
      'Titular',
      'Objeto',
      'Propiedad intelectual',
      'Enlaces externos',
      'Responsabilidad',
      'Legislación aplicable',
    ],
  },
  {
    path: '/privacidad',
    lang: 'es',
    label: /^\/privacidad$/,
    h1: 'Privacidad',
    updated: /^Última actualización: 10 de octubre de 2026$/,
    h2: ['1. Responsable', '2. Qué datos trato', '6. Con quién los comparto', '8. Cookies'],
  },
  {
    path: '/en/legal-notice',
    lang: 'en',
    label: /^\/legal-notice$/,
    h1: 'Legal notice',
    updated: /^Last updated: October 10, 2026$/,
    h2: [
      'Owner',
      'Purpose',
      'Intellectual property',
      'External links',
      'Liability',
      'Governing law',
    ],
  },
  {
    path: '/en/privacy',
    lang: 'en',
    label: /^\/privacy$/,
    h1: 'Privacy',
    updated: /^Last updated: October 10, 2026$/,
    h2: ['1. Controller', '2. What data I process', '6. Who I share it with', '8. Cookies'],
  },
] as const;

for (const p of pages) {
  test(`${p.path}: cabecera, fecha, secciones y accesibilidad`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page.locator('html')).toHaveAttribute('lang', p.lang);
    await expect(page.getByRole('heading', { level: 1, name: p.h1 })).toBeVisible();
    await expect(page.locator('main p', { hasText: p.label }).first()).toBeVisible();
    await expect(page.locator('main p', { hasText: p.updated })).toBeVisible();
    for (const name of p.h2) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    }
    // El email sale de site.ts y no hay NIF mientras `site.legal.nif` sea null.
    await expect(page.locator('main a[href="mailto:contacto@terryq.com"]').first()).toBeVisible();
    await expect(page.getByText('NIF')).toHaveCount(0);
    // Nada de marcas de contenido pendiente (spec §9.6).
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/\[prop|pendiente|\[Nombre|TODO/i);
    await axeCheck(page);
  });
}

test('en inglés lleva el aviso de traducción de cortesía y en español no', async ({ page }) => {
  const notice = 'This is a courtesy translation. The Spanish version prevails.';
  for (const path of ['/en/legal-notice', '/en/privacy']) {
    await page.goto(path);
    await expect(page.getByText(notice)).toBeVisible();
  }
  for (const path of ['/aviso-legal', '/privacidad']) {
    await page.goto(path);
    await expect(page.getByText(/traducción de cortesía/i)).toHaveCount(0);
  }
});

test('la política declara que no hay cookies y las páginas no las ponen', async ({ page }) => {
  const response = await page.goto('/privacidad');
  expect(response?.headers()['set-cookie']).toBeUndefined();
  await expect(page.getByText('Esta web no usa cookies.')).toBeVisible();
  expect(await page.evaluate(() => document.cookie)).toBe('');
});

test('la casilla del formulario enlaza a la política del idioma y esa página existe', async ({
  page,
}) => {
  for (const [contact, privacy, h1] of [
    ['/contacto', '/privacidad', 'Privacidad'],
    ['/en/contact', '/en/privacy', 'Privacy'],
  ] as const) {
    await page.goto(contact);
    const link = page.getByRole('checkbox').locator('xpath=../..').getByRole('link');
    await expect(link).toHaveAttribute('href', privacy);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${privacy}$`));
    await expect(page.getByRole('heading', { level: 1, name: h1 })).toBeVisible();
  }
});

test('el pie enlaza a las dos páginas legales', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('link', { name: 'Aviso legal' })).toHaveAttribute(
    'href',
    '/aviso-legal',
  );
  await expect(footer.getByRole('link', { name: 'Privacidad' })).toHaveAttribute(
    'href',
    '/privacidad',
  );
});
