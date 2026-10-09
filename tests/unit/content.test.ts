import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { reviews } from '@/content/reviews';
import { locales, type WorkImage } from '@/content/types';
import { getNextWork, getPosition, getWork, works } from '@/content/work';
import { workSlugs } from '@/content/work/slugs';
import { caseSectionKinds, numberSections, type CaseSectionKind } from '@/features/work/sections';
import en from '../../messages/en.json';
import es from '../../messages/es.json';

const mdxPath = (slug: string, locale: string) =>
  new URL(`../../src/content/work/${slug}/${locale}.mdx`, import.meta.url);
const readMdx = (slug: string, locale: string) => readFileSync(mdxPath(slug, locale), 'utf8');

const sectionKinds = (source: string) =>
  [...source.matchAll(/<CaseSection kind="(\w+)">/g)].map(([, kind]) => kind as CaseSectionKind);

const images = (work: (typeof works)[number]): WorkImage[] => [
  work.images.cover,
  work.images.mobile,
  work.images.thumb,
  work.images.preview,
  ...work.images.pieces,
];

describe('índice de trabajos', () => {
  it('sigue el orden HB → Zona F → Finanzas y no repite slugs', () => {
    expect(works.map((work) => work.slug)).toEqual([
      'hb-construcciones',
      'zona-f',
      'finanzas-personales',
    ]);
    expect(new Set(works.map((work) => work.slug)).size).toBe(works.length);
    expect([...workSlugs]).toEqual(works.map((work) => work.slug));
  });

  it('la posición y el siguiente son circulares', () => {
    expect(getPosition('hb-construcciones')).toBe('01 / 03');
    expect(getPosition('finanzas-personales')).toBe('03 / 03');
    expect(getNextWork('hb-construcciones').slug).toBe('zona-f');
    expect(getNextWork('finanzas-personales').slug).toBe('hb-construcciones');
    expect(getWork('zona-f').name).toBe('Zona F');
  });
});

describe.each(works)('$slug', (work) => {
  it('tiene su MDX en los dos idiomas', () => {
    for (const locale of locales) expect(existsSync(mdxPath(work.slug, locale)), locale).toBe(true);
  });

  it('todas las imágenes tienen alt no vacío en los dos idiomas', () => {
    for (const image of images(work)) {
      for (const locale of locales) expect(image.alt[locale].trim(), locale).not.toBe('');
    }
  });

  it('las URL empiezan por https://', () => {
    expect(work.siteUrl.startsWith('https://')).toBe(true);
    if (work.demoUrl) expect(work.demoUrl.startsWith('https://')).toBe(true);
  });

  it('el título, el resumen y las etiquetas existen en los dos idiomas', () => {
    for (const locale of locales) {
      expect(work.title[locale]).not.toBe('');
      expect(work.summary[locale]).not.toBe('');
      expect(work.tags[locale].length).toBeGreaterThan(0);
    }
  });

  it('ES y EN tienen las mismas secciones, en el orden permitido', () => {
    const spanish = sectionKinds(readMdx(work.slug, 'es'));
    expect(sectionKinds(readMdx(work.slug, 'en'))).toEqual(spanish);
    expect(spanish).toEqual(caseSectionKinds.filter((kind) => spanish.includes(kind)));
  });

  it('ES y EN tienen el mismo número de DevItem y de SolutionItem', () => {
    const count = (source: string, tag: string) => source.split(`<${tag} `).length - 1;
    for (const tag of ['DevItem', 'SolutionItem']) {
      expect(count(readMdx(work.slug, 'en'), tag), tag).toBe(count(readMdx(work.slug, 'es'), tag));
    }
  });

  it('el MDX no publica marcadores ni textos pendientes (spec §9.6)', () => {
    for (const locale of locales) {
      expect(readMdx(work.slug, locale)).not.toMatch(
        /Ejemplo|Pendiente|Sample|Pending|\[Nombre|\[Name|Testimonio|Recomendaci/,
      );
    }
  });

  it('el slug existe como título de caso en messages', () => {
    expect(es.case.titles[work.slug]).toBe(work.title.es);
    expect(en.case.titles[work.slug]).toBe(work.title.en);
  });
});

describe('numeración de secciones', () => {
  const numbered = (slug: string) =>
    numberSections(sectionKinds(readMdx(slug, 'es'))).map(
      ({ kind, number }) => `${number} ${kind}`,
    );

  it('HB va de 01 a 05 con identidad', () => {
    expect(numbered('hb-construcciones')).toEqual([
      '01 challenge',
      '02 solution',
      '03 identity',
      '04 outcome',
      '05 developers',
    ]);
  });

  it('Zona F y Finanzas van de 01 a 04 sin identidad', () => {
    for (const slug of ['zona-f', 'finanzas-personales']) {
      expect(numbered(slug), slug).toEqual([
        '01 challenge',
        '02 solution',
        '03 outcome',
        '04 developers',
      ]);
    }
  });
});

describe('datos del caso', () => {
  it('Zona F lleva el aviso de demostración y no tiene testimonio', () => {
    const zonaF = getWork('zona-f');
    expect(zonaF.notice?.es).toBe(
      'Proyecto de demostración. No es una casa de apuestas real ni acepta dinero',
    );
    expect(zonaF.testimonial).toBeNull();
  });

  it('en v1 no hay reseñas ni testimonios', () => {
    expect(reviews).toHaveLength(0);
    expect(works.every((work) => work.testimonial === null)).toBe(true);
  });
});
