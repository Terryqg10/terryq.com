import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { site } from '@/lib/site';
import { Code } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

/** Bloque «Más código y experimentos en GitHub» al final de /trabajos (spec §8.2, UI16). */
export async function WorkGithub() {
  const t = await getTranslations('work.github');

  return (
    <Card className="mt-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
      <span
        aria-hidden="true"
        className="grid size-14 shrink-0 place-items-center rounded-xl bg-surface-sunken text-ink"
      >
        <Code size={24} strokeWidth={1.75} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 className="type-card">{t('title')}</h2>
        <p className="text-ink-muted">{t('text')}</p>
      </div>
      <Button variant="secondary" href={site.github} external>
        {t('cta')}
      </Button>
    </Card>
  );
}
