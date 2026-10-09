import { workSlugs, type WorkSlug } from '@/content/work/slugs';
import { routing } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => workSlugs.map((slug) => ({ locale, slug })));
}

const isWorkSlug = (value: string): value is WorkSlug => workSlugs.some((slug) => slug === value);

export default async function Page({ params }: PageProps<'/[locale]/work/[slug]'>) {
  const { slug } = await params;
  if (!isWorkSlug(slug)) notFound();
  const t = await getTranslations('case.titles');
  return (
    <main id="contenido">
      <h1>{t(slug)}</h1>
    </main>
  );
}
