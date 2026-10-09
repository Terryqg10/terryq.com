import type { Locale } from '@/content/types';
import type { ContactData, ContactNeed } from './schema';

/** Mensaje listo para entregar a un transporte. */
export type ContactEmail = {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
};

/** El correo lo lee Terry: las etiquetas van siempre en español, sea cual sea el idioma de la página. */
export const needLabels: Readonly<Record<ContactNeed, string>> = {
  'new-website': 'Web nueva',
  redesign: 'Rediseñar mi web',
  brand: 'Logo e identidad',
  job: 'Propuesta de trabajo',
  other: 'Otra cosa',
};

const localeLabels: Readonly<Record<Locale, string>> = { es: 'Español', en: 'English' };

const htmlEscapes: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => htmlEscapes[char] ?? char);

/** Una sola línea: los saltos de línea en una cabecera permitirían inyectar otras cabeceras. */
const oneLine = (value: string) => value.replace(/\s+/g, ' ').trim();

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Madrid',
  }).format(date);

export type ContactEmailContext = {
  from: string;
  to: string;
  locale: Locale;
  date: Date;
};

/** Texto plano + HTML mínimo (spec §10.4). Todo lo que escribe el visitante se escapa en el HTML. */
export function buildContactEmail(data: ContactData, context: ContactEmailContext): ContactEmail {
  const need = needLabels[data.need];
  const rows: readonly (readonly [label: string, value: string])[] = [
    ['Nombre', data.name],
    ['Contacto', data.contact.value],
    ['Qué necesita', need],
    ['Web', data.website ?? '(no indicada)'],
    ['Idioma de la página', localeLabels[context.locale]],
    ['Fecha', formatDate(context.date)],
  ];

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Mensaje:',
    data.message,
    '',
  ].join('\n');

  const html = [
    '<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5">',
    ...rows.map(
      ([label, value]) =>
        `<p style="margin:0 0 4px"><strong>${label}:</strong> ${escapeHtml(value)}</p>`,
    ),
    '<p style="margin:16px 0 4px"><strong>Mensaje:</strong></p>',
    `<div style="white-space:pre-wrap">${escapeHtml(data.message)}</div>`,
    '</div>',
  ].join('\n');

  return {
    from: context.from,
    to: context.to,
    replyTo: data.contact.kind === 'email' ? data.contact.value : undefined,
    subject: `[terryq.com] ${need} · ${oneLine(data.name)}`,
    text,
    html,
  };
}
