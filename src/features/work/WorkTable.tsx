import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { WorkCategory } from '@/content/types';
import { works } from '@/content/work';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { ViewTransition } from 'react';
import { WorkTableClient, type WorkFilter } from './WorkTableClient';

const countOf = (category: WorkCategory) =>
  works.filter((work) => work.categories.includes(category)).length;

/**
 * Lista de proyectos de /trabajos (spec §8.2). Desde `md`, una tabla de 12 columnas; por debajo,
 * filas apiladas dentro de la misma tarjeta (decisión P2). Cada fila es un único `<a>` al caso.
 */
export async function WorkTable() {
  const t = await getTranslations('work');
  const status = await getTranslations('common.status');
  const locale = await getLocale();

  const counts: Record<WorkFilter, number> = {
    all: works.length,
    web: countOf('web'),
    brand: countOf('brand'),
  };

  return (
    <WorkTableClient
      labels={{
        group: t('filters.label'),
        all: t('filters.all'),
        web: t('filters.web'),
        brand: t('filters.brand'),
        live: {
          all: t('live', { n: counts.all }),
          web: t('live', { n: counts.web }),
          brand: t('live', { n: counts.brand }),
        },
      }}
      counts={counts}
      previews={Object.fromEntries(works.map((work) => [work.slug, work.images.preview.src]))}
    >
      <Card
        as="div"
        role="region"
        tabIndex={0}
        aria-label={t('tableLabel')}
        className="overflow-hidden"
      >
        <div
          className="hidden grid-cols-12 gap-4 border-b border-line px-6 py-3 text-label text-ink-muted uppercase md:grid"
          aria-hidden="true"
        >
          <span className="col-span-1">{t('columns.year')}</span>
          <span className="col-span-6">{t('columns.project')}</span>
          <span className="col-span-3">{t('columns.type')}</span>
          <span className="col-span-2">{t('columns.status')}</span>
        </div>

        <ul className="divide-y divide-line">
          {works.map((work) => (
            <li
              key={work.slug}
              data-row
              data-slug={work.slug}
              data-categories={work.categories.join(' ')}
            >
              <Link
                href={{ pathname: '/work/[slug]', params: { slug: work.slug } }}
                className="group flex min-h-16 items-center gap-4 px-4 py-4 transition-colors duration-150 hover:bg-paper focus-visible:bg-paper md:grid md:grid-cols-12 md:gap-4 md:px-6"
              >
                <span className="hidden text-meta text-ink-muted md:col-span-1 md:block">
                  {work.year}
                </span>

                <span className="flex min-w-0 flex-1 items-center gap-4 md:col-span-6 md:flex-none">
                  <ViewTransition name={`work-${work.slug}`} share="morph" default="none">
                    <Image
                      src={work.images.thumb.src}
                      alt=""
                      sizes="96px"
                      className="h-15 w-24 shrink-0 rounded-lg border border-line bg-surface-sunken object-cover object-top"
                    />
                  </ViewTransition>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[17px] leading-6 font-semibold">{work.name}</span>
                    <span className="text-small text-ink-muted">{work.rowSummary[locale]}</span>
                    {/* Móvil: la línea mono con año, tipo y estado (P2). */}
                    <span className="mt-1 text-meta text-ink-muted md:hidden">
                      {work.year} · {work.typeLabel[locale]} ·{' '}
                      <StatusBadge status={work.status} label={status(work.status)} muted />
                    </span>
                  </span>
                </span>

                <span className="hidden text-small md:col-span-3 md:block">
                  {work.typeLabel[locale]}
                </span>

                <span className="hidden items-center justify-between gap-2 md:col-span-2 md:flex">
                  <StatusBadge status={work.status} label={status(work.status)} muted />
                  <ArrowRight
                    aria-hidden="true"
                    size={20}
                    strokeWidth={1.75}
                    className="transition-transform duration-150 group-hover:translate-x-1"
                  />
                </span>
                <ArrowRight
                  aria-hidden="true"
                  size={20}
                  strokeWidth={1.75}
                  className="shrink-0 md:hidden"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </WorkTableClient>
  );
}
