import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Children, type ComponentProps, type ReactNode } from 'react';

export type InternalHref = ComponentProps<typeof Link>['href'];

/** A dónde lleva un enlace: una ruta interna, una URL externa o un archivo para descargar. */
export type LinkTarget =
  | { href: InternalHref; external?: false; download?: undefined }
  | { href: string; external: true; download?: undefined }
  | { href: string; download: string; external?: false };

/**
 * Elige el elemento correcto: `<Link>` para rutas internas y `<a>` para externos y descargas.
 * Si es externo, añade `↗` (salvo que el texto ya lo traiga) y el texto oculto «(sitio externo)».
 */
export async function ActionLink({
  target,
  className,
  children,
}: {
  target: LinkTarget;
  className: string;
  children: ReactNode;
}) {
  const t = await getTranslations('common');

  if (target.external) {
    // Si el texto ya trae la flecha («GitHub ↗» viene de `messages`), no se añade otra.
    const hasArrow = Children.toArray(children).some(
      (child) => typeof child === 'string' && child.trimEnd().endsWith('↗'),
    );
    return (
      <a href={target.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        {hasArrow ? null : <span aria-hidden="true"> ↗</span>}
        <span className="sr-only"> {t('external')}</span>
      </a>
    );
  }

  if (typeof target.download === 'string') {
    return (
      <a href={target.href as string} download={target.download} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={target.href} className={className}>
      {children}
    </Link>
  );
}
