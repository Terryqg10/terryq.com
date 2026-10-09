import { expect, test } from '@playwright/test';
import { axeCheck } from './utils';

test('cabecera: h1, entradilla con la segunda frase en ink y la lista en mono', async ({
  page,
}) => {
  await page.goto('/sobre-mi');
  await expect(page.getByRole('heading', { level: 1, name: 'Hola, soy Terry' })).toBeVisible();
  await expect(page.locator('main p', { hasText: /^\/sobre-mi$/ })).toBeVisible();
  const lead = page.getByText('Soy Terry Quiñonez, desarrollador web.');
  await expect(lead).toBeVisible();
  await expect(lead.locator('span')).toContainText('me atrapaban las interfaces bien hechas');
  for (const text of [
    'Quijorna, Madrid',
    'Ingeniería del Software · UPM',
    'Next.js · TypeScript · Supabase',
  ]) {
    await expect(page.locator('header li', { hasText: text })).toBeVisible();
  }

  await page.goto('/en/about');
  await expect(page.getByRole('heading', { level: 1, name: "Hi, I'm Terry" })).toBeVisible();
  await expect(page.locator('main p', { hasText: /^\/about$/ })).toBeVisible();
});

test('sin retrato: caja con el monograma TQ y sin pie de foto (§9.6)', async ({ page }) => {
  await page.goto('/sobre-mi');
  const figure = page.locator('header figure');
  await expect(figure.locator('svg[viewBox="257 378 747 537"]')).toBeVisible();
  await expect(figure.locator('img')).toHaveCount(0);
  await expect(figure.locator('figcaption')).toHaveCount(0);
  await expect(page.getByText('Retrato ilustrado a partir de una foto real.')).toHaveCount(0);
  const box = await figure.locator('div').first().boundingBox();
  expect((box?.height ?? 0) / (box?.width ?? 1)).toBeCloseTo(1.25, 1); // 4:5
});

test('Mi historia: ficha de datos rápidos, historia y frase destacada', async ({ page }) => {
  await page.goto('/sobre-mi');
  const story = page.getByRole('region', { name: 'Mi historia' });
  const facts = story.getByRole('complementary');
  await expect(facts.getByRole('heading', { level: 2, name: 'Datos rápidos' })).toBeVisible();
  for (const [label, value] of [
    ['Ubicación', 'Quijorna, Madrid · Remoto en toda España'],
    ['Formación', 'Ingeniería del Software · UPM (en curso)'],
    ['Idiomas', 'Español (nativo) · Inglés (básico, en aprendizaje)'],
  ] as const) {
    await expect(facts.locator('dt', { hasText: label })).toBeVisible();
    await expect(facts.getByText(value)).toBeVisible();
  }
  await expect(facts.locator('li')).toHaveText([
    'Next.js',
    'TypeScript',
    'React',
    'Supabase',
    'Tailwind CSS',
    'Vercel',
  ]);

  await expect(story.getByText('De Perú a Madrid')).toBeVisible();
  await expect(story.getByText('Empecé la carrera en Perú')).toBeVisible();
  await expect(story.getByText('Lo que busco')).toBeVisible();
  const quote = story.locator('blockquote');
  await expect(quote).toContainText('Webs que cualquiera entiende a la primera');
  await expect(quote.locator('[aria-hidden="true"]')).toHaveCount(2);
  await expect(
    story.getByText('Soy constante: cuando me propongo algo, lo saco adelante.'),
  ).toBeVisible();
});

test('la ficha es sticky desde lg', async ({ page }) => {
  await page.goto('/sobre-mi');
  const position = await page
    .getByRole('region', { name: 'Mi historia' })
    .getByRole('complementary')
    .evaluate((el) => getComputedStyle(el).position);
  expect(position).toBe((page.viewportSize()?.width ?? 0) >= 1024 ? 'sticky' : 'static');
});

test('CA-5.1: sin CV no hay botón de descarga ni texto de «pendiente», y LinkedIn y GitHub ocupan la columna', async ({
  page,
}) => {
  for (const path of ['/sobre-mi', '/en/about']) {
    await page.goto(path);
    await expect(page.getByRole('link', { name: /Descargar CV|Download CV/ })).toHaveCount(0);
    await expect(page.locator('a[download]')).toHaveCount(0);
    await expect(page.getByText(/pendiente|pending/i)).toHaveCount(0);
    await expect(page.locator('main a.bg-accent, main button.bg-accent')).toHaveCount(0);
  }

  await page.goto('/sobre-mi');
  const section = page.locator('section#para-empresas');
  await expect(section.getByRole('heading', { level: 2, name: 'Para empresas' })).toBeVisible();
  await expect(section.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
    'href',
    /^https:\/\/www\.linkedin\.com\/in\//,
  );
  await expect(section.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/Terryqg10',
  );
  await expect(section.getByRole('link', { name: 'mis proyectos' })).toHaveAttribute(
    'href',
    '/trabajos',
  );
  await expect(section.getByText('Tengo las cualidades y las habilidades')).toBeVisible();
});

test('Para empresas en inglés: ancla #for-companies y enlace a /en/work', async ({ page }) => {
  await page.goto('/en/about');
  const section = page.locator('section#for-companies');
  await expect(section.getByRole('heading', { level: 2, name: 'For companies' })).toBeVisible();
  await expect(section.getByRole('link', { name: 'my projects' })).toHaveAttribute(
    'href',
    '/en/work',
  );
  await expect(section.locator('p', { hasText: /^#for-companies$/ })).toBeVisible();
});

test('con un CV de prueba (fixture de /ui) aparece el botón primary con download', async ({
  page,
}) => {
  await page.goto('/ui');
  const fixture = page.locator('[data-fixture="about"]');
  const cv = fixture.getByRole('link', { name: 'Descargar CV' });
  await expect(cv).toHaveAttribute('href', '/cv/prueba.pdf');
  await expect(cv).toHaveAttribute('download', 'prueba.pdf');
  await expect(cv).toHaveClass(/bg-accent/);
  await expect(fixture.locator('a[download]')).toHaveCount(1);
});

test('con un retrato de prueba (fixture de /ui) se muestra la imagen y su pie', async ({
  page,
}) => {
  await page.goto('/ui');
  const figure = page.locator('[data-fixture="about"] header figure');
  await expect(figure.locator('img')).toHaveCount(1);
  await expect(figure.getByText('Retrato ilustrado a partir de una foto real.')).toBeVisible();
  await expect(figure.locator('svg[viewBox="257 378 747 537"]')).toHaveCount(0);
});

test('CA-G6: sin scroll horizontal a 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/sobre-mi', '/en/about']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

for (const path of ['/sobre-mi', '/en/about']) {
  for (const scheme of ['light', 'dark'] as const) {
    test(`axe: ${path} en modo ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      await axeCheck(page, { ignore: ['document-title'] }); // sin <title> hasta T30
    });
  }
}
