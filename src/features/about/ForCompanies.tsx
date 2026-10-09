import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { TextLink } from '@/components/ui/TextLink';
import { site } from '@/lib/site';
import { Download } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

/**
 * Para empresas (spec §8.5, fila 3, UI31). **Sin CV el botón de descarga no se muestra** (§9.6) y
 * LinkedIn y GitHub ocupan la columna; con CV, es el único botón `primary` de la página.
 */
export async function ForCompanies({ cv }: { cv: string | null }) {
  const t = await getTranslations('about.companies');

  return (
    <section
      id={t('anchor')}
      aria-labelledby="emp-t"
      data-reveal
      className="mb-16 scroll-mt-24 lg:mb-24"
    >
      <Card className="grid grid-cols-12 items-center gap-x-6 gap-y-8 p-6 md:p-14">
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-7">
          <SectionLabel kind="anchor">{t('anchor')}</SectionLabel>
          <h2 id="emp-t" className="type-section-md">
            {t('title')}
          </h2>
          <p className="max-w-150 text-[17px]/7 text-ink-muted">
            {t.rich('text', {
              hl: (chunks) => <span className="text-ink">{chunks}</span>,
              work: (chunks) => (
                <TextLink href="/work" inline className="font-semibold">
                  {chunks}
                </TextLink>
              ),
            })}
          </p>
        </div>

        <div className="col-span-12 flex flex-col gap-3 lg:col-span-4 lg:col-start-9">
          {cv ? (
            <Button
              variant="primary"
              size="lg"
              href={cv}
              download={cv.split('/').pop() ?? 'cv.pdf'}
              className="w-full"
            >
              <Download aria-hidden="true" size={20} strokeWidth={1.75} />
              {t('cv')}
            </Button>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" href={site.linkedin} external>
              {t('linkedin')}
            </Button>
            <Button variant="secondary" href={site.github} external>
              {t('github')}
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
