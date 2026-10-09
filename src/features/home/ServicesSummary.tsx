import { Card } from '@/components/ui/Card';
import { TextLink } from '@/components/ui/TextLink';
import { routeLabel } from '@/i18n/route-label';
import { getLocale, getTranslations } from 'next-intl/server';
import { SectionHeader } from './section-header';

/** Servicios (spec §8.1, fila 4): «Lo principal · Web» con sus 3 filas y «También me encargo de…». */
export async function ServicesSummary() {
  const t = await getTranslations('home.services');
  const locale = await getLocale();

  const rows = [
    { title: t('landingTitle'), text: t('landingText') },
    { title: t('corporateTitle'), text: t('corporateText') },
    { title: t('appTitle'), text: t('appText') },
  ];
  const also = [
    { title: t('brandTitle'), text: t('brandText') },
    { title: t('maintenanceTitle'), text: t('maintenanceText') },
  ];

  return (
    <section data-reveal aria-labelledby="serv-t" className="border-t border-line py-16 lg:py-24">
      <SectionHeader
        label={routeLabel('/services', locale)}
        id="serv-t"
        title={t('title')}
        action={
          <TextLink href="/services" className="py-3 text-button">
            {t('viewAll')}
          </TextLink>
        }
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <Card as="article" className="flex min-w-0 flex-col gap-6 p-6 lg:flex-[7] lg:p-10">
          <span className="text-label text-accent uppercase">{t('core')}</span>
          <h3 className="type-section-lg">{t('webTitle')}</h3>
          <p className="max-w-140 text-[17px]/7 text-ink-muted">{t('webText')}</p>
          <dl className="mt-2 border-t border-line">
            {rows.map((row) => (
              <div key={row.title} className="grid grid-cols-12 gap-4 border-b border-line py-4">
                <dt className="col-span-12 font-semibold sm:col-span-4">{row.title}</dt>
                <dd className="col-span-12 text-[15px]/6 text-ink-muted sm:col-span-8">
                  {row.text}
                </dd>
              </div>
            ))}
          </dl>
        </Card>

        <div className="flex min-w-0 flex-col gap-6 lg:flex-[5]">
          <p className="text-meta text-ink-muted">{t('also')}</p>
          {also.map((item) => (
            <Card key={item.title} as="article" className="flex flex-1 flex-col gap-2.5 p-7">
              <h3 className="type-card">{item.title}</h3>
              <p className="text-[15px]/6 text-ink-muted">{item.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
