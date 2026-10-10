import type { Locale, WorkSlug } from '@/content/types';
import { pathnames, routing } from './routing';

type Internal = Exclude<keyof typeof pathnames, '/work/[slug]'>;

/**
 * Ruta pública de una página interna en un idioma: ES sin prefijo y EN con `/en` (spec §5.2).
 * Es pura (no depende de next-intl) para poder usarla en el proxy, en `seo.ts` y en los tests.
 */
export function publicPath(
  internal: Internal | '/work/[slug]',
  locale: Locale,
  slug?: WorkSlug,
): string {
  const entry = pathnames[internal];
  let path: string = typeof entry === 'string' ? entry : entry[locale];
  if (internal === '/work/[slug]') {
    if (!slug) throw new Error('Un caso necesita su slug');
    path = path.replace('[slug]', slug);
  }
  if (locale === routing.defaultLocale) return path;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}
