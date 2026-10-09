import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { WorkMeta } from '@/content/types';
import { getLocale, getTranslations } from 'next-intl/server';

/**
 * Ficha del proyecto (spec §8.3, UI18): sticky desde `lg`. Lleva el **único** botón `primary` de
 * la página («Abrir la web ↗») y, si hay demo, un `secondary` debajo.
 */
export async function CaseFacts({ meta }: { meta: WorkMeta }) {
  const t = await getTranslations('case');
  const status = await getTranslations('common.status');
  const locale = await getLocale();

  const rows: { label: string; value: React.ReactNode }[] = [
    ...meta.facts.map((fact) => ({ label: fact.label[locale], value: fact.value[locale] })),
    { label: t('facts.role'), value: t('role') },
    {
      label: t('facts.year'),
      value: (
        <span className="tabular-nums">
          {meta.year}
          {meta.yearNote ? ` (${meta.yearNote[locale]})` : ''}
        </span>
      ),
    },
    {
      label: t('facts.status'),
      value: <StatusBadge status={meta.status} label={status(meta.status)} />,
    },
  ];

  return (
    <aside aria-label={t('factsLabel')} className="lg:sticky lg:top-26">
      <Card className="flex flex-col gap-2 px-6 pt-2 pb-6">
        <dl className="text-small">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-12 gap-2 border-b border-line py-3.5 last:border-b-0"
            >
              <dt className="col-span-4 font-mono text-xs/5.5 text-ink-muted">{row.label}</dt>
              <dd className="col-span-8">{row.value}</dd>
            </div>
          ))}
        </dl>

        {meta.notice ? (
          <p className="rounded-xl bg-accent-soft px-4 py-3 text-small text-ink">
            {meta.notice[locale]}
          </p>
        ) : null}

        <div className="mt-2 flex flex-col gap-3">
          <Button variant="primary" href={meta.siteUrl} external className="w-full">
            {t('openSite')}
          </Button>
          {meta.demoUrl ? (
            <Button variant="secondary" href={meta.demoUrl} external className="w-full">
              {t('tryDemo')}
            </Button>
          ) : null}
        </div>
      </Card>
    </aside>
  );
}
