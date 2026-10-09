import { TextLink } from '@/components/ui/TextLink';
import { Card } from '@/components/ui/Card';
import type { Review } from '@/content/types';
import { getWork } from '@/content/work';
import { site } from '@/lib/site';
import { getLocale, getTranslations } from 'next-intl/server';
import { SectionHeader } from './section-header';

/**
 * Opiniones (spec §8.1, fila 3). Solo se pinta si hay reseñas reales (§9.6): sin reseñas no
 * devuelve nada y no queda hueco. Rejilla de 3 desde `lg` y carrusel con `scroll-snap` en móvil.
 */
export async function Reviews({ reviews }: { reviews: readonly Review[] }) {
  if (reviews.length === 0) return null;

  const t = await getTranslations('home.reviews');
  const locale = await getLocale();

  return (
    <section
      data-reveal
      aria-labelledby="reviews-t"
      className="border-t border-line py-16 lg:py-24"
    >
      <SectionHeader
        label={t('label').slice(1)}
        id="reviews-t"
        title={t('title')}
        intro={t('intro')}
        action={
          site.googleReviewsUrl ? (
            <TextLink href={site.googleReviewsUrl} external className="py-3 text-button">
              {t('viewAll')}
            </TextLink>
          ) : null
        }
      />

      <div
        role="region"
        tabIndex={0}
        aria-label={t('regionLabel')}
        className="snap-x snap-mandatory overflow-x-auto pb-2 lg:overflow-visible lg:pb-0"
      >
        <ul className="flex gap-4 lg:grid lg:grid-cols-3 lg:gap-6">
          {reviews.map((review) => {
            const translated =
              review.quoteLang !== locale ? review.translation?.[locale] : undefined;
            const project = review.project ? getWork(review.project) : null;

            return (
              <li key={review.id} className="w-[85%] shrink-0 snap-start lg:w-auto">
                <Card as="article" className="flex h-full flex-col gap-4 p-6">
                  <p className="text-label text-ink-muted">
                    {review.source === 'google' ? (
                      <>
                        {review.rating ? (
                          <span aria-label={`${review.rating} / 5`}>
                            {'★'.repeat(review.rating)} ·{' '}
                          </span>
                        ) : null}
                        Google
                      </>
                    ) : (
                      t('demoFeedback')
                    )}
                  </p>
                  <blockquote lang={review.quoteLang} className="text-body">
                    “{review.quote}”
                  </blockquote>
                  {translated ? (
                    <p className="text-small text-ink-muted">
                      “{translated}” {t('translated')}
                    </p>
                  ) : null}
                  <p className="mt-auto text-small">
                    <span className="font-semibold">{review.author}</span> · {review.role[locale]}
                    {project ? (
                      <>
                        {' '}
                        ·{' '}
                        <TextLink
                          href={{ pathname: '/work/[slug]', params: { slug: project.slug } }}
                          inline
                        >
                          {t('viewProject')}
                        </TextLink>
                      </>
                    ) : null}
                  </p>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
