import { workSlugs } from '@/content/work/slugs';
import { siteOrigin } from '@/lib/seo';
import { publicPath } from '@/i18n/public-path';
import { routing } from '@/i18n/routing';
import type { MetadataRoute } from 'next';

type Page = Parameters<typeof publicPath>[0];

/** Páginas indexables (spec §11.4). No están la 404 ni la página de revisión de UI. */
const pages: readonly Page[] = [
  '/',
  '/work',
  '/services',
  '/about',
  '/contact',
  '/legal-notice',
  '/privacy',
];

/** La portada va sin la barra final, igual que su canonical (`https://terryq.com`). */
const absolute = (origin: string, path: string) => (path === '/' ? origin : `${origin}${path}`);

/** Todas las páginas indexables × 2 idiomas, cada una con sus alternates; `lastModified` = build. */
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin().origin;
  const lastModified = new Date();
  const entries: { internal: Page; slug?: (typeof workSlugs)[number] }[] = [
    ...pages.map((internal) => ({ internal })),
    ...workSlugs.map((slug) => ({ internal: '/work/[slug]' as const, slug })),
  ];

  return entries.flatMap(({ internal, slug }) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        absolute(origin, publicPath(internal, locale, slug)),
      ]),
    );
    return routing.locales.map((locale) => ({
      url: languages[locale] as string,
      lastModified,
      alternates: { languages },
    }));
  });
}
