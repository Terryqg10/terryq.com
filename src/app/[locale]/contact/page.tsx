import { asLocale, buildMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ContactForm } from '@/features/contact/ContactForm';
import { OtherChannels, WhatsAppChannel } from '@/features/contact/ContactChannels';
import { routeLabel } from '@/i18n/route-label';
import { site, whatsappHref } from '@/lib/site';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';

/**
 * Contacto (spec §8.6). El orden del DOM es el de móvil (UI32): cabecera → WhatsApp → formulario →
 * resto de canales. En escritorio, la rejilla pone los canales a la izquierda y el formulario a la
 * derecha, ocupando todas las filas.
 */
export default async function ContactPage() {
  const [t, locale, messages] = await Promise.all([
    getTranslations('contact'),
    getLocale(),
    getMessages(),
  ]);

  return (
    <main id="contenido">
      <Container>
        <div className="grid grid-cols-12 items-start gap-x-6 gap-y-8 py-16 lg:grid-rows-[auto_auto_auto_1fr] lg:gap-y-0 lg:py-24">
          <header className="col-span-12 flex flex-col gap-6 lg:col-span-5 lg:row-start-1 lg:pr-6">
            <SectionLabel kind="route">{routeLabel('/contact', locale)}</SectionLabel>
            <h1 className="type-title-contact">{t('title')}</h1>
            <p className="text-[19px]/[30px] text-ink-muted">{t('lead')}</p>
          </header>

          <WhatsAppChannel className="col-span-12 lg:col-span-5 lg:row-start-2 lg:mt-8 lg:pr-6" />

          <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:row-span-4 lg:row-start-1">
            <NextIntlClientProvider
              messages={{
                contact: messages.contact,
                common: { external: messages.common.external },
              }}
            >
              <ContactForm
                whatsappHref={whatsappHref(locale === 'en' ? 'en' : 'es')}
                email={site.email}
              />
            </NextIntlClientProvider>
          </div>

          <OtherChannels className="col-span-12 lg:col-span-5 lg:row-start-3 lg:pr-6" />
        </div>
      </Container>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({ locale: asLocale(locale), page: 'contact' });
}
