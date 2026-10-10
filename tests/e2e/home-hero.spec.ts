import { expect, test, type Page } from '@playwright/test';
import { axeCheck } from './utils';

const desktopOnly = ({ viewport }: { viewport: { width: number } | null }) =>
  (viewport?.width ?? 0) < 1024;

/** Cuánto sobresale un elemento por debajo del viewport (≤ 0 si cabe entero). */
const overflowBelow = async (page: Page, selector: string) => {
  const box = await page.locator(selector).first().boundingBox();
  const height = page.viewportSize()?.height ?? 0;
  expect(box, selector).not.toBeNull();
  return (box?.y ?? 0) + (box?.height ?? 0) - height;
};

test('O1: h1, subtítulo, CTA principal y fila de prueba caben sin hacer scroll', async ({
  page,
}) => {
  // O1 se mide en 1440×900 y 390×844 (el iPhone 14 de Playwright trae un viewport más bajo).
  if ((page.viewportSize()?.width ?? 0) < 1024)
    await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const hero = 'section[aria-labelledby="hero-t"]';
  for (const part of [
    `${hero} h1`,
    `${hero} p.max-w-150`,
    `${hero} a[href="/trabajos"]`,
    `${hero} ul`,
  ]) {
    expect(await overflowBelow(page, part), part).toBeLessThanOrEqual(0);
  }
});

test('el titular tiene un único h1 con el nombre accesible sin los signos < >', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1, name: 'Desarrollador web' })).toBeVisible();
  await expect(page.locator('h1 [aria-hidden="true"]')).toHaveCount(2);

  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1, name: 'Web developer' })).toBeVisible();
});

test('sin avatar solo hay la línea de texto, sin hueco', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('section[aria-labelledby="hero-t"]');
  await expect(hero.locator('img[width="52"]')).toHaveCount(0);
  const intro = hero.getByText('Hola, soy Terry Quiñonez · Madrid');
  await expect(intro).toBeVisible();
  const [introBox, h1Box] = await Promise.all([
    intro.boundingBox(),
    hero.locator('h1').boundingBox(),
  ]);
  expect(Math.abs((introBox?.x ?? 0) - (h1Box?.x ?? 99))).toBeLessThan(1);
});

test('los CTAs llevan al sitio correcto y solo hay un botón primary', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('section[aria-labelledby="hero-t"]');
  await expect(hero.getByRole('link', { name: 'Ver trabajos' })).toHaveAttribute(
    'href',
    '/trabajos',
  );
  const github = hero.getByRole('link', { name: /GitHub/ });
  await expect(github).toHaveAttribute('href', 'https://github.com/Terryqg10');
  await expect(github).toContainText('(sitio externo)');
  await expect(hero.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
    'href',
    /^https:\/\/www\.linkedin\.com\/in\//,
  );
  await expect(page.locator('main a.bg-accent')).toHaveCount(1);

  await page.goto('/en');
  await expect(
    page.locator('section[aria-labelledby="hero-t"]').getByRole('link', { name: 'See my work' }),
  ).toHaveAttribute('href', '/en/work');
});

test('la fila de prueba y el pie de la captura llevan su texto', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('section[aria-labelledby="hero-t"]');
  for (const text of [
    'Proyectos en producción',
    'Next.js · TypeScript · Supabase',
    'Madrid · Remoto',
  ]) {
    await expect(hero.getByText(text)).toBeVisible();
  }
  await expect(hero.getByText('Online · HB Construcciones · 2026')).toBeVisible();
  const open = hero.getByRole('link', { name: /Abrir web/ });
  await expect(open).toHaveAttribute('href', 'https://hb-construcciones.vercel.app/');
  await expect(open).toContainText('(sitio externo)');
});

test('la imagen del navegador es la de mayor prioridad (LCP)', async ({ page }) => {
  await page.goto('/');
  const image = page.locator('section[aria-labelledby="hero-t"] figure img').first();
  await expect(image).toHaveAttribute('fetchpriority', 'high');
  expect(await image.getAttribute('loading')).not.toBe('lazy');
});

test('el marco de teléfono solo aparece desde lg y la captura baja debajo del texto en móvil', async ({
  page,
}) => {
  await page.goto('/');
  const figure = page.locator('section[aria-labelledby="hero-t"] figure');
  const phone = figure.locator('img[alt*="móvil"]');
  const text = page.locator('section[aria-labelledby="hero-t"] h1');
  const [figureBox, textBox] = await Promise.all([figure.boundingBox(), text.boundingBox()]);
  if ((page.viewportSize()?.width ?? 0) >= 1024) {
    await expect(phone).toBeVisible();
    expect(figureBox?.x ?? 0).toBeGreaterThan(textBox?.x ?? 0);
  } else {
    await expect(phone).toBeHidden();
    expect(figureBox?.y ?? 0).toBeGreaterThan((textBox?.y ?? 0) + (textBox?.height ?? 0));
  }
});

test('con movimiento reducido el titular se ve en su sitio, sin animar', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  for (const line of await page.locator('h1 .tq-rise').all()) {
    expect(await line.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
    expect(await line.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  }
  await context.close();
});

test.describe('captura del hero en escritorio', () => {
  test.skip(desktopOnly, 'la inclinación solo existe desde lg');

  test('descansa inclinada y el ratón la gira un poco más', async ({ page }) => {
    await page.goto('/');
    const showcase = page.locator('.tq-showcase');
    const rest = await showcase.evaluate((el) => getComputedStyle(el).transform);
    expect(rest).not.toBe('none');

    const tilt = page.locator('.tq-showcase-tilt');
    const box = await showcase.boundingBox();
    await page.mouse.move((box?.x ?? 0) + (box?.width ?? 0) * 0.9, (box?.y ?? 0) + 20);
    await expect
      .poll(() => tilt.evaluate((el) => el.style.transform))
      .toMatch(/perspective\(1200px\) rotateY\((?!0\.000)/);

    await page.mouse.move(2, 2); // sale de la captura: vuelve al reposo
    await expect
      .poll(() => tilt.evaluate((el) => el.style.transform))
      .toMatch(/rotateY\(-?0\.0\d*deg\) rotateX\(-?0\.0\d*deg\)/);
  });

  test('con el scroll se aplana y escala hasta 1', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'animation-timeline: scroll() solo en Chromium');
    await page.goto('/');
    const showcase = page.locator('.tq-showcase');
    const atTop = await showcase.evaluate((el) => getComputedStyle(el).transform);
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect
      .poll(() => showcase.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(atTop);
  });
});

for (const [path, scheme] of [
  ['/', 'light'],
  ['/', 'dark'],
  ['/en', 'light'],
  ['/en', 'dark'],
] as const) {
  test(`axe: ${path} en modo ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto(path);
    // Sin <title> hasta T30 (metadata): es lo único que se ignora.
    await axeCheck(page);
  });
}

test('los enlaces externos no repiten la flecha ↗', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('section[aria-labelledby="hero-t"]');
  for (const name of [/GitHub/, /LinkedIn/, /Abrir web/]) {
    const text = await hero.getByRole('link', { name }).first().innerText();
    expect(text.match(/↗/g)?.length, text).toBe(1);
  }
});
