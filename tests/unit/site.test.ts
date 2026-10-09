import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/cn';
import { site, whatsappHref } from '@/lib/site';

describe('whatsappHref', () => {
  it('genera exactamente el enlace de F1 v2.2 en español', () => {
    expect(whatsappHref('es')).toBe(
      'https://wa.me/34614312673?text=Hola%20Terry%2C%20vengo%20de%20tu%20web%20y%20quer%C3%ADa%20hablarte%20de%20',
    );
  });

  it('genera exactamente el enlace de 01b en inglés', () => {
    expect(whatsappHref('en')).toBe(
      'https://wa.me/34614312673?text=Hi%20Terry%2C%20I%20found%20your%20website%20and%20I%27d%20like%20to%20talk%20about%20',
    );
  });
});

describe('site', () => {
  it('los flags de contenido pendiente están vacíos (spec §9.6)', () => {
    expect(site.googleReviewsUrl).toBeNull();
    expect(site.cv).toEqual({ es: null, en: null });
    expect(site.avatar).toBeNull();
    expect(site.portrait).toBeNull();
    expect(site.legal.nif).toBeNull();
  });

  it('los enlaces externos son https', () => {
    for (const url of [site.url, site.github, site.linkedin, site.repoUrl]) {
      expect(url.startsWith('https://')).toBe(true);
    }
  });
});

describe('cn', () => {
  it('une clases y descarta los valores falsos', () => {
    expect(cn('a', false && 'b', undefined, ['c', { d: true, e: false }])).toBe('a c d');
  });
});
