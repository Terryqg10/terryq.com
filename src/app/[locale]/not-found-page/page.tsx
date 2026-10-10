import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cardClasses } from '@/components/ui/card-classes';
import { RequestedPath } from '@/features/not-found/RequestedPath';
import { Link } from '@/i18n/navigation';
import { routeLabel } from '@/i18n/route-label';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';

export const metadata: Metadata = { robots: { index: false } };

/**
 * 404 traducida (spec §8.7). Next no usa `not-found.tsx` cuando el layout raíz está en un segmento
 * dinámico (`[locale]`), así que `proxy.ts` reescribe aquí las rutas que no existen con estado 404.
 */
export default async function NotFoundPage() {
  const [t, nav, locale] = await Promise.all([
    getTranslations('notFound'),
    getTranslations('common.nav'),
    getLocale(),
  ]);

  const shortcuts = [
    { href: '/work', name: nav('work') },
    { href: '/services', name: nav('services') },
    { href: '/about', name: nav('about') },
    { href: '/contact', name: nav('contact') },
  ] as const;

  return (
    <main id="contenido">
      <Container>
        <section
          aria-labelledby="not-found-title"
          className="grid grid-cols-12 items-center gap-x-6 gap-y-8 py-16 lg:py-28"
        >
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-6">
            <RequestedPath />
            <h1 id="not-found-title" className="type-title">
              {t('title')}
            </h1>
            <p className="max-w-130 text-body-l text-ink-muted">{t('text')}</p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button variant="primary" size="lg" href="/">
                <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.75} />
                {t('home')}
              </Button>
              <Button variant="secondary" size="lg" href="/work">
                {t('work')}
              </Button>
            </div>
          </div>

          {/* En móvil va encima del texto y más pequeño; en escritorio, a la derecha (200px). */}
          <div
            aria-hidden="true"
            className="order-first col-span-12 flex items-center select-none lg:order-none lg:col-span-6 lg:justify-end"
          >
            <span className="font-display text-[88px]/[0.85] font-bold tracking-[-0.06em] sm:text-[120px]/[0.85] lg:text-[200px]/[0.85]">
              <span className="font-mono font-normal tracking-[-0.1em] text-ink-subtle">&lt;</span>
              404
              <span className="font-mono font-normal tracking-[-0.1em] text-ink-subtle">&gt;</span>
            </span>
          </div>
        </section>

        <nav aria-labelledby="not-found-go" className="border-t border-line pt-12 pb-16 lg:pb-24">
          <h2
            id="not-found-go"
            className="mb-5 text-meta tracking-[0.04em] text-ink-muted uppercase"
          >
            {t('goTo')}
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {shortcuts.map((shortcut) => (
              <li key={shortcut.href}>
                <Link
                  href={shortcut.href}
                  className={cardClasses({
                    interactive: true,
                    className: 'group flex items-center justify-between gap-3 p-6',
                  })}
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-meta text-ink-muted">
                      <span className="text-accent">/</span>
                      {routeLabel(shortcut.href, locale)}
                    </span>
                    <strong className="text-[18px]/[24px] font-semibold">{shortcut.name}</strong>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    size={20}
                    strokeWidth={1.75}
                    className="shrink-0 transition-transform duration-150 group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </main>
  );
}
