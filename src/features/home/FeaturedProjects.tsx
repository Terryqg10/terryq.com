import { StatusBadge } from '@/components/ui/StatusBadge';
import { Tag } from '@/components/ui/Tag';
import { TextLink } from '@/components/ui/TextLink';
import { cardClasses } from '@/components/ui/card-classes';
import { works } from '@/content/work';
import { Link } from '@/i18n/navigation';
import { routeLabel } from '@/i18n/route-label';
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { ViewTransition } from 'react';
import { SectionHeader } from './section-header';

/** Trabajos recientes (spec §8.1, fila 2). Toda la tarjeta es un único enlace al caso. */
export async function FeaturedProjects() {
  const t = await getTranslations('home.work');
  const status = await getTranslations('common.status');
  const locale = await getLocale();

  return (
    <section data-reveal aria-labelledby="work-t" className="border-t border-line py-16 lg:py-24">
      <SectionHeader
        label={routeLabel('/work', locale)}
        id="work-t"
        title={t('title')}
        intro={t('intro')}
        action={
          <TextLink href="/work" className="py-3 text-button">
            {t('viewAll')}
          </TextLink>
        }
      />

      <ul className="flex flex-col gap-6">
        {works.map((work) => (
          <li key={work.slug}>
            <Link
              href={{ pathname: '/work/[slug]', params: { slug: work.slug } }}
              className={cardClasses({
                interactive: true,
                className: 'group flex flex-col gap-6 p-4 lg:flex-row lg:items-center lg:gap-10',
              })}
            >
              <ViewTransition name={`work-${work.slug}`} share="morph" default="none">
                <Image
                  src={work.images.preview.src}
                  alt={work.images.preview.alt[locale]}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="aspect-[16/10] w-full rounded-xl border border-line bg-surface-sunken object-cover object-top lg:flex-[7]"
                />
              </ViewTransition>
              <div className="flex min-w-0 flex-col gap-4 lg:flex-[5] lg:py-4 lg:pr-6">
                <span className="inline-flex items-center gap-2 text-meta text-ink-muted">
                  {work.year} ·{' '}
                  <StatusBadge status={work.status} label={status(work.status)} muted />
                </span>
                <h3 className="type-card text-[30px]/[1.15]">{work.name}</h3>
                <p className="text-[17px]/7 text-ink-muted">{work.summary[locale]}</p>
                <ul className="flex flex-wrap gap-2">
                  {work.tags[locale].map((tag) => (
                    <li key={tag}>
                      <Tag>{tag}</Tag>
                    </li>
                  ))}
                </ul>
                <div className="mt-0 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
                  <span className="text-label text-ink-muted uppercase">
                    {work.cardStack.join(' · ')}
                  </span>
                  <span className="tq-link text-button group-hover:[background-size:100%_1px]">
                    {t('cardCta')}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
