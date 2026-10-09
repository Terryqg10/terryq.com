import { cardClasses } from '@/components/ui/card-classes';
import { getNextWork, getPosition } from '@/content/work';
import type { WorkSlug } from '@/content/types';
import { Link } from '@/i18n/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';

/** Siguiente proyecto, en orden circular HB → Zona F → Finanzas → HB (spec §8.3, UI19). */
export async function NextProject({ slug }: { slug: WorkSlug }) {
  const t = await getTranslations('case');
  const cta = await getTranslations('home.work');
  const locale = await getLocale();
  const next = getNextWork(slug);

  return (
    <nav aria-label={t('nextLabel')} data-reveal className="pb-16 lg:pb-24">
      <Link
        href={{ pathname: '/work/[slug]', params: { slug: next.slug } }}
        className={cardClasses({
          interactive: true,
          className: 'group flex flex-col gap-6 p-4 lg:flex-row lg:items-center lg:gap-10',
        })}
      >
        <div className="flex min-w-0 flex-col gap-3 lg:flex-[5] lg:p-6">
          <span className="text-meta text-ink-muted">
            {t('next', { pos: getPosition(next.slug) })}
          </span>
          <span className="type-card text-[30px]/[1.15]">{next.name}</span>
          <span className="text-[17px]/7 text-ink-muted">{next.summary[locale]}</span>
          <span className="mt-2 self-start tq-link text-button group-hover:[background-size:100%_1px]">
            {cta('cardCta')}
          </span>
        </div>
        <Image
          src={next.images.preview.src}
          alt={next.images.preview.alt[locale]}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="aspect-[16/10] w-full rounded-xl border border-line bg-surface-sunken object-cover object-top lg:flex-[7]"
        />
      </Link>
    </nav>
  );
}
