import { Logo } from '@/components/layout/Logo';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { routeLabel } from '@/i18n/route-label';
import { getLocale, getTranslations } from 'next-intl/server';
import Image, { type StaticImageData } from 'next/image';

/**
 * Cabecera de /sobre-mi (spec §8.5, UI30). Con retrato, la ilustración y su pie; **sin retrato**,
 * una caja 4:5 `surface-sunken` con el monograma TQ y sin figcaption (§9.6).
 */
export async function AboutHero({ portrait }: { portrait: StaticImageData | null }) {
  const t = await getTranslations('about');
  const locale = await getLocale();

  return (
    <header className="grid grid-cols-12 items-end gap-6 py-16 lg:py-24">
      <div className="col-span-12 flex flex-col gap-6 pb-2 lg:col-span-7">
        <SectionLabel kind="route">{routeLabel('/about', locale)}</SectionLabel>
        <h1 className="type-about">{t('title')}</h1>
        <p className="max-w-150 text-[18px]/[29px] text-ink-muted md:text-[21px]/[33px]">
          {t.rich('lead', { hl: (chunks) => <span className="text-ink">{chunks}</span> })}
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-7 gap-y-2 border-t border-line pt-5 text-meta text-ink-muted">
          <li>{t('intro.location')}</li>
          <li>{t('intro.education')}</li>
          <li>{t('intro.stack')}</li>
        </ul>
      </div>

      <figure className="col-span-12 m-0 flex max-w-100 flex-col gap-3 lg:col-span-4 lg:col-start-9">
        {portrait ? (
          <>
            <Image
              src={portrait}
              alt=""
              sizes="(min-width: 1024px) 400px, 100vw"
              className="aspect-[4/5] w-full rounded-3xl border border-line bg-surface-sunken object-cover"
            />
            <figcaption className="text-meta text-ink-muted">{t('photoCaption')}</figcaption>
          </>
        ) : (
          <div
            aria-hidden="true"
            className="grid aspect-[4/5] w-full place-items-center rounded-3xl border border-line bg-surface-sunken"
          >
            <Logo height={40} className="h-auto w-2/5 text-ink" />
          </div>
        )}
      </figure>
    </header>
  );
}
