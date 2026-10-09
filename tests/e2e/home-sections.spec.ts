import { expect, test } from '@playwright/test';
import { axeCheck } from './utils';

const slugs = ['hb-construcciones', 'zona-f', 'finanzas-personales'];

test('el orden de la portada sin reseñas es Hero → Trabajos → Servicios → Sobre mí → ¿Hablamos?', async ({
  page,
}) => {
  await page.goto('/');
  const headings = await page
    .locator('main h1, main h2')
    .evaluateAll((nodes) => nodes.map((node) => node.textContent?.replace(/\s+/g, ' ').trim()));
  expect(headings).toEqual([
    '<Desarrollador web>',
    'Trabajos recientes',
    'Qué puedo hacer por tu negocio',
    'Sobre mí',
    '¿Hablamos?',
  ]);
});

test('sin reseñas no hay sección /opiniones ni queda hueco', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#reviews-t')).toHaveCount(0);
  await expect(page.getByText('/opiniones')).toHaveCount(0);
  await expect(page.getByText('Lo que dicen mis clientes')).toHaveCount(0);

  // Trabajos y Servicios quedan pegados. Se mide con offsetTop: no le afecta el desplazamiento
  // de las apariciones.
  const gap = await page.evaluate(() => {
    const work = document.querySelector<HTMLElement>('section[aria-labelledby="work-t"]');
    const services = document.querySelector<HTMLElement>('section[aria-labelledby="serv-t"]');
    return (services?.offsetTop ?? 0) - ((work?.offsetTop ?? 0) + (work?.offsetHeight ?? 0));
  });
  expect(gap).toBeLessThanOrEqual(1);
});

test('cada tarjeta de trabajo es un único enlace al caso, en el orden del índice', async ({
  page,
}) => {
  await page.goto('/');
  const cards = page.locator('section[aria-labelledby="work-t"] > ul > li');
  await expect(cards).toHaveCount(3);
  for (const [index, slug] of slugs.entries()) {
    const card = cards.nth(index);
    await expect(card.locator('a')).toHaveCount(1); // sin enlaces anidados
    await expect(card.locator('a')).toHaveAttribute('href', `/trabajos/${slug}`);
    await expect(card.locator('a h3')).toHaveCount(1);
    await expect(card.locator('a img')).toHaveCount(1);
    await expect(card).toContainText('Ver caso →');
    await expect(card).toContainText('2026');
  }
  await expect(cards.nth(0)).toContainText('HB Construcciones');
  await expect(cards.nth(0)).toContainText('Online');
  await expect(cards.nth(0)).toContainText('Next.js · Tailwind · Vercel');
  await expect(cards.nth(1)).toContainText('Demo');
  await expect(cards.nth(2)).toContainText('Finanzas Personales');
});

test('las secciones llevan data-reveal y el hero no (CA-G9)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section[aria-labelledby="hero-t"]')).not.toHaveAttribute(
    'data-reveal',
    /.*/,
  );
  await expect(page.locator('main section[data-reveal]')).toHaveCount(4);
});

test('Servicios: bloque principal con sus 3 filas y las dos tarjetas de «También me encargo de…»', async ({
  page,
}) => {
  await page.goto('/');
  const section = page.locator('section[aria-labelledby="serv-t"]');
  await expect(section.getByText('Lo principal')).toBeVisible();
  await expect(section.getByRole('heading', { level: 3, name: 'Web', exact: true })).toBeVisible();
  for (const row of ['Landing page', 'Web corporativa', 'Aplicación a medida']) {
    await expect(section.locator('dt', { hasText: row })).toBeVisible();
  }
  await expect(section.getByText('También me encargo de…')).toBeVisible();
  await expect(
    section.getByRole('heading', { level: 3, name: 'Tu imagen de marca' }),
  ).toBeVisible();
  await expect(
    section.getByRole('heading', { level: 3, name: 'Mantenimiento y hosting' }),
  ).toBeVisible();
  await expect(section.getByRole('link', { name: 'Ver servicios →' })).toHaveAttribute(
    'href',
    '/servicios',
  );
});

test('Sobre mí sin avatar: caja con el monograma TQ y la ficha', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('section[aria-labelledby="about-t"]');
  await expect(section.locator('svg[viewBox="257 378 747 537"]')).toBeVisible();
  await expect(section.locator('img')).toHaveCount(0);
  await expect(section.locator('dt', { hasText: 'Ubicación' })).toBeVisible();
  await expect(section.getByText('Quijorna, Madrid · Remoto en toda España')).toBeVisible();
  await expect(section.getByText('Ingeniería del Software · UPM (en curso)')).toBeVisible();
  await expect(section.getByRole('link', { name: 'Conóceme →' })).toHaveAttribute(
    'href',
    '/sobre-mi',
  );
});

test('¿Hablamos?: email, WhatsApp con el mensaje y plazo de respuesta, sin botón primary', async ({
  page,
}) => {
  await page.goto('/');
  const section = page.locator('section[aria-labelledby="cta-t"]');
  await expect(section.getByRole('link', { name: 'contacto@terryq.com' })).toHaveAttribute(
    'href',
    'mailto:contacto@terryq.com',
  );
  await expect(section.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute(
    'href',
    /^https:\/\/wa\.me\/34614312673\?text=Hola%20Terry/,
  );
  await expect(section.getByText('Respondo en 24 h laborables')).toBeVisible();
  await expect(section.locator('a.bg-accent')).toHaveCount(0);
});

test('en inglés: mismas secciones con las etiquetas /work, /services, /about y /contact', async ({
  page,
}) => {
  await page.goto('/en');
  const headings = await page
    .locator('main h1, main h2')
    .evaluateAll((nodes) => nodes.map((node) => node.textContent?.replace(/\s+/g, ' ').trim()));
  expect(headings).toEqual([
    '<Web developer>',
    'Recent work',
    'What I can do for your business',
    'About me',
    'Shall we talk?',
  ]);
  for (const label of ['/work', '/services', '/about', '/contact']) {
    await expect(page.locator('main p', { hasText: new RegExp(`^${label}$`) })).toBeVisible();
  }
  await expect(page.getByText('/reviews')).toHaveCount(0);
  const cards = page.locator('section[aria-labelledby="work-t"] > ul > li a');
  await expect(cards.nth(0)).toHaveAttribute('href', '/en/work/hb-construcciones');
  await expect(page.getByText('View case study →').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'See all work →' })).toHaveAttribute(
    'href',
    '/en/work',
  );
  await expect(page.getByText('I reply within 24 working hours')).toBeVisible();
});

test('CA-G6: a 390px no hay scroll horizontal de la página', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/en']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test('con reseñas (fixture de /ui) la sección aparece y el carrusel es enfocable', async ({
  page,
}) => {
  await page.goto('/ui');
  const section = page.locator('section[aria-labelledby="reviews-t"]');
  await expect(
    section.getByRole('heading', { level: 2, name: 'Lo que dicen mis clientes' }),
  ).toBeVisible();
  await expect(section.getByText('Opiniones reales, verificables en Google.')).toBeVisible();
  await expect(section.getByText('Opinión tras revisar la demo')).toBeVisible();
  // `googleReviewsUrl` es null: no aparece «Ver todas en Google».
  await expect(section.getByText('Ver todas en Google')).toHaveCount(0);

  const region = section.getByRole('region', {
    name: 'Opiniones de clientes, desliza para ver más',
  });
  await expect(region).toHaveAttribute('tabindex', '0');
  await region.focus();
  await expect(region).toBeFocused();
  await expect(region.locator('li')).toHaveCount(3);
  await expect(region.locator('blockquote[lang="en"]')).toHaveCount(1);
  await expect(region.locator('blockquote[lang="es"]')).toHaveCount(2);
  await expect(region.getByRole('link', { name: 'Ver proyecto' })).toHaveCount(2);
});

test('en móvil el carrusel de reseñas tiene su propio scroll horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/ui');
  const region = page.getByRole('region', { name: 'Opiniones de clientes, desliza para ver más' });
  const [scroll, client] = await region.evaluate((el) => [el.scrollWidth, el.clientWidth]);
  expect(scroll).toBeGreaterThan(client ?? 0);
  const pageOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(pageOverflow).toBeLessThanOrEqual(0);
});

for (const path of ['/', '/en']) {
  for (const scheme of ['light', 'dark'] as const) {
    test(`axe: portada completa ${path} en modo ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      await axeCheck(page, { ignore: ['document-title'] }); // sin <title> hasta T30
    });
  }
}
