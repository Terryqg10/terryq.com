import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { site } from '@/lib/site';
import { cn } from '@/lib/cn';
import { Code } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

const steps = ['spec', 'tasks', 'impl', 'review'] as const;

function Who({ who, label }: { who: 'me' | 'ai'; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-meta">
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full',
          who === 'me' ? 'bg-accent' : 'box-border border-[1.5px] border-ink-muted',
        )}
      />
      {label}
    </span>
  );
}

/** Cómo uso la IA (spec §8.4, UI28): texto a la izquierda y el panel «Del papel a producción». */
export async function AiPanel() {
  const t = await getTranslations('services');

  const who = (key: (typeof steps)[number]) =>
    t(`ai.steps.${key}.who`) === 'me' ? ('me' as const) : ('ai' as const);

  return (
    <section
      id={t('anchors.ai')}
      aria-labelledby="ia-t"
      data-reveal
      className="grid scroll-mt-24 grid-cols-12 gap-x-6 gap-y-10 border-t border-line py-16 lg:py-24"
    >
      <div className="col-span-12 flex flex-col gap-5 lg:col-span-5 lg:pr-4">
        <SectionLabel kind="anchor">{t('anchors.ai')}</SectionLabel>
        <h2 id="ia-t" className="type-section">
          {t('ai.title')}
        </h2>
        <p className="text-[17px]/7 text-ink-muted">
          {t.rich('ai.lead', {
            strong: (chunks) => <strong className="font-semibold text-ink">{chunks}</strong>,
          })}
        </p>
        <dl className="mt-2 border-t border-line text-[15px]/6">
          <div className="flex flex-col gap-1 border-b border-line py-4">
            <dt className="text-meta text-ink-muted">{t('ai.forYouLabel')}</dt>
            <dd>{t('ai.forYou')}</dd>
          </div>
          <div className="flex flex-col gap-1 border-b border-line py-4">
            <dt className="text-meta text-ink-muted">{t('ai.companyLabel')}</dt>
            <dd>{t('ai.company')}</dd>
          </div>
        </dl>
        <Button variant="secondary" size="lg" href={site.repoUrl} external className="self-start">
          <Code aria-hidden="true" size={20} strokeWidth={1.75} />
          {t('ai.repo')}
        </Button>
      </div>

      <figure className="col-span-12 m-0 rounded-3xl bg-surface-sunken p-3 lg:col-span-6 lg:col-start-7">
        <div className="flex items-center justify-between gap-3 px-3 pt-2 pb-3.5 text-label text-ink-muted uppercase">
          <span>{t('ai.panel')}</span>
          <span className="inline-flex items-center gap-3.5 normal-case">
            <Who who="me" label={t('ai.me')} />
            <Who who="ai" label={t('ai.ai')} />
          </span>
        </div>
        <ol className="flex flex-col gap-2">
          {steps.map((key, index) => {
            const owner = who(key);
            // «Revisión» no tiene pieza (la tabla de la spec pone «—»).
            const piece = key === 'review' ? null : t(`ai.steps.${key}.piece`);
            return (
              <li
                key={key}
                className={cn(
                  'grid grid-cols-12 items-center gap-4 rounded-xl p-4',
                  owner === 'me'
                    ? 'bg-accent-soft'
                    : 'border border-dashed border-line-strong bg-surface',
                )}
              >
                <span className="col-span-1 text-meta text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="col-span-8 flex flex-col gap-0.5">
                  <span className="flex flex-wrap items-baseline gap-2.5">
                    <strong className="text-[17px]/6 font-semibold">
                      {t(`ai.steps.${key}.name`)}
                    </strong>
                    {piece ? (
                      <code className="rounded-md bg-surface-sunken px-2 py-px font-mono text-xs/4.5 text-ink">
                        {piece}
                      </code>
                    ) : null}
                  </span>
                  <span className="text-sm/5.5 text-ink-muted">{t(`ai.steps.${key}.text`)}</span>
                </span>
                <span className="col-span-3 justify-self-end">
                  <Who who={owner} label={owner === 'me' ? t('ai.me') : t('ai.ai')} />
                </span>
              </li>
            );
          })}
        </ol>
        <figcaption className="px-3 pt-3.5 pb-1.5 font-mono text-xs/4.5 text-ink-muted">
          {t('ai.footer')}
        </figcaption>
      </figure>
    </section>
  );
}
