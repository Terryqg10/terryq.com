import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Reveal } from '@/components/layout/Reveal';
import { SkipLink } from '@/components/layout/SkipLink';
import { WhatsAppFab } from '@/components/layout/WhatsAppFab';
import { routing } from '@/i18n/routing';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteJsonLd } from '@/lib/json-ld';
import { siteOrigin } from '@/lib/seo';
import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';

// Autoalojadas en el build: el navegador no pide nada a Google (spec §6.3).
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-bricolage',
});
const instrument = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-instrument',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains',
});

export const dynamic = 'error';
export const dynamicParams = false;

/** Las URLs relativas de canonical, alternates y Open Graph se resuelven contra este origen (§11.1). */
export const generateMetadata = (): Metadata => ({ metadataBase: siteOrigin() });

/** `paper` light y dark del DS (spec §6.4). */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f0eb' },
    { media: '(prefers-color-scheme: dark)', color: '#111110' },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [seo, footer] = await Promise.all([
    getTranslations({ locale, namespace: 'seo' }),
    getTranslations({ locale, namespace: 'common.footer' }),
  ]);

  return (
    <html
      lang={locale}
      className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <body>
        <JsonLd
          data={siteJsonLd(siteOrigin().origin, locale, {
            jobTitle: seo('jobTitle'),
            tagline: footer('tagline'),
            country: seo('country'),
          })}
        />
        {/* `Link` de next-intl es un componente cliente y necesita el idioma. Los mensajes llegan
            a cada isla cliente por separado (spec §4.2), no en bloque. */}
        <NextIntlClientProvider messages={{}}>
          <SkipLink />
          <Header />
          {children}
          <Footer />
          <WhatsAppFab />
          <Reveal />
        </NextIntlClientProvider>
        {/* Solo en Vercel: fuera de ella el script `/_vercel/insights` no existe y daría un 404.
            Sin cookies y sin eventos personalizados (spec §14). */}
        {process.env.VERCEL_ENV ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
