import { allRoutes } from './utils';
import { expect, test, type Page } from '@playwright/test';

type Node = Record<string, unknown> & { '@type': string };

/** Todos los nodos JSON-LD de la página; falla si algún `<script>` no es JSON válido. */
async function jsonLd(page: Page): Promise<{ raw: string[]; nodes: Node[] }> {
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents();
  const nodes = raw.flatMap((text) => {
    const data = JSON.parse(text) as { '@context': string; '@graph': Node[] };
    expect(data['@context']).toBe('https://schema.org');
    return data['@graph'];
  });
  return { raw, nodes };
}

test('todas las páginas tienen un JSON-LD válido con Person y ProfessionalService', async ({
  page,
}) => {
  for (const path of allRoutes) {
    await page.goto(path);
    const { raw, nodes } = await jsonLd(page);
    expect(raw.length, path).toBeGreaterThan(0);
    const types = nodes.map((node) => node['@type']);
    expect(types, path).toEqual(expect.arrayContaining(['Person', 'ProfessionalService']));
    // Sin valoraciones ni precios inventados.
    const text = raw.join('');
    expect(text, path).not.toMatch(/aggregateRating|priceRange|"review"|ratingValue/);
    // Sin `<` sin escapar dentro de la etiqueta.
    expect(
      raw.every((chunk) => !chunk.includes('<')),
      path,
    ).toBe(true);
  }
});

test('Person y ProfessionalService: campos de §11.2 en los dos idiomas', async ({ page }) => {
  for (const [path, jobTitle, country] of [
    ['/', 'Desarrollador web', 'España'],
    ['/en/about', 'Web developer', 'Spain'],
  ] as const) {
    await page.goto(path);
    const { nodes } = await jsonLd(page);
    const person = nodes.find((node) => node['@type'] === 'Person');
    const service = nodes.find((node) => node['@type'] === 'ProfessionalService');
    expect(person).toMatchObject({
      name: 'Terry Quiñonez',
      jobTitle,
      address: { addressLocality: 'Quijorna', addressRegion: 'Madrid', addressCountry: 'ES' },
    });
    expect(String(person?.url)).toMatch(/^http:\/\/localhost:3100/);
    expect(person?.sameAs).toEqual([
      'https://github.com/Terryqg10',
      expect.stringContaining('linkedin.com'),
    ]);
    expect(service).toMatchObject({
      email: 'contacto@terryq.com',
      address: { postalCode: '28693' },
      areaServed: [
        { '@type': 'Country', name: country },
        { '@type': 'AdministrativeArea', name: 'Comunidad de Madrid' },
      ],
      founder: { '@id': person?.['@id'] },
    });
  }
});

test('los casos añaden CreativeWork y BreadcrumbList', async ({ page }) => {
  for (const [path, name, work] of [
    ['/trabajos/hb-construcciones', 'HB Construcciones', 'Trabajos'],
    ['/en/work/zona-f', 'Zona F', 'Work'],
  ] as const) {
    await page.goto(path);
    const { nodes } = await jsonLd(page);
    const creative = nodes.find((node) => node['@type'] === 'CreativeWork');
    const crumbs = nodes.find((node) => node['@type'] === 'BreadcrumbList');
    expect(creative, path).toMatchObject({
      name,
      creator: { '@id': expect.stringMatching(/#person$/) },
    });
    expect(String(creative?.url)).toContain(path);
    expect(String(creative?.dateCreated)).toMatch(/^\d{4}$/);
    expect(String(creative?.image)).toMatch(/^http:\/\/localhost:3100\/_next\/static\/media\//);
    const items = (crumbs?.itemListElement ?? []) as { position: number; name: string }[];
    expect(items.map((item) => item.position)).toEqual([1, 2, 3]);
    expect(items[2]?.name).toBe(name);
    expect(items[1]?.name).toBe(work);
  }
});

test('el resto de páginas no lleva CreativeWork', async ({ page }) => {
  await page.goto('/servicios');
  const { nodes } = await jsonLd(page);
  expect(nodes.map((node) => node['@type'])).not.toContain('CreativeWork');
});
