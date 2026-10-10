import { Tag } from '@/components/ui/Tag';
import { getTranslations } from 'next-intl/server';

const stack = ['Next.js', 'TypeScript', 'React', 'Supabase', 'Tailwind CSS', 'Vercel'] as const;

/** Datos rápidos: ficha fija desde `lg` (spec §8.5, fila 2). Las tecnologías son chips. */
export async function QuickFacts() {
  const t = await getTranslations('about');

  const rows = [
    { label: t('facts.location.label'), value: t('facts.location.value') },
    { label: t('facts.education.label'), value: t('facts.education.value') },
    { label: t('facts.languages.label'), value: t('facts.languages.value') },
  ];

  return (
    <aside
      aria-labelledby="facts-t"
      className="col-span-12 rounded-2xl border border-line bg-surface px-7 pt-2 pb-6 shadow-sm lg:sticky lg:top-26 lg:col-span-4 lg:self-start"
    >
      <h2 id="facts-t" className="py-4 text-label text-ink-muted uppercase">
        {t('factsTitle')}
      </h2>
      <dl className="text-[14px]/[22px] md:text-[15px]/[23px]">
        {rows.map((row) => (
          <div key={row.label} className="border-t border-line py-3.5">
            <dt className="font-mono text-xs/4.5 text-ink-muted">{row.label}</dt>
            <dd className="mt-1">{row.value}</dd>
          </div>
        ))}
        <div className="border-t border-line pt-3.5">
          <dt className="font-mono text-xs/4.5 text-ink-muted">{t('facts.tech.label')}</dt>
          <dd className="mt-2">
            <ul className="flex flex-wrap gap-1.5">
              {stack.map((tech) => (
                <li key={tech}>
                  <Tag>{tech}</Tag>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </aside>
  );
}
