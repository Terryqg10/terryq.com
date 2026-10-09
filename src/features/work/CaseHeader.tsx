import { StatusBadge } from '@/components/ui/StatusBadge';
import type { WorkMeta } from '@/content/types';
import { getPosition } from '@/content/work';
import { Link } from '@/i18n/navigation';
import { routeLabel } from '@/i18n/route-label';
import { ArrowLeft } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

/** Cabecera del caso (spec §8.3, UI17): volver, posición, ruta, h1 y fila de metadatos. */
export async function CaseHeader({ meta }: { meta: WorkMeta }) {
  const t = await getTranslations('case');
  const status = await getTranslations('common.status');
  const locale = await getLocale();

  return (
    <header className="flex flex-col gap-7 pt-10 pb-10 lg:pt-14 lg:pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/work"
          aria-label={t('backLabel')}
          className="inline-flex items-center gap-2 tq-link py-3 text-button"
        >
          <ArrowLeft aria-hidden="true" size={20} strokeWidth={1.75} />
          {t('back')}
        </Link>
        <span className="text-meta text-ink-muted">{getPosition(meta.slug)}</span>
      </div>

      <p className="mt-6 text-meta text-ink-muted">
        <span className="text-accent">/</span>
        {routeLabel('/work', locale)}
        <span className="text-accent">/</span>
        {meta.slug}
      </p>
      <h1 className="max-w-260 type-title">{meta.title[locale]}</h1>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-meta text-ink-muted">
        <span className="text-ink">{meta.name}</span>
        <span>{meta.sector[locale]}</span>
        <StatusBadge status={meta.status} label={`${status(meta.status)} · ${meta.year}`} muted />
        <span>{new URL(meta.siteUrl).hostname}</span>
      </div>
    </header>
  );
}
