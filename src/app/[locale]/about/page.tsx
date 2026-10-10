import { asLocale, buildMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { AboutHero } from '@/features/about/AboutHero';
import { ForCompanies } from '@/features/about/ForCompanies';
import { Story } from '@/features/about/Story';
import { site } from '@/lib/site';
import { getLocale } from 'next-intl/server';
import type { StaticImageData } from 'next/image';

export default async function AboutPage() {
  const locale = await getLocale();
  const portrait: StaticImageData | null = site.portrait;

  return (
    <main id="contenido">
      <Container>
        <AboutHero portrait={portrait} />
        <Story />
        <ForCompanies cv={site.cv[locale]} />
      </Container>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({ locale: asLocale(locale), page: 'about' });
}
