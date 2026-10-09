import { Logo } from '@/components/layout/Logo';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { TextLink } from '@/components/ui/TextLink';
import { routeLabel } from '@/i18n/route-label';
import { site } from '@/lib/site';
import { getLocale, getTranslations } from 'next-intl/server';
import Image, { type StaticImageData } from 'next/image';

/**
 * Sobre mí (spec §8.1, fila 5). Con `site.avatar`, la ilustración; sin ella, una caja
 * `surface-sunken` con el monograma TQ centrado (§9.6).
 */
export async function AboutTeaser() {
  const t = await getTranslations('home.about');
  const locale = await getLocale();
  const avatar: StaticImageData | null = site.avatar;

  const facts = [
    { label: t('locationLabel'), value: t('locationValue') },
    { label: t('educationLabel'), value: t('educationValue') },
    { label: t('stackLabel'), value: t('stackValue') },
  ];

  return (
    <section
      data-reveal
      aria-labelledby="about-t"
      className="flex flex-col gap-10 border-t border-line py-16 lg:flex-row lg:items-center lg:gap-16 lg:py-24"
    >
      <div className="w-full max-w-100 lg:flex-[4]">
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            sizes="400px"
            className="h-auto w-full rounded-3xl border border-line bg-surface-sunken"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid aspect-[400/440] w-full place-items-center rounded-3xl border border-line bg-surface-sunken"
          >
            <Logo height={40} className="h-auto w-2/5 text-ink" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-6 lg:flex-[8]">
        <SectionLabel kind="route">{routeLabel('/about', locale)}</SectionLabel>
        <h2 id="about-t" className="type-section">
          {t('title')}
        </h2>
        <p className="max-w-160 text-body-l text-ink-muted">
          {t('lead')} <span className="text-ink">{t('highlight')}</span>
        </p>
        <dl className="max-w-160 border-t border-line text-[15px]/6">
          {facts.map((fact) => (
            <div key={fact.label} className="grid grid-cols-12 gap-4 border-b border-line py-3">
              <dt className="col-span-12 text-meta text-ink-muted sm:col-span-3">{fact.label}</dt>
              <dd className="col-span-12 sm:col-span-9">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <TextLink href="/about" className="self-start py-1 text-button">
          {t('cta')}
        </TextLink>
      </div>
    </section>
  );
}
