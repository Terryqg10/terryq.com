import type { Locale } from '@/content/types';
import { routing } from '@/i18n/routing';
import { buildContactEmail } from './email';
import { validateContact, type ContactErrors, type ContactValues } from './schema';
import { ContactTransportError, type ContactTransport } from './transport';

export type ContactState =
  | { status: 'idle' }
  | { status: 'invalid'; errors: ContactErrors; values: ContactValues }
  | { status: 'error'; values: ContactValues }
  | { status: 'success' };

/** Tiempo mínimo entre que el formulario aparece y se envía; menos es un bot (spec §10.2). */
export const minFillMs = 3000;

export type ContactDeps = {
  transport: ContactTransport;
  from: string;
  to: string;
  now: () => Date;
  /** Registro de errores: solo recibe un código, nunca datos del visitante. */
  logError: (code: string) => void;
};

const text = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
};

const readValues = (formData: FormData): ContactValues => ({
  name: text(formData, 'name'),
  contact: text(formData, 'contact'),
  need: text(formData, 'need'),
  website: text(formData, 'website'),
  message: text(formData, 'message'),
  privacy: ['on', 'true'].includes(text(formData, 'privacy')),
});

const readLocale = (formData: FormData): Locale => {
  const value = text(formData, 'locale');
  return routing.locales.find((locale) => locale === value) ?? routing.defaultLocale;
};

/** Campo trampa relleno, o formulario enviado demasiado pronto. */
function looksLikeBot(formData: FormData, now: Date): boolean {
  if (text(formData, 'company') !== '') return true;
  // Sin JavaScript el cliente no rellena `startedAt`: solo cuenta si viene con un número.
  const raw = text(formData, 'startedAt');
  const startedAt = Number(raw);
  return raw !== '' && Number.isFinite(startedAt) && now.getTime() - startedAt < minFillMs;
}

/** Lógica de la Server Action (spec §10.2), sin acceso a `env` para poder probarla con un mock. */
export async function submitContact(formData: FormData, deps: ContactDeps): Promise<ContactState> {
  const now = deps.now();

  // El bot no debe enterarse de que lo hemos detectado: respuesta de éxito, sin enviar.
  if (looksLikeBot(formData, now)) return { status: 'success' };

  const values = readValues(formData);
  const result = validateContact(Object.fromEntries(formData));
  if (!result.success) return { status: 'invalid', errors: result.errors, values };

  const message = buildContactEmail(result.data, {
    from: deps.from,
    to: deps.to,
    locale: readLocale(formData),
    date: now,
  });
  try {
    await deps.transport.send(message);
  } catch (error) {
    deps.logError(error instanceof ContactTransportError ? error.code : 'unknown');
    return { status: 'error', values };
  }
  return { status: 'success' };
}
