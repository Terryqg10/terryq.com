import type { Locale, WorkMeta } from '@/content/types';
import { publicPath } from '@/i18n/public-path';
import { site } from '@/lib/site';

type JsonLd = Readonly<Record<string, unknown>>;

/** Textos de `Person` y `ProfessionalService` que dependen del idioma (ya traducidos). */
export type SiteJsonLdText = { jobTitle: string; tagline: string; country: string };

/** Textos de las migas de pan de un caso. */
export type CaseJsonLdText = { breadcrumbHome: string; breadcrumbWork: string };

const personId = (origin: string) => `${origin}/#person`;

const address = (extra: Record<string, string> = {}) => ({
  '@type': 'PostalAddress',
  addressLocality: site.person.locality,
  addressRegion: site.person.region,
  addressCountry: site.person.country,
  ...extra,
});

/**
 * `Person` y `ProfessionalService` de todas las páginas (spec §11.2). Sin `priceRange`,
 * `aggregateRating` ni reseñas mientras no existan reseñas reales.
 */
export function siteJsonLd(origin: string, locale: Locale, text: SiteJsonLdText): JsonLd {
  const home = `${origin}${publicPath('/', locale)}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId(origin),
        name: site.person.name,
        url: home,
        jobTitle: text.jobTitle,
        address: address(),
        sameAs: [site.github, site.linkedin],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${origin}/#service`,
        name: `${site.person.name} · ${text.tagline}`,
        url: home,
        email: site.email,
        areaServed: [
          { '@type': 'Country', name: text.country },
          { '@type': 'AdministrativeArea', name: 'Comunidad de Madrid' },
        ],
        address: address({ postalCode: site.person.postalCode }),
        founder: { '@id': personId(origin) },
      },
    ],
  };
}

/** `CreativeWork` y `BreadcrumbList` de un caso (spec §11.2). */
export function caseJsonLd(
  origin: string,
  locale: Locale,
  work: WorkMeta,
  text: CaseJsonLdText,
): JsonLd {
  const url = `${origin}${publicPath('/work/[slug]', locale, work.slug)}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        name: work.name,
        headline: work.title[locale],
        url,
        dateCreated: String(work.year),
        creator: { '@id': personId(origin) },
        image: `${origin}${work.images.cover.src.src}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: text.breadcrumbHome,
            item: `${origin}${publicPath('/', locale)}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: text.breadcrumbWork,
            item: `${origin}${publicPath('/work', locale)}`,
          },
          { '@type': 'ListItem', position: 3, name: work.name, item: url },
        ],
      },
    ],
  };
}

/** JSON listo para ir dentro de un `<script>`: se escapa `<` para que nada cierre la etiqueta. */
export const serializeJsonLd = (data: JsonLd): string =>
  JSON.stringify(data).replace(/</g, '\\u003c');
