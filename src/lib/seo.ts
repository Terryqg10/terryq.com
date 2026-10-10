import { getWork } from '@/content/work';
import type { Locale, WorkSlug } from '@/content/types';
import { publicPath } from '@/i18n/public-path';
import { routing } from '@/i18n/routing';
import { site } from '@/lib/site';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

/** Páginas con metadata propia. Los casos llevan además su `slug`. */
export type SeoPage =
  | 'home'
  | 'work'
  | 'services'
  | 'about'
  | 'contact'
  | 'legal-notice'
  | 'privacy'
  | 'case'
  | 'not-found';

/** Origen del sitio: `NEXT_PUBLIC_SITE_URL` y, si no existe, el de `site.ts` (spec §11.1). */
export const siteOrigin = () => new URL(process.env.NEXT_PUBLIC_SITE_URL ?? site.url);

const openGraphLocales: Record<Locale, string> = { es: 'es_ES', en: 'en_GB' };

/** Ruta pública de una página en un idioma (`/trabajos`, `/en/work/zona-f`…). */
export function pagePath(page: Exclude<SeoPage, 'not-found'>, locale: Locale, slug?: WorkSlug) {
  if (page === 'home') return publicPath('/', locale);
  if (page === 'case') return publicPath('/work/[slug]', locale, slug);
  return publicPath(`/${page}` as const, locale);
}

/** `canonical` (la URL propia) y `languages` con `es`, `en` y `x-default` → ES (spec §5.5). */
export function alternatesFor(
  page: Exclude<SeoPage, 'not-found'>,
  locale: Locale,
  slug?: WorkSlug,
) {
  const languages = Object.fromEntries(
    routing.locales.map((candidate) => [candidate, pagePath(page, candidate, slug)]),
  ) as Record<Locale, string>;
  return {
    canonical: pagePath(page, locale, slug),
    languages: { ...languages, 'x-default': languages[routing.defaultLocale] },
  };
}

const maxCaseTitle = 60;

/** `{nombre} · {titular} · Terry Quiñonez`, o con «Caso de estudio» si pasa de ~60 caracteres. */
export function caseTitle(name: string, headline: string, fallback: string, siteName: string) {
  const full = `${name} · ${headline} · ${siteName}`;
  return full.length <= maxCaseTitle ? full : `${name} · ${fallback} · ${siteName}`;
}

type Text = { title: string; description?: string };

async function textFor(page: SeoPage, locale: Locale, slug?: WorkSlug): Promise<Text> {
  const t = await getTranslations({ locale, namespace: 'seo' });
  switch (page) {
    case 'home':
    case 'work':
    case 'services':
    case 'about':
    case 'contact':
      return { title: t(`${page}.title`), description: t(`${page}.description`) };
    case 'legal-notice':
    case 'privacy': {
      const legal = await getTranslations({ locale, namespace: 'legal' });
      const title = page === 'privacy' ? legal('privacyTitle') : legal('noticeTitle');
      return { title: `${title} · ${t('siteName')}` };
    }
    case 'not-found':
      return { title: t('notFound.title') };
    case 'case': {
      if (!slug) throw new Error('Un caso necesita su slug');
      const work = getWork(slug);
      return {
        title: caseTitle(work.name, work.title[locale], t('caseFallback'), t('siteName')),
        description: work.summary[locale],
      };
    }
  }
}

/**
 * `title`, `description`, `alternates`, `openGraph` y `twitter` de una página (spec §11.1).
 * La 404 solo lleva título y `noindex`.
 */
export async function buildMetadata({
  locale,
  page,
  slug,
}: {
  locale: Locale;
  page: SeoPage;
  slug?: WorkSlug;
}): Promise<Metadata> {
  const { title, description } = await textFor(page, locale, slug);
  if (page === 'not-found') return { title, robots: { index: false } };

  const alternates = alternatesFor(page, locale, slug);
  return {
    title,
    description,
    alternates,
    openGraph: {
      type: 'website',
      locale: openGraphLocales[locale],
      siteName: site.person.name,
      title,
      description,
      url: alternates.canonical,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/** El `locale` de `params` es un `string`; si no es un idioma conocido, el predeterminado. */
export const asLocale = (value: string): Locale =>
  routing.locales.find((locale) => locale === value) ?? routing.defaultLocale;
