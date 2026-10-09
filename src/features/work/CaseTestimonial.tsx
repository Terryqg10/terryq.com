import type { Testimonial } from '@/content/types';
import { getLocale, getTranslations } from 'next-intl/server';

/** Testimonio del cliente: solo se pinta si `meta.testimonial` existe (spec §9.6). */
export async function CaseTestimonial({ testimonial }: { testimonial: Testimonial }) {
  const t = await getTranslations('case');
  const locale = await getLocale();
  const translation =
    testimonial.quoteLang !== locale ? testimonial.translation?.[locale] : undefined;

  return (
    <figure className="m-0 mt-2 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-7 shadow-sm">
      <span className="text-meta text-ink-muted">{t('testimonial')}</span>
      <blockquote lang={testimonial.quoteLang} className="m-0 text-xl/8">
        “{testimonial.quote}”
      </blockquote>
      {translation ? (
        <p className="text-small text-ink-muted">
          “{translation}” {t('translated')}
        </p>
      ) : null}
      <figcaption className="text-small text-ink-muted">
        <strong className="font-semibold text-ink">{testimonial.author}</strong> ·{' '}
        {testimonial.role[locale]}
      </figcaption>
    </figure>
  );
}
