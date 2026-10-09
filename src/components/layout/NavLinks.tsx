'use client';

import { buttonClasses } from '@/components/ui/button-classes';
import { Link, usePathname } from '@/i18n/navigation';
import { site } from '@/lib/site';

export type NavLabels = {
  work: string;
  services: string;
  about: string;
  github: string;
  contact: string;
  external: string;
};

type Route = '/work' | '/services' | '/about' | '/contact';

/**
 * Enlaces del menú de escritorio. Es una isla cliente (justificada en T12) porque marca la
 * página actual con `aria-current`, y eso depende de la ruta.
 */
export function NavLinks({ labels }: { labels: NavLabels }) {
  const pathname = usePathname();

  // `page` en la propia ruta; `true` en una subpágina (un caso de /trabajos).
  const current = (route: Route) =>
    pathname === route ? 'page' : pathname.startsWith(`${route}/`) ? 'true' : undefined;

  const items: { route: Route; label: string }[] = [
    { route: '/work', label: labels.work },
    { route: '/services', label: labels.services },
    { route: '/about', label: labels.about },
  ];
  const onContact = pathname === '/contact';

  return (
    <>
      {items.map(({ route, label }) => (
        <Link
          key={route}
          href={route}
          aria-current={current(route)}
          className="tq-link py-3 text-button aria-[current]:underline aria-[current]:underline-offset-[6px]"
        >
          {label}
        </Link>
      ))}
      <a
        href={site.github}
        target="_blank"
        rel="noopener noreferrer"
        className="tq-link py-3 text-button"
      >
        {labels.github}
        <span className="sr-only"> {labels.external}</span>
      </a>
      <Link
        href="/contact"
        aria-current={onContact ? 'page' : undefined}
        className={buttonClasses({ variant: onContact ? 'primary' : 'secondary' })}
      >
        {labels.contact}
      </Link>
    </>
  );
}
