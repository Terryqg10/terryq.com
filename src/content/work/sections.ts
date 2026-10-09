import type { Localized } from '../types';

/** Secciones del MDX de un caso, en el orden en que se muestran (spec §8.3). */
export const caseSectionKinds = [
  'challenge',
  'solution',
  'identity',
  'outcome',
  'developers',
] as const;
export type CaseSectionKind = (typeof caseSectionKinds)[number];

/** `id` de cada sección por idioma (spec §9.2). */
export const sectionIds: Readonly<Record<CaseSectionKind, Localized<string>>> = {
  challenge: { es: 'reto', en: 'challenge' },
  solution: { es: 'solucion', en: 'solution' },
  identity: { es: 'identidad', en: 'brand-identity' },
  outcome: { es: 'resultado', en: 'outcome' },
  developers: { es: 'desarrolladores', en: 'for-developers' },
};
