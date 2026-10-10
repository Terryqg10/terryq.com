import { asLocale, buildMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { works } from '@/content/work';
import { WorkGithub } from '@/features/work/WorkGithub';
import { WorkTable } from '@/features/work/WorkTable';
import { routeLabel } from '@/i18n/route-label';
import { getLocale, getTranslations } from 'next-intl/server';

/** Años de los proyectos: `2026` o `2024–2026`. */
function yearsOf(years: readonly number[]): string {
  const first = Math.min(...years);
  const last = Math.max(...years);
  return first === last ? String(first) : `${first}–${last}`;
}

export default async function WorkPage() {
  const t = await getTranslations('work');
  const locale = await getLocale();

  return (
    <main id="contenido">
      <Container className="py-16 lg:py-24">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-12">
          <div className="flex max-w-160 flex-col gap-3">
            <SectionLabel kind="route">{routeLabel('/work', locale)}</SectionLabel>
            <h1 className="type-page">{t('title')}</h1>
            <p className="text-[17px]/7 text-ink-muted">{t('intro')}</p>
          </div>
          <p className="text-meta text-ink-muted">
            {t('count', { n: works.length, years: yearsOf(works.map((work) => work.year)) })}
          </p>
        </header>

        <section aria-label={t('listLabel')}>
          <WorkTable />
          <p className="mt-4 hidden text-meta text-ink-muted [@media(hover:hover)_and_(pointer:fine)]:block">
            {t('hint')}
          </p>
        </section>

        <WorkGithub />
      </Container>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps<'/[locale]/work'>): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({ locale: asLocale(locale), page: 'work' });
}
