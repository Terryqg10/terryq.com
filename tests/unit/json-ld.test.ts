import { describe, expect, it } from 'vitest';
import { getWork } from '@/content/work';
import { caseJsonLd, serializeJsonLd, siteJsonLd } from '@/lib/json-ld';

const origin = 'https://terryq.com';
const siteText = {
  jobTitle: 'Desarrollador web',
  tagline: 'Diseño y desarrollo web',
  country: 'España',
};
const caseText = { breadcrumbHome: 'Inicio', breadcrumbWork: 'Trabajos' };

describe('siteJsonLd', () => {
  const graph = (siteJsonLd(origin, 'es', siteText)['@graph'] as Record<string, unknown>[]) ?? [];
  const person = graph.find((node) => node['@type'] === 'Person');
  const service = graph.find((node) => node['@type'] === 'ProfessionalService');

  it('lleva Person y ProfessionalService con los campos de §11.2', () => {
    expect(person).toMatchObject({
      name: 'Terry Quiñonez',
      url: 'https://terryq.com/',
      jobTitle: 'Desarrollador web',
      address: { addressLocality: 'Quijorna', addressRegion: 'Madrid', addressCountry: 'ES' },
      sameAs: ['https://github.com/Terryqg10', expect.stringContaining('linkedin.com')],
    });
    expect(service).toMatchObject({
      name: 'Terry Quiñonez · Diseño y desarrollo web',
      email: 'contacto@terryq.com',
      address: { addressLocality: 'Quijorna', postalCode: '28693', addressCountry: 'ES' },
      areaServed: [
        { '@type': 'Country', name: 'España' },
        { '@type': 'AdministrativeArea', name: 'Comunidad de Madrid' },
      ],
    });
  });

  it('el fundador apunta a la Person', () => {
    expect((service as { founder: { '@id': string } }).founder['@id']).toBe(
      (person as { '@id': string })['@id'],
    );
  });

  it('en inglés la URL es la portada EN', () => {
    const en = siteJsonLd(origin, 'en', { ...siteText, jobTitle: 'Web developer' });
    const first = (en['@graph'] as { url: string; jobTitle: string }[])[0];
    expect(first?.url).toBe('https://terryq.com/en');
    expect(first?.jobTitle).toBe('Web developer');
  });

  it('no inventa precios ni valoraciones', () => {
    const json = JSON.stringify(siteJsonLd(origin, 'es', siteText));
    for (const forbidden of ['aggregateRating', 'priceRange', 'review', 'ratingValue']) {
      expect(json).not.toContain(forbidden);
    }
  });
});

describe('caseJsonLd', () => {
  const work = getWork('zona-f');
  const graph = caseJsonLd(origin, 'en', work, caseText)['@graph'] as Record<string, unknown>[];

  it('CreativeWork con nombre, titular, URL, año, creador e imagen', () => {
    expect(graph[0]).toMatchObject({
      '@type': 'CreativeWork',
      name: 'Zona F',
      headline: work.title.en,
      url: 'https://terryq.com/en/work/zona-f',
      dateCreated: String(work.year),
      creator: { '@id': 'https://terryq.com/#person' },
    });
    expect(String(graph[0]?.image).startsWith(origin)).toBe(true);
  });

  it('BreadcrumbList Inicio › Trabajos › nombre, con URLs absolutas', () => {
    expect(graph[1]).toEqual({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://terryq.com/en' },
        { '@type': 'ListItem', position: 2, name: 'Trabajos', item: 'https://terryq.com/en/work' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Zona F',
          item: 'https://terryq.com/en/work/zona-f',
        },
      ],
    });
  });
});

describe('serializeJsonLd', () => {
  it('escapa < para que nada cierre el script', () => {
    const out = serializeJsonLd({ name: '</script><img src=x onerror=alert(1)>' });
    expect(out).not.toContain('<');
    expect(JSON.parse(out)).toEqual({ name: '</script><img src=x onerror=alert(1)>' });
  });
});
