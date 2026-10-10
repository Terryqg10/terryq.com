import { expect, test, type Page } from '@playwright/test';
import { axeCheck } from './utils';

const anchors = {
  es: [
    ['#web', 'Web'],
    ['#marca', 'Marca y mantenimiento'],
    ['#preguntas', 'Preguntas frecuentes'],
    ['#proceso', 'Cómo trabajo'],
    ['#ia', 'Cómo uso la IA'],
  ],
  en: [
    ['#websites', 'Websites'],
    ['#brand', 'Brand and maintenance'],
    ['#faq', 'FAQs'],
    ['#process', 'How I work'],
    ['#ai', 'How I use AI'],
  ],
} as const;

/** El enlace del índice que se ve (hay uno de escritorio y otro de móvil). */
const tocLink = (page: Page, name: string) =>
  page.locator('header a:visible', { hasText: new RegExp(`^${name}$`) }).first();

test('cabecera: etiqueta /servicios, h1 y entradilla', async ({ page }) => {
  await page.goto('/servicios');
  await expect(page.getByRole('heading', { level: 1, name: 'Servicios' })).toBeVisible();
  await expect(page.locator('main p', { hasText: /^\/servicios$/ })).toBeVisible();
  await expect(page.getByText('Me centro en lo que más impacto tiene en un negocio')).toBeVisible();

  await page.goto('/en/services');
  await expect(page.getByRole('heading', { level: 1, name: 'Services' })).toBeVisible();
  await expect(page.locator('main p', { hasText: /^\/services$/ })).toBeVisible();
});

for (const locale of ['es', 'en'] as const) {
  test(`CA-4.1 (${locale}): los 5 enlaces del índice llevan a su sección y el título no queda tapado`, async ({
    page,
  }) => {
    await page.goto(locale === 'es' ? '/servicios' : '/en/services');
    for (const [hash, label] of anchors[locale]) {
      await page.goto(locale === 'es' ? '/servicios' : '/en/services');
      await tocLink(page, label).click();
      await expect(page).toHaveURL(new RegExp(`${hash}$`));
      const section = page.locator(`section${hash}`);
      await expect(section, hash).toHaveCount(1);
      // Deja que termine el desplazamiento y mide el primer título de la sección.
      await page.waitForTimeout(400);
      const heading = section.locator('h2').first();
      const header = await page.locator('body > header, header.sticky').first().boundingBox();
      const box = await heading.boundingBox();
      expect(box?.y ?? 0, `${hash}: el título queda bajo la cabecera`).toBeGreaterThanOrEqual(
        (header?.y ?? 0) + (header?.height ?? 0) - 1,
      );
      expect(box?.y ?? 0, `${hash}: el título está en pantalla`).toBeLessThan(
        page.viewportSize()?.height ?? 0,
      );
    }
  });
}

test('CA-4.2: ningún botón primary en la página', async ({ page }) => {
  for (const path of ['/servicios', '/en/services']) {
    await page.goto(path);
    await expect(page.locator('main a.bg-accent, main button.bg-accent')).toHaveCount(0);
  }
});

test('Web: tabla de tipos con los ejemplos enlazados y «Siempre incluido»', async ({ page }) => {
  await page.goto('/servicios');
  const table = page.getByRole('table', { name: 'Tipos de web' });
  // La cabecera de columnas solo se ve desde md; las 3 filas de tipos, siempre.
  await expect(table.getByRole('rowheader')).toHaveCount(3);
  for (const name of ['Landing page', 'Web corporativa', 'Aplicación a medida']) {
    await expect(table.getByRole('rowheader', { name })).toBeVisible();
  }
  await expect(table.getByRole('link', { name: 'HB Construcciones' })).toHaveAttribute(
    'href',
    '/trabajos/hb-construcciones',
  );
  await expect(table.getByRole('link', { name: 'Finanzas Personales' })).toHaveAttribute(
    'href',
    '/trabajos/finanzas-personales',
  );
  await expect(table.getByRole('link', { name: 'Zona F' })).toHaveAttribute(
    'href',
    '/trabajos/zona-f',
  );
  await expect(table.getByRole('link')).toHaveCount(3); // la web corporativa no tiene ejemplo
  const always = page.locator('section#web ul li');
  await expect(always).toHaveCount(7);
  await expect(always.first()).toContainText('Diseño a medida, nada de plantillas');
  await expect(page.getByText('Siempre incluido')).toBeVisible();
});

test('Marca y mantenimiento: enlace al caso de HB (#identidad) y 4 puntos', async ({ page }) => {
  await page.goto('/servicios');
  const section = page.locator('section#marca');
  await expect(section.getByRole('heading', { level: 2, name: 'Marca' })).toBeVisible();
  await expect(
    section.getByRole('heading', { level: 2, name: 'Mantenimiento y hosting' }),
  ).toBeVisible();
  await expect(section.locator('img')).toHaveCount(4);
  const link = section.getByRole('link', {
    name: 'Propuesta de identidad para HB Construcciones →',
  });
  await expect(link).toHaveAttribute('href', '/trabajos/hb-construcciones#identidad');
  for (const text of [
    'Alojamiento y dominio',
    'Copias de seguridad',
    'Pequeños cambios',
    'Respuesta si algo falla',
    'Plan mensual o anual, aparte del proyecto.',
  ]) {
    await expect(section.getByText(text, { exact: true })).toBeVisible();
  }
  await link.click();
  await expect(page).toHaveURL(/\/trabajos\/hb-construcciones#identidad$/);

  await page.goto('/en/services');
  await expect(
    page.getByRole('link', { name: 'Brand identity proposal for HB Construcciones →' }),
  ).toHaveAttribute('href', '/en/work/hb-construcciones#brand-identity');
});

test('Preguntas: 7 <details> nativos con la primera abierta y el enlace a #ia', async ({
  page,
}) => {
  await page.goto('/servicios');
  const faq = page.locator('section#preguntas');
  const items = faq.locator('details');
  await expect(items).toHaveCount(7);
  await expect(items.first()).toHaveAttribute('open', '');
  for (let index = 1; index < 7; index++) {
    expect(await items.nth(index).getAttribute('open'), `pregunta ${index + 1}`).toBeNull();
  }
  await expect(items.first()).toContainText('¿Cuánto cuesta una web?');
  await expect(faq.getByRole('link', { name: 'Escríbeme' })).toHaveAttribute('href', '/contacto');

  const last = items.nth(6);
  await last.locator('summary').click();
  await expect(last.getByRole('link', { name: 'cómo uso la IA ↓' })).toHaveAttribute('href', '#ia');
  // Cada resumen mide al menos 44px.
  for (const summary of await faq.locator('summary').all()) {
    expect((await summary.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
});

test('Cómo trabajo: 6 pasos numerados', async ({ page }) => {
  await page.goto('/servicios');
  const rows = page.locator('section#proceso ol > li:not([aria-hidden])');
  await expect(rows).toHaveCount(6);
  await expect(rows.first()).toContainText('01');
  await expect(rows.first()).toContainText('Hablamos');
  await expect(rows.nth(1)).toContainText('Presupuesto cerrado');
  await expect(rows.last()).toContainText('06');
  await expect(rows.last()).toContainText('Alguien que responde.');
});

test('Cómo uso la IA: texto, repositorio y el panel con los 4 pasos', async ({ page }) => {
  await page.goto('/servicios');
  const section = page.locator('section#ia');
  await expect(section.getByText('desarrollo guiado por especificaciones')).toBeVisible();
  await expect(section.getByText('Para ti significa')).toBeVisible();
  await expect(section.getByText('Si eres una empresa')).toBeVisible();
  const repo = section.getByRole('link', { name: /Ver el repositorio/ });
  await expect(repo).toHaveAttribute('href', 'https://github.com/Terryqg10/terryq.com');
  await expect(repo).toHaveClass(/border-line-strong/); // secondary
  await expect(section.getByText('Del papel a producción')).toBeVisible();
  const steps = section.locator('figure ol > li');
  await expect(steps).toHaveCount(4);
  await expect(steps.nth(2)).toContainText('Claude Code');
  await expect(steps.nth(2)).toContainText('IA');
  await expect(steps.nth(0)).toContainText('spec.md');
  await expect(
    section.getByText('Las decisiones y la revisión final son siempre mías.'),
  ).toBeVisible();
});

test('Sigue explorando: dos tarjetas-enlace', async ({ page }) => {
  await page.goto('/servicios');
  const nav = page.getByRole('navigation', { name: 'Sigue explorando' });
  await expect(nav.getByRole('link', { name: /Ver los trabajos/ })).toHaveAttribute(
    'href',
    '/trabajos',
  );
  await expect(nav.getByRole('link', { name: /Cuéntame tu idea/ })).toHaveAttribute(
    'href',
    '/contacto',
  );

  await page.goto('/en/services');
  const en = page.getByRole('navigation', { name: 'Keep exploring' });
  await expect(en.getByRole('link', { name: /See my work/ })).toHaveAttribute('href', '/en/work');
  await expect(en.getByRole('link', { name: /Tell me your idea/ })).toHaveAttribute(
    'href',
    '/en/contact',
  );
});

test.describe('móvil', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1024, 'solo por debajo de lg');

  test('el índice son chips con scroll horizontal en una región enfocable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/servicios');
    const region = page.getByRole('region', { name: 'En esta página' });
    await expect(region).toHaveAttribute('tabindex', '0');
    const [scroll, client] = await region.evaluate((el) => [el.scrollWidth, el.clientWidth]);
    expect(scroll).toBeGreaterThan(client ?? 0);
    for (const chip of await region.getByRole('link').all()) {
      expect((await chip.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });

  test('CA-G6: sin scroll horizontal de la página', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ['/servicios', '/en/services']) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});

for (const path of ['/servicios', '/en/services']) {
  for (const scheme of ['light', 'dark'] as const) {
    test(`axe: ${path} en modo ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      await axeCheck(page);
    });
  }
}
