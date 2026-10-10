import { CodeHeadline } from '@/components/ui/CodeHeadline';
import { getTranslations } from 'next-intl/server';
import { QuickFacts } from './QuickFacts';

/**
 * Mi historia (spec §8.5, fila 2): ficha sticky de «Datos rápidos» a la izquierda y la historia a
 * la derecha, con la frase destacada en un `CodeHeadline` `blockquote`.
 */
export async function Story() {
  const t = await getTranslations('about');
  const hl = (chunks: React.ReactNode) => <span className="text-ink">{chunks}</span>;

  return (
    <section
      aria-label={t('storyLabel')}
      data-reveal
      className="grid grid-cols-12 items-start gap-x-6 gap-y-12 border-t border-line py-16 lg:py-24"
    >
      <QuickFacts />

      <div className="col-span-12 flex flex-col gap-14 lg:col-span-7 lg:col-start-6">
        <div className="flex flex-col gap-4">
          <p className="text-meta text-accent">{t('fromLabel')}</p>
          <p className="max-w-160 text-[16px]/[27px] text-ink-muted md:text-[18px]/[30px]">
            {t.rich('from', { hl })}
          </p>
        </div>

        <figure className="m-0 flex flex-col gap-4 border-y border-line py-10">
          <span className="text-meta text-ink-muted">{t('aimLabel')}</span>
          <CodeHeadline as="blockquote">{t('aim')}</CodeHeadline>
        </figure>

        <div className="flex flex-col gap-4">
          <p className="max-w-160 text-[16px]/[27px] text-ink-muted md:text-[18px]/[30px]">
            {t.rich('values', { hl })}
          </p>
          <p className="max-w-160 text-[16px]/[27px] text-ink-muted md:text-[18px]/[30px]">
            {t('persistent')}
          </p>
        </div>
      </div>
    </section>
  );
}
