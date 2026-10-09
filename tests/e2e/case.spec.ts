import { expect, test, type Page } from '@playwright/test';
import { axeCheck } from './utils';

const cases = [
  {
    slug: 'hb-construcciones',
    es: 'Una web para que pedir presupuesto sea tan fácil como mandar un WhatsApp',
    en: 'A website that makes asking for a quote as easy as sending a WhatsApp',
    position: '01 / 03',
    sections: ['01', '02', '03', '04', '05'],
  },
  {
    slug: 'zona-f',
    es: 'Cómo sería una casa de apuestas pensada para el usuario',
    en: 'What a betting site designed around the user could look like',
    position: '02 / 03',
    sections: ['01', '02', '03', '04'],
  },
  {
    slug: 'finanzas-personales',
    es: 'Mis finanzas, mes a mes, sin hojas de cálculo',
    en: 'My finances, month by month, without spreadsheets',
    position: '03 / 03',
    sections: ['01', '02', '03', '04'],
  },
] as const;

const numbers = (page: Page) => page.locator('article section span.text-accent').allTextContents();

for (const work of cases) {
  test.describe(work.slug, () => {
    test('CA-3.1: se genera en los dos idiomas con su h1 y su posición', async ({ page }) => {
      const es = await page.goto(`/trabajos/${work.slug}`);
      expect(es?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(work.es);
      await expect(page.getByText(work.position, { exact: true })).toBeVisible();
      await expect(
        page.locator('main p', { hasText: `/trabajos/${work.slug}` }).first(),
      ).toBeVisible();

      const en = await page.goto(`/en/work/${work.slug}`);
      expect(en?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(work.en);
    });

    test('la numeración sigue las secciones presentes', async ({ page }) => {
      await page.goto(`/trabajos/${work.slug}`);
      expect(await numbers(page)).toEqual(work.sections);
    });

    test('«Para desarrolladores» es un <details> cerrado por defecto y se abre', async ({
      page,
    }) => {
      await page.goto(`/trabajos/${work.slug}`);
      const details = page.locator('details');
      await expect(details).toHaveCount(1);
      expect(await details.getAttribute('open')).toBeNull();
      const summary = details.locator('summary');
      expect((await summary.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
      await summary.click();
      await expect(details).toHaveAttribute('open', '');
      await expect(details.locator('dt').first()).toBeVisible();
    });

    test('ficha: «Abrir la web ↗» es el único botón primary y hay «Mi papel»', async ({ page }) => {
      await page.goto(`/trabajos/${work.slug}`);
      const facts = page.getByRole('complementary', { name: 'Ficha del proyecto' });
      await expect(facts).toBeVisible();
      await expect(facts.getByText('Mi papel')).toBeVisible();
      await expect(
        facts.getByText('Dirección del proyecto, especificación, diseño, revisión y despliegue.'),
      ).toBeVisible();
      await expect(facts.getByRole('link', { name: /Abrir la web/ })).toHaveAttribute(
        'href',
        /^https:\/\/.+\.vercel\.app\/$/,
      );
      // CA-3.4: un solo botón primary por pantalla.
      await expect(page.locator('main a.bg-accent, main button.bg-accent')).toHaveCount(1);
      // Ninguno de los tres casos tiene demo todavía.
      await expect(facts.getByRole('link', { name: /Probar la demo/ })).toHaveCount(0);
    });

    test('sin testimonio no hay bloque de testimonio (§9.6)', async ({ page }) => {
      await page.goto(`/trabajos/${work.slug}`);
      await expect(page.getByText('Testimonio del cliente')).toHaveCount(0);
      await expect(page.locator('main blockquote')).toHaveCount(0);
    });

    for (const scheme of ['light', 'dark'] as const) {
      test(`axe: ES y EN en modo ${scheme}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme });
        for (const path of [`/trabajos/${work.slug}`, `/en/work/${work.slug}`]) {
          await page.goto(path);
          await axeCheck(page, { ignore: ['document-title'] }); // sin <title> hasta T30
        }
      });
    }
  });
}

test('CA-3.1: un slug desconocido devuelve la 404', async ({ request }) => {
  for (const path of ['/trabajos/no-existe', '/en/work/no-existe']) {
    expect((await request.get(path, { maxRedirects: 0 })).status(), path).toBe(404);
  }
});

test('el siguiente proyecto es circular: HB → Zona F → Finanzas → HB', async ({ page }) => {
  const order = ['hb-construcciones', 'zona-f', 'finanzas-personales'];
  for (const [index, slug] of order.entries()) {
    await page.goto(`/trabajos/${slug}`);
    const next = page.getByRole('navigation', { name: 'Siguiente proyecto' });
    await expect(next).toContainText(`Siguiente proyecto · 0${((index + 1) % 3) + 1} / 03`);
    await expect(next.getByRole('link')).toHaveAttribute(
      'href',
      `/trabajos/${order[(index + 1) % 3]}`,
    );
  }
  await page.goto('/en/work/finanzas-personales');
  const next = page.getByRole('navigation', { name: 'Next project' });
  await expect(next).toContainText('Next project · 01 / 03');
  await expect(next.getByRole('link')).toHaveAttribute('href', '/en/work/hb-construcciones');
});

test('HB: kit de logo con sus 4 tiles, identidad y ids de sección', async ({ page }) => {
  await page.goto('/trabajos/hb-construcciones');
  for (const label of ['Color', 'Negativo', 'Monocromo', 'Icono']) {
    await expect(page.locator('figcaption', { hasText: new RegExp(`^${label}$`) })).toBeVisible();
  }
  const logos = page.locator('#identidad img');
  await expect(logos).toHaveCount(4);
  for (const logo of await logos.all()) {
    await logo.scrollIntoViewIfNeeded();
    await expect
      .poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);
    await expect(logo).toHaveAttribute('alt', /.+/);
  }
  for (const id of ['reto', 'solucion', 'identidad', 'resultado', 'desarrolladores']) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
  await page.goto('/en/work/hb-construcciones');
  for (const id of ['challenge', 'solution', 'brand-identity', 'outcome', 'for-developers']) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
});

test('Zona F y Finanzas no tienen la sección de identidad', async ({ page }) => {
  for (const slug of ['zona-f', 'finanzas-personales']) {
    await page.goto(`/trabajos/${slug}`);
    await expect(page.locator('section#identidad')).toHaveCount(0);
    await expect(page.locator('main article > section')).toHaveCount(4);
  }
});

test('CA-3.3: Zona F muestra el aviso de demostración y el estado Demo', async ({ page }) => {
  await page.goto('/trabajos/zona-f');
  const facts = page.getByRole('complementary', { name: 'Ficha del proyecto' });
  await expect(
    facts.getByText('Proyecto de demostración. No es una casa de apuestas real ni acepta dinero'),
  ).toBeVisible();
  await expect(facts.getByText('Demo', { exact: true })).toBeVisible();
  await expect(facts.getByText('2026 (diseñada y construida en 2 semanas)')).toBeVisible();

  await page.goto('/en/work/zona-f');
  await expect(
    page.getByText('Demo project. Not a real betting site; it does not accept money'),
  ).toBeVisible();
});

test('cabecera: volver a Trabajos, imagen principal con prioridad y nombre accesible', async ({
  page,
}) => {
  await page.goto('/trabajos/zona-f');
  await expect(page.getByRole('link', { name: 'Volver a Trabajos' })).toHaveAttribute(
    'href',
    '/trabajos',
  );
  const image = page.locator('main figure img').first();
  await expect(image).toHaveAttribute('fetchpriority', 'high');
  await expect(image).toHaveAttribute('alt', /Zona F en escritorio/);

  await page.goto('/en/work/zona-f');
  await expect(page.getByRole('link', { name: 'Back to Work' })).toHaveAttribute(
    'href',
    '/en/work',
  );
  await expect(page.getByRole('complementary', { name: 'Project facts' })).toBeVisible();
});

test('la ficha es sticky desde lg y en móvil va justo después de la imagen', async ({ page }) => {
  await page.goto('/trabajos/hb-construcciones');
  const aside = page.getByRole('complementary', { name: 'Ficha del proyecto' });
  const position = await aside.evaluate((el) => getComputedStyle(el).position);
  const width = page.viewportSize()?.width ?? 0;
  const [asideBox, articleBox, imageBox] = await Promise.all([
    aside.boundingBox(),
    page.locator('main article').boundingBox(),
    page.locator('main figure').first().boundingBox(),
  ]);
  if (width >= 1024) {
    expect(position).toBe('sticky');
    expect(asideBox?.x ?? 0).toBeLessThan(articleBox?.x ?? 0);
  } else {
    expect(position).not.toBe('sticky');
    expect(asideBox?.y ?? 0).toBeGreaterThan((imageBox?.y ?? 0) + (imageBox?.height ?? 0) - 1);
    expect(asideBox?.y ?? 0).toBeLessThan(articleBox?.y ?? 0);
  }
});

test('a 390px no hay scroll horizontal en ningún caso', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const work of cases) {
    for (const path of [`/trabajos/${work.slug}`, `/en/work/${work.slug}`]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  }
});
