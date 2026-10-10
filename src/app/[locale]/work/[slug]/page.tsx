import { asLocale, buildMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { getWork } from '@/content/work';
import { workSlugs, type WorkSlug } from '@/content/work/slugs';
import { CaseFacts } from '@/features/work/CaseFacts';
import { CaseHeader } from '@/features/work/CaseHeader';
import { CaseHero } from '@/features/work/CaseHero';
import { NextProject } from '@/features/work/NextProject';
import { createWorkMdxComponents } from '@/features/work/mdx-components';
import { numberSections, sectionKindsOf } from '@/features/work/sections';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => workSlugs.map((slug) => ({ locale, slug })));
}

const isWorkSlug = (value: string): value is WorkSlug => workSlugs.some((slug) => slug === value);

export default async function CasePage({ params }: PageProps<'/[locale]/work/[slug]'>) {
  const { locale, slug } = await params;
  if (!isWorkSlug(slug)) notFound();

  const meta = getWork(slug);
  // La narrativa de cada idioma es un MDX compilado en el build (spec §9.2).
  const { default: Narrative } = await import(`@/content/work/${slug}/${locale}.mdx`);
  // La numeración (01, 02…) sigue las secciones presentes; se calcula en el build desde el MDX.
  const source = await readFile(
    join(process.cwd(), 'src/content/work', slug, `${locale}.mdx`),
    'utf8',
  );
  const numbers = Object.fromEntries(
    numberSections(sectionKindsOf(source)).map(({ kind, number }) => [kind, number]),
  );

  return (
    <main id="contenido">
      <Container>
        <CaseHeader meta={meta} />
        <CaseHero meta={meta} />

        <div className="flex flex-col gap-12 pb-16 lg:flex-row lg:items-start lg:gap-16 lg:pb-24">
          {/* En móvil la ficha va justo después de la imagen; desde `lg`, a la izquierda y fija. */}
          <div className="min-w-0 lg:flex-[4]">
            <CaseFacts meta={meta} />
          </div>
          <article className="flex min-w-0 flex-col gap-18 lg:flex-[8]">
            <Narrative components={createWorkMdxComponents(meta, numbers)} />
          </article>
        </div>

        <NextProject slug={slug} />
      </Container>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/work/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isWorkSlug(slug)) notFound();
  return buildMetadata({ locale: asLocale(locale), page: 'case', slug });
}
