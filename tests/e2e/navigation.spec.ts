import { expect, test, type Page } from '@playwright/test';
import { routes } from './utils';

/** El selector de idioma visible (hay uno en el menú de escritorio y otro en el móvil). */
const languageSwitch = (page: Page) => page.locator('a[hreflang]:visible').first();

test('el logo lleva a la portada del idioma', async ({ page }) => {
  await page.goto('/servicios');
  await page.locator('header').getByRole('link', { name: 'Terry Quiñonez, ir al inicio' }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto('/en/services');
  await page
    .locator('header')
    .getByRole('link', { name: 'Terry Quiñonez, go to home page' })
    .click();
  await expect(page).toHaveURL(/\/en$/);
});

test('el selector de idioma lleva a la ruta equivalente en todas las rutas de §5.2', async ({
  page,
}) => {
  for (const [index, es] of routes.es.entries()) {
    const en = routes.en[index] as string;

    await page.goto(es);
    const toEnglish = languageSwitch(page);
    await expect(toEnglish).toHaveAttribute('hreflang', 'en');
    await expect(toEnglish).toHaveAttribute('lang', 'en');
    await expect(toEnglish).toHaveAccessibleName('ES / EN: cambiar idioma a inglés');
    await toEnglish.click();
    await expect(page, `${es} → ${en}`).toHaveURL(new RegExp(`${en}$`));

    const toSpanish = languageSwitch(page);
    await expect(toSpanish).toHaveAccessibleName('ES / EN: switch language to Spanish');
    await toSpanish.click();
    await expect(page, `${en} → ${es}`).toHaveURL(new RegExp(`${es === '/' ? '' : es}/?$`));
  }
});

// WebKit no pasa el foco a los enlaces con Tab salvo que se active en el sistema.
test('el primer Tab enfoca el enlace de saltar al contenido y lo lleva al main', async ({
  page,
  browserName,
}) => {
  test.skip(browserName === 'webkit', 'WebKit no enfoca enlaces con Tab por defecto');
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Saltar al contenido' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await expect(skip).toHaveAttribute('href', '#contenido');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#contenido$/);
  await expect(page.locator('main#contenido')).toBeAttached();
});

test('el enlace de saltar al contenido está en inglés en /en', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'WebKit no enfoca enlaces con Tab por defecto');
  await page.goto('/en');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
});

test('los enlaces del pie miden al menos 44px de alto', async ({ page }) => {
  await page.goto('/');
  const links = page.locator('footer a');
  const count = await links.count();
  expect(count).toBeGreaterThanOrEqual(7);
  for (let index = 0; index < count; index++) {
    const box = await links.nth(index).boundingBox();
    const text = (await links.nth(index).innerText()).trim();
    expect(box?.height ?? 0, text).toBeGreaterThanOrEqual(43.5);
  }
});

test('el pie enlaza al aviso legal y a la privacidad de cada idioma y al repositorio', async ({
  page,
}) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer.getByRole('link', { name: 'Aviso legal' })).toHaveAttribute(
    'href',
    '/aviso-legal',
  );
  await expect(footer.getByRole('link', { name: 'Privacidad' })).toHaveAttribute(
    'href',
    '/privacidad',
  );
  await expect(footer.getByRole('link', { name: /Código en GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/Terryqg10/terryq.com',
  );
  await expect(footer.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute(
    'href',
    /^https:\/\/wa\.me\/34614312673\?text=Hola%20Terry/,
  );

  await page.goto('/en');
  await expect(page.locator('footer').getByRole('link', { name: 'Legal notice' })).toHaveAttribute(
    'href',
    '/en/legal-notice',
  );
  await expect(page.locator('footer').getByRole('link', { name: /WhatsApp/ })).toHaveAttribute(
    'href',
    /text=Hi%20Terry/,
  );
});

test.describe('menú de escritorio', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1024, 'solo desde lg');

  test('marca la página actual con aria-current y el botón Contacto pasa a primary', async ({
    page,
  }) => {
    await page.goto('/servicios');
    const nav = page.getByRole('navigation', { name: 'Principal' });
    await expect(nav.getByRole('link', { name: 'Servicios' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(nav.getByRole('link', { name: 'Trabajos' })).not.toHaveAttribute('aria-current');
    await expect(nav.getByRole('link', { name: 'Contacto' })).not.toHaveAttribute('aria-current');

    await page.goto('/contacto');
    const contact = page.getByRole('navigation', { name: 'Principal' }).getByRole('link', {
      name: 'Contacto',
    });
    await expect(contact).toHaveAttribute('aria-current', 'page');
    await expect(contact).toHaveClass(/bg-accent/);
  });

  test('en un caso, Trabajos queda marcado como sección actual', async ({ page }) => {
    await page.goto('/trabajos/zona-f');
    await expect(
      page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Trabajos' }),
    ).toHaveAttribute('aria-current', 'true');
  });

  test('GitHub se abre en otra pestaña y avisa de que es externo', async ({ page }) => {
    await page.goto('/');
    const github = page
      .getByRole('navigation', { name: 'Principal' })
      .getByRole('link', { name: /GitHub/ });
    await expect(github).toHaveAttribute('target', '_blank');
    await expect(github).toContainText('(sitio externo)');
  });

  test('en inglés el menú y el nombre del selector están en inglés', async ({ page }) => {
    await page.goto('/en');
    const nav = page.getByRole('navigation', { name: 'Main' });
    for (const name of ['Work', 'Services', 'About', 'Contact']) {
      await expect(nav.getByRole('link', { name })).toBeVisible();
    }
  });
});

test.describe('móvil', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1024, 'solo por debajo de lg');

  test('el menú de escritorio no se ve y el selector de idioma sí', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Principal' })).toBeHidden();
    await expect(languageSwitch(page)).toBeVisible();
  });
});
