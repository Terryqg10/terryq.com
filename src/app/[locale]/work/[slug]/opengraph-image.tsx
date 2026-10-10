import { workSlugs, type WorkSlug } from '@/content/work/slugs';
import { routing } from '@/i18n/routing';
import { ogContentType, ogSize, renderOgImage } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => workSlugs.map((slug) => ({ locale, slug })));
}

const isWorkSlug = (value: string): value is WorkSlug => workSlugs.some((slug) => slug === value);

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isWorkSlug(slug)) throw new Error(`Trabajo desconocido: ${slug}`);
  return renderOgImage({ locale, page: 'case', slug });
}
