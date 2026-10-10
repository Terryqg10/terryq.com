import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { legalUpdated } from '@/content/legal';
import { routeLabel } from '@/i18n/route-label';
import { getLocale, getTranslations } from 'next-intl/server';
import { legalMdxComponents } from './mdx-components';

type LegalKind = 'notice' | 'privacy';

const routes = { notice: '/legal-notice', privacy: '/privacy' } as const;

/**
 * Plantilla de las páginas legales (spec §8.8): etiqueta de ruta, h1, fecha de actualización y el
 * MDX del idioma. En inglés lleva arriba el aviso de traducción de cortesía.
 */
export async function LegalPage({ kind }: { kind: LegalKind }) {
  const [t, locale] = await Promise.all([getTranslations('legal'), getLocale()]);
  const { default: Content } = await import(`@/content/legal/${locale}/${kind}.mdx`);
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(legalUpdated),
  );

  return (
    <main id="contenido">
      <Container>
        <article className="flex flex-col gap-6 py-16 lg:py-24">
          <header className="flex flex-col gap-6">
            <SectionLabel kind="route">{routeLabel(routes[kind], locale)}</SectionLabel>
            <h1 className="type-page">
              {kind === 'notice' ? t('noticeTitle') : t('privacyTitle')}
            </h1>
            <p className="text-meta text-ink-muted">{t('updated', { date: updated })}</p>
            {locale === 'en' ? (
              <p className="max-w-text rounded-xl border border-line bg-surface px-4 py-3 text-small text-ink-muted">
                {t('courtesy')}
              </p>
            ) : null}
          </header>
          <div className="flex max-w-text flex-col gap-4">
            <Content components={legalMdxComponents} />
          </div>
        </article>
      </Container>
    </main>
  );
}
