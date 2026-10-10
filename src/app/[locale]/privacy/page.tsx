import { asLocale, buildMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { LegalPage } from '@/features/legal/LegalPage';

export default function Page() {
  return <LegalPage kind="privacy" />;
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/privacy'>): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({ locale: asLocale(locale), page: 'privacy' });
}
