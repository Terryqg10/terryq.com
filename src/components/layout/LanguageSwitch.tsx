'use client';

import { getPathname, usePathname } from '@/i18n/navigation';
import { pathnames, routing } from '@/i18n/routing';
import { cn } from '@/lib/cn';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';

type Href = Parameters<typeof getPathname>[0]['href'];

/**
 * Enlace a la ruta equivalente en el otro idioma, conservando el `slug` pero no el ancla
 * (spec §5.4). Es una isla cliente porque necesita la ruta actual. Usa `getPathname` y un `<a>`:
 * el `Link` de next-intl antepone siempre el prefijo cuando se le da `locale`, y `/es/...`
 * redirige (308) a la ruta sin prefijo.
 */
export function LanguageSwitch({ ariaLabel }: { ariaLabel: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams<{ slug?: string }>();
  const target = routing.locales.find((candidate) => candidate !== locale) ?? routing.defaultLocale;

  // `usePathname` devuelve la ruta interna (p. ej. `/work/[slug]`); el slug viene de `useParams`.
  // En una ruta que no existe (la 404) no hay equivalente: se lleva a la portada del otro idioma.
  const href = (
    typeof params.slug === 'string'
      ? { pathname, params: { slug: params.slug } }
      : pathname in pathnames
        ? pathname
        : '/'
  ) as Href;

  return (
    <a
      href={getPathname({ href, locale: target })}
      hrefLang={target}
      lang={target}
      aria-label={ariaLabel}
      className="inline-flex min-h-11 items-center gap-1 text-meta text-ink-muted"
    >
      {routing.locales.map((code, index) => (
        <span key={code} aria-hidden="true" className="inline-flex gap-1">
          {index > 0 ? <span>/</span> : null}
          <span className={cn(code === locale && 'text-ink')}>{code.toUpperCase()}</span>
        </span>
      ))}
    </a>
  );
}
