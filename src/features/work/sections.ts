import type { Localized } from '@/content/types';

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

/** La numeración (01, 02…) sigue el orden de las secciones presentes (spec §8.3). */
export function numberSections(kinds: readonly CaseSectionKind[]) {
  return kinds.map((kind, index) => ({ kind, number: String(index + 1).padStart(2, '0') }));
}

/** Las secciones de un MDX, en el orden en que aparecen (para numerarlas en el build). */
export function sectionKindsOf(source: string): CaseSectionKind[] {
  return [...source.matchAll(/<CaseSection kind="([a-z]+)">/g)].map(
    ([, kind]) => kind as CaseSectionKind,
  );
}
