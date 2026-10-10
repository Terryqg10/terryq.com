import { TextLink } from '@/components/ui/TextLink';
import { routeLabel } from '@/i18n/route-label';
import { site, whatsappHref } from '@/lib/site';
import { getLocale, getTranslations } from 'next-intl/server';

/**
 * ¿Hablamos? (spec §8.1, fila 6): el único bloque de color de la portada. El email es un enlace
 * grande, no un botón `primary`.
 */
export async function Closing() {
  const t = await getTranslations('home.closing');
  const locale = await getLocale();

  return (
    <section
      data-reveal
      aria-labelledby="cta-t"
      className="mb-16 flex flex-wrap items-end justify-between gap-10 rounded-2xl bg-accent-soft px-6 py-12 lg:mb-24 lg:px-16 lg:py-18"
    >
      <div className="flex min-w-0 flex-col gap-4 lg:flex-1">
        <p className="text-meta text-accent">/{routeLabel('/contact', locale)}</p>
        <h2 id="cta-t" className="type-closing">
          {t('title')}
        </h2>
        <p className="max-w-130 text-body-l text-ink-muted">{t('text')}</p>
      </div>

      <div className="flex flex-col items-start gap-3">
        <a href={`mailto:${site.email}`} className="tq-hit tq-link type-card font-semibold">
          {site.email}
        </a>
        <div className="flex flex-wrap items-center gap-5">
          <TextLink href={whatsappHref(locale)} external className="py-3 text-base font-semibold">
            {t('whatsapp')}
          </TextLink>
          <span className="text-meta text-ink-muted">{t('reply')}</span>
        </div>
      </div>
    </section>
  );
}
