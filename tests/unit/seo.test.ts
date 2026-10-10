import { describe, expect, it } from 'vitest';
import { alternatesFor, asLocale, caseTitle, pagePath } from '@/lib/seo';

describe('pagePath', () => {
  it.each([
    ['home', 'es', '/'],
    ['home', 'en', '/en'],
    ['work', 'es', '/trabajos'],
    ['work', 'en', '/en/work'],
    ['services', 'es', '/servicios'],
    ['about', 'en', '/en/about'],
    ['contact', 'es', '/contacto'],
    ['legal-notice', 'en', '/en/legal-notice'],
    ['privacy', 'es', '/privacidad'],
  ] as const)('%s en %s → %s', (page, locale, expected) => {
    expect(pagePath(page, locale)).toBe(expected);
  });

  it('un caso lleva su slug y exige que exista', () => {
    expect(pagePath('case', 'es', 'zona-f')).toBe('/trabajos/zona-f');
    expect(pagePath('case', 'en', 'zona-f')).toBe('/en/work/zona-f');
    expect(() => pagePath('case', 'es')).toThrow();
  });
});

describe('alternatesFor', () => {
  it('canonical propia y es, en y x-default → ES', () => {
    expect(alternatesFor('services', 'en')).toEqual({
      canonical: '/en/services',
      languages: { es: '/servicios', en: '/en/services', 'x-default': '/servicios' },
    });
    expect(alternatesFor('services', 'es').canonical).toBe('/servicios');
  });

  it('la portada y los casos', () => {
    expect(alternatesFor('home', 'es')).toEqual({
      canonical: '/',
      languages: { es: '/', en: '/en', 'x-default': '/' },
    });
    expect(alternatesFor('case', 'en', 'hb-construcciones').languages).toEqual({
      es: '/trabajos/hb-construcciones',
      en: '/en/work/hb-construcciones',
      'x-default': '/trabajos/hb-construcciones',
    });
  });
});

describe('caseTitle', () => {
  it('usa el titular si cabe en ~60 caracteres', () => {
    expect(caseTitle('Zona F', 'Casa de apuestas', 'Caso de estudio', 'Terry Quiñonez')).toBe(
      'Zona F · Casa de apuestas · Terry Quiñonez',
    );
  });

  it('si no cabe, usa «Caso de estudio»', () => {
    const long = 'Una web para que pedir presupuesto sea tan fácil como mandar un WhatsApp';
    expect(caseTitle('HB Construcciones', long, 'Caso de estudio', 'Terry Quiñonez')).toBe(
      'HB Construcciones · Caso de estudio · Terry Quiñonez',
    );
    expect(caseTitle('HB Construcciones', long, 'Case study', 'Terry Quiñonez')).toBe(
      'HB Construcciones · Case study · Terry Quiñonez',
    );
  });
});

describe('asLocale', () => {
  it('cae al idioma por defecto si no lo conoce', () => {
    expect(asLocale('en')).toBe('en');
    expect(asLocale('fr')).toBe('es');
  });
});
