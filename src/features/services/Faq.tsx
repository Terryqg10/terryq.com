import { SectionLabel } from '@/components/ui/SectionLabel';
import { TextLink } from '@/components/ui/TextLink';
import { ChevronDown } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

const questions = ['cost', 'time', 'need', 'mine', 'changes', 'location', 'ai'] as const;

/** Preguntas frecuentes (spec §8.4, UI25): `<details>` nativos, **la primera abierta**. */
export async function Faq() {
  const t = await getTranslations('services');
  const aiAnchor = t('anchors.ai');

  return (
    <section
      id={t('anchors.faq')}
      aria-labelledby="faq-t"
      data-reveal
      className="grid scroll-mt-24 grid-cols-12 gap-x-6 gap-y-10 border-t border-line py-16 lg:py-24"
    >
      <div className="col-span-12 flex flex-col gap-4 lg:sticky lg:top-26 lg:col-span-4 lg:self-start">
        <SectionLabel kind="anchor">{t('anchors.faq')}</SectionLabel>
        <h2 id="faq-t" className="type-section">
          {t('faq.title')}
        </h2>
        <p className="text-base/6.5 text-ink-muted">
          {t.rich('faq.help', {
            contact: (chunks) => (
              <TextLink href="/contact" inline className="font-semibold text-ink">
                {chunks}
              </TextLink>
            ),
          })}
        </p>
      </div>

      <div className="col-span-12 border-t border-line lg:col-span-7 lg:col-start-6">
        {questions.map((key, index) => (
          <details key={key} open={index === 0} className="group border-b border-line">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
              <span className="text-lg/6.5 font-semibold">{t(`faq.items.${key}.q`)}</span>
              <ChevronDown
                aria-hidden="true"
                size={20}
                strokeWidth={1.75}
                className="shrink-0 transition-transform duration-250 group-open:rotate-180"
              />
            </summary>
            <p className="max-w-170 pr-12 pb-6 text-base/6.5 text-ink-muted">
              {t.rich(`faq.items.${key}.a`, {
                ai: (chunks) => (
                  <a
                    href={`#${aiAnchor}`}
                    className="font-semibold text-ink underline underline-offset-4"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
