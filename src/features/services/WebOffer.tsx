import { Card } from '@/components/ui/Card';
import { TextLink } from '@/components/ui/TextLink';
import { Check } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

const always = ['custom', 'mobile', 'speed', 'seo', 'form', 'legal', 'session'] as const;

const exampleLink = (slug: 'hb-construcciones' | 'zona-f' | 'finanzas-personales') =>
  function ExampleLink(chunks: ReactNode) {
    return <TextLink href={{ pathname: '/work/[slug]', params: { slug } }}>{chunks}</TextLink>;
  };

/** Bloque «Lo principal · Web»: texto, tabla de tipos con ejemplos enlazados y «Siempre incluido». */
export async function WebOffer() {
  const t = await getTranslations('services');

  const types = [
    {
      key: 'landing',
      title: t('web.landing.title'),
      audience: t('web.landing.audience'),
      includes: t('web.landing.includes'),
      example: t.rich('web.landing.example', { hb: exampleLink('hb-construcciones') }),
    },
    {
      key: 'corporate',
      title: t('web.corporate.title'),
      audience: t('web.corporate.audience'),
      includes: t('web.corporate.includes'),
      example: null,
    },
    {
      key: 'app',
      title: t('web.app.title'),
      audience: t('web.app.audience'),
      includes: t('web.app.includes'),
      example: t.rich('web.app.example', {
        fp: exampleLink('finanzas-personales'),
        zf: exampleLink('zona-f'),
      }),
    },
  ];

  return (
    <section
      id={t('anchors.web')}
      aria-labelledby="web-t"
      data-reveal
      className="mb-6 scroll-mt-24"
    >
      <Card className="flex flex-col gap-10 p-6 md:p-12">
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 flex flex-col gap-4 lg:col-span-5">
            <span className="text-label text-accent uppercase">{t('web.core')}</span>
            <h2 id="web-t" className="type-section-lg">
              {t('web.title')}
            </h2>
          </div>
          <p className="col-span-12 max-w-160 text-[17px]/7 text-ink-muted lg:col-span-7">
            {t('web.lead')} <span className="text-ink">{t('web.highlight')}</span>
          </p>
        </div>

        <div role="table" aria-label={t('web.typesLabel')} className="border-t border-line">
          <div
            role="row"
            className="hidden grid-cols-12 gap-6 border-b border-line py-3.5 text-label text-ink-muted uppercase md:grid"
          >
            <span role="columnheader" className="col-span-3">
              {t('web.columns.type')}
            </span>
            <span role="columnheader" className="col-span-4">
              {t('web.columns.audience')}
            </span>
            <span role="columnheader" className="col-span-5">
              {t('web.columns.includes')}
            </span>
          </div>
          {types.map((row) => (
            <div
              key={row.key}
              role="row"
              className="grid gap-2 border-b border-line py-5.5 md:grid-cols-12 md:items-baseline md:gap-6"
            >
              <span role="rowheader" className="type-card md:col-span-3">
                {row.title}
              </span>
              <span role="cell" className="text-[15px]/6 text-ink-muted md:col-span-4">
                <span className="block text-meta text-ink-muted md:hidden">
                  {t('web.columns.audience')}
                </span>
                {row.audience}
              </span>
              <span role="cell" className="flex flex-col gap-2.5 text-[15px]/6 md:col-span-5">
                <span>
                  <span className="block text-meta text-ink-muted md:hidden">
                    {t('web.columns.includes')}
                  </span>
                  {row.includes}
                </span>
                {row.example ? (
                  <span className="self-start text-meta text-accent">{row.example}</span>
                ) : null}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-x-6 gap-y-4 rounded-xl bg-surface-sunken px-6 py-6 md:px-7">
          <p className="col-span-12 text-label text-ink-muted uppercase md:col-span-3">
            {t('web.always')}
          </p>
          <ul className="col-span-12 grid gap-x-6 gap-y-3 text-[15px]/6 sm:grid-cols-2 md:col-span-9">
            {always.map((key) => (
              <li key={key} className="flex items-start gap-2.5">
                <Check
                  aria-hidden="true"
                  size={20}
                  strokeWidth={1.75}
                  className="mt-0.5 shrink-0 text-accent"
                />
                {t(`web.alwaysItems.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </section>
  );
}
