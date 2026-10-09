import { site, whatsappHref } from '@/lib/site';
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

const channelsLabelClasses = 'text-meta uppercase text-ink-muted';

type ChannelProps = {
  href: string;
  icon: ReactNode;
  name: string;
  detail: string;
  external: boolean;
  externalLabel: string;
  /** Borde inferior: solo la última fila de la lista lo lleva. */
  last?: boolean;
};

function Channel({ href, icon, name, detail, external, externalLabel, last }: ChannelProps) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={`-mx-3 grid min-h-16 grid-cols-[40px_1fr_auto] items-center gap-4 rounded-xl border-t border-line px-3 py-2 transition-colors duration-150 hover:bg-surface-sunken ${last ? 'border-b' : ''}`}
      >
        <span
          aria-hidden="true"
          className="grid size-10 place-items-center rounded-xl bg-surface-sunken text-ink"
        >
          {icon}
        </span>
        <span className="flex min-w-0 flex-col">
          <strong className="text-[16px]/[22px] font-semibold">{name}</strong>
          <span className="text-meta break-words text-ink-muted">{detail}</span>
        </span>
        <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.75} className="text-ink" />
        {external ? <span className="sr-only">{externalLabel}</span> : null}
      </a>
    </li>
  );
}

/** El logo de LinkedIn no está en la versión de Lucide del proyecto: el trazo es el del artboard. */
const linkedinIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
  </svg>
);

/**
 * WhatsApp es el canal destacado: en móvil va justo debajo de la entradilla (UI32) y en
 * escritorio abre la lista «Otros canales» (spec §8.6).
 */
export async function WhatsAppChannel({ className }: { className?: string }) {
  const [t, common, locale] = await Promise.all([
    getTranslations('contact'),
    getTranslations('common'),
    getLocale(),
  ]);

  return (
    <div className={className}>
      <p className={`${channelsLabelClasses} mb-2 hidden lg:block`}>{t('channels')}</p>
      <ul className="flex flex-col">
        <Channel
          href={whatsappHref(locale === 'en' ? 'en' : 'es')}
          icon={<MessageCircle size={20} strokeWidth={1.75} />}
          name={t('channelNames.whatsapp')}
          detail={site.whatsapp.display}
          external
          externalLabel={common('external')}
          last
        />
      </ul>
    </div>
  );
}

/** Email, LinkedIn y los datos de respuesta y ubicación. En móvil van después del formulario. */
export async function OtherChannels({ className }: { className?: string }) {
  const [t, common] = await Promise.all([getTranslations('contact'), getTranslations('common')]);

  return (
    <div className={className}>
      <p className={`${channelsLabelClasses} mb-2 lg:hidden`}>{t('channels')}</p>
      <ul className="flex flex-col">
        <Channel
          href={`mailto:${site.email}`}
          icon={<Mail size={20} strokeWidth={1.75} />}
          name={t('channelNames.email')}
          detail={site.email}
          external={false}
          externalLabel={common('external')}
        />
        <Channel
          href={site.linkedin}
          icon={linkedinIcon}
          name={t('channelNames.linkedin')}
          detail={site.person.name}
          external
          externalLabel={common('external')}
          last
        />
      </ul>
      <ul className="mt-6 flex flex-col gap-1.5 text-meta text-ink-muted">
        <li className="flex items-center gap-2">
          <Clock aria-hidden="true" size={14} strokeWidth={2} />
          {t('reply')}
        </li>
        <li className="flex items-center gap-2">
          <MapPin aria-hidden="true" size={14} strokeWidth={2} />
          {t('location')}
        </li>
      </ul>
    </div>
  );
}
