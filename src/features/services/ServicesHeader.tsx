import { SectionLabel } from '@/components/ui/SectionLabel';
import { routeLabel } from '@/i18n/route-label';
import { getLocale, getTranslations } from 'next-intl/server';

const keys = ['web', 'brand', 'faq', 'process', 'ai'] as const;

/**
 * Cabecera de /servicios y el índice «En esta página» (spec §8.4, UI22). En escritorio es una
 * lista vertical; en móvil, chips con scroll horizontal dentro de una región enfocable.
 */
export async function ServicesHeader() {
  const t = await getTranslations('services');
  const locale = await getLocale();

  const links = keys.map((key) => ({
    key,
    href: `#${t(`anchors.${key}`)}`,
    label: t(`tocLabels.${key}`),
  }));

  return (
    <header className="flex flex-wrap items-end justify-between gap-10 pt-16 pb-12 lg:pt-24 lg:pb-16">
      <div className="flex min-w-0 flex-col gap-5 lg:flex-[1_1_620px]">
        <SectionLabel kind="route">{routeLabel('/services', locale)}</SectionLabel>
        <h1 className="type-page">{t('title')}</h1>
        <p className="max-w-160 text-body-l text-ink-muted">{t('intro')}</p>
      </div>

      {/* Escritorio */}
      <nav
        aria-label={t('toc')}
        className="hidden flex-col gap-1 border-l border-line pl-6 lg:flex lg:flex-[0_1_300px]"
      >
        <span className="pb-2 text-label text-ink-muted uppercase">{t('toc')}</span>
        {links.map((link) => (
          <a key={link.key} href={link.href} className="self-start tq-link py-1 text-button">
            {link.label}
          </a>
        ))}
      </nav>

      {/* Móvil: chips con scroll horizontal, en una región enfocable */}
      <nav aria-label={t('toc')} className="w-full lg:hidden">
        <div role="region" tabIndex={0} aria-label={t('toc')} className="overflow-x-auto pb-2">
          <ul className="flex w-max gap-2">
            {links.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-button whitespace-nowrap"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
