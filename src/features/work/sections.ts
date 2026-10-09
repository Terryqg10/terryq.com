import { caseSectionKinds, sectionIds, type CaseSectionKind } from '@/content/work/sections';

// Los ids y los tipos de sección son datos (los usa también /servicios); se reexportan aquí.
export { caseSectionKinds, sectionIds, type CaseSectionKind };

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
