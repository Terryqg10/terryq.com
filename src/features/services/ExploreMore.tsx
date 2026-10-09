import { cardClasses } from '@/components/ui/card-classes';
import { Link } from '@/i18n/navigation';
import { routeLabel } from '@/i18n/route-label';
import { ArrowRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

/** Sigue explorando (spec §8.4, UI29): dos tarjetas-enlace 6/6, sin bloque de color. */
export async function ExploreMore() {
  const t = await getTranslations('services');
  const locale = await getLocale();

  const cards = [
    { href: '/work' as const, label: routeLabel('/work', locale), title: t('explore.work') },
    {
      href: '/contact' as const,
      label: routeLabel('/contact', locale),
      title: t('explore.contact'),
    },
  ];

  return (
    <nav
      aria-label={t('explore.label')}
      data-reveal
      className="grid grid-cols-12 gap-6 pb-16 lg:pb-24"
    >
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className={cardClasses({
            interactive: true,
            className:
              'group col-span-12 flex items-center justify-between gap-6 p-8 md:col-span-6',
          })}
        >
          <span className="flex flex-col gap-1.5">
            <span className="text-meta text-ink-muted">
              <span className="text-accent">/</span>
              {card.label}
            </span>
            <span className="type-section-sm">{card.title}</span>
          </span>
          <ArrowRight
            aria-hidden="true"
            size={24}
            strokeWidth={1.75}
            className="shrink-0 transition-transform duration-150 group-hover:translate-x-1"
          />
        </Link>
      ))}
    </nav>
  );
}
