import { SectionLabel } from '@/components/ui/SectionLabel';
import { getTranslations } from 'next-intl/server';

const steps = ['talk', 'quote', 'design', 'build', 'launch', 'support'] as const;

/** Cómo trabajo (spec §8.4, UI27): tabla de 6 pasos; en móvil, una lista con «Recibes ·». */
export async function Process() {
  const t = await getTranslations('services');

  return (
    <section
      id={t('anchors.process')}
      aria-labelledby="proc-t"
      data-reveal
      className="scroll-mt-24 border-t border-line py-16 lg:py-24"
    >
      <div className="mb-10 grid grid-cols-12 items-end gap-6 lg:mb-12">
        <div className="col-span-12 flex flex-col gap-3 lg:col-span-6">
          <SectionLabel kind="anchor">{t('anchors.process')}</SectionLabel>
          <h2 id="proc-t" className="type-section">
            {t('process.title')}
          </h2>
        </div>
        <p className="col-span-12 text-[17px]/7 text-ink-muted lg:col-span-6 lg:col-start-7">
          {t('process.intro')}
        </p>
      </div>

      <ol className="rounded-2xl border border-line bg-surface shadow-sm">
        <li
          aria-hidden="true"
          className="hidden grid-cols-12 gap-6 border-b border-line px-8 py-3 text-label text-ink-muted uppercase md:grid"
        >
          <span className="col-span-1">{t('process.columns.step')}</span>
          <span className="col-span-3" />
          <span className="col-span-4">{t('process.columns.what')}</span>
          <span className="col-span-4">{t('process.columns.get')}</span>
        </li>
        {steps.map((key, index) => (
          <li
            key={key}
            className="grid gap-2 border-b border-line px-5 py-6 last:border-b-0 md:grid-cols-12 md:gap-6 md:px-8"
          >
            <span className="text-[28px]/none font-bold text-ink-subtle tabular-nums md:col-span-1">
              {String(index + 1).padStart(2, '0')}
            </span>
            <strong className="text-lg/6.5 font-semibold md:col-span-3">
              {t(`process.steps.${key}.name`)}
            </strong>
            <span className="text-[15px]/6 text-ink-muted md:col-span-4">
              {t(`process.steps.${key}.what`)}
            </span>
            <span className="text-[15px]/6 md:col-span-4">
              <span className="text-meta text-ink-muted md:hidden">{t('process.youGet')} </span>
              {t(`process.steps.${key}.get`)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
