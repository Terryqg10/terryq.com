import type { Locale } from 'next-intl';
import { pathnames } from './routing';

type LabeledRoute = Exclude<keyof typeof pathnames, '/' | '/work/[slug]'>;

/** Etiqueta de sección sin la barra inicial (`trabajos` / `work`): spec §5.2, UI1 y UI41. */
export function routeLabel(route: LabeledRoute, locale: Locale): string {
  return pathnames[route][locale].slice(1);
}
