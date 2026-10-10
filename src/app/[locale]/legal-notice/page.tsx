import { asLocale, buildMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { LegalPage } from '@/features/legal/LegalPage';

export default function Page() {
  return <LegalPage kind="notice" />;
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/legal-notice'>): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({ locale: asLocale(locale), page: 'legal-notice' });
}
