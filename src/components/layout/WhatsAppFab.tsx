import { whatsappHref } from '@/lib/site';
import { MessageCircle } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

/** Botón flotante de WhatsApp: en todas las páginas, con el mensaje inicial del idioma (§9.3). */
export async function WhatsAppFab() {
  const t = await getTranslations('common');
  const locale = await getLocale();

  return (
    <a
      href={whatsappHref(locale)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp.label')}
      className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-10 grid size-14 place-items-center rounded-full bg-inverse-bg text-inverse-ink shadow-float transition-transform duration-150 ease-tq hover:-translate-y-0.5 md:right-6 md:bottom-6"
    >
      <MessageCircle aria-hidden="true" size={24} strokeWidth={1.75} />
    </a>
  );
}
