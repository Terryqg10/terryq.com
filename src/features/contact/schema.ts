import { z } from 'zod';

/** Códigos de error por campo (spec §10.1). El cliente los traduce con `contact.errors.<código>`. */
export const contactErrorCodes = {
  name: ['name.required'],
  contact: ['contact.required', 'contact.format'],
  need: ['need.required'],
  website: ['website.format'],
  message: ['message.required'],
  privacy: ['privacy.required'],
} as const;

export type ContactField = keyof typeof contactErrorCodes;
export type ContactErrorCode = (typeof contactErrorCodes)[ContactField][number];

/** Campos del formulario en el orden en que aparecen (y en que se enlazan desde el resumen). */
export const contactFields = Object.keys(contactErrorCodes) as readonly ContactField[];

export type ContactErrors = { [F in ContactField]?: (typeof contactErrorCodes)[F][number] };

export const contactNeeds = ['new-website', 'redesign', 'brand', 'job', 'other'] as const;
export type ContactNeed = (typeof contactNeeds)[number];

export const contactLimits = { name: 100, contact: 254, message: 3000 } as const;

/** Lo que el visitante tenía escrito, tal cual, para volver a pintarlo si algo falla. */
export type ContactValues = {
  name: string;
  contact: string;
  need: string;
  website: string;
  message: string;
  privacy: boolean;
};

/** Cómo quiere que le respondan: de ahí sale el `Reply-To` (solo si es un email). */
export type ContactChannel = { kind: 'email'; value: string } | { kind: 'phone'; value: string };

/** Datos ya validados y normalizados. */
export type ContactData = {
  name: string;
  contact: ContactChannel;
  need: ContactNeed;
  website: string | undefined;
  message: string;
};

export type ContactResult =
  { success: true; data: ContactData } | { success: false; errors: ContactErrors };

/** Teléfono: sin espacios, puntos, guiones ni paréntesis, `+` opcional y de 9 a 15 dígitos. */
export function normalizePhone(input: string): string | undefined {
  const compact = input.replace(/[\s.\-()]/g, '');
  return /^\+?\d{9,15}$/.test(compact) ? compact : undefined;
}

/** URL http(s): añade `https://` si falta el protocolo. Devuelve `undefined` si no es válida. */
export function normalizeUrl(input: string): string | undefined {
  const text = input.trim();
  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(text) ? text : `https://${text}`;
  const parsed = z.url({ protocol: /^https?$/ }).safeParse(withProtocol);
  if (!parsed.success) return undefined;
  // Con usuario o contraseña (p. ej. «mailto:a@b.com» con https:// delante) no es la web de nadie.
  const { username, password } = new URL(withProtocol);
  return username || password ? undefined : withProtocol;
}

/** FormData entrega `null` (o un archivo) cuando falta el campo: se trata como texto vacío. */
const toText = (value: unknown): unknown => (typeof value === 'string' ? value : '');

const name = z.preprocess(
  toText,
  z
    .string()
    .trim()
    .min(1, 'name.required')
    .transform((value) => value.slice(0, contactLimits.name)),
);

const contact = z.preprocess(
  toText,
  z
    .string()
    .trim()
    .min(1, 'contact.required')
    .transform((value, ctx): ContactChannel => {
      const text = value.slice(0, contactLimits.contact);
      if (z.email().safeParse(text).success) return { kind: 'email', value: text };
      const phone = normalizePhone(text);
      if (phone) return { kind: 'phone', value: phone };
      ctx.issues.push({ code: 'custom', message: 'contact.format', input: value });
      return z.NEVER;
    }),
);

const need = z.preprocess(toText, z.enum(contactNeeds, 'need.required'));

const website = z.preprocess(
  toText,
  z
    .string()
    .trim()
    .transform((value, ctx): string | undefined => {
      if (value === '') return undefined;
      const url = normalizeUrl(value);
      if (url) return url;
      ctx.issues.push({ code: 'custom', message: 'website.format', input: value });
      return z.NEVER;
    }),
);

const message = z.preprocess(
  toText,
  z
    .string()
    .trim()
    .min(1, 'message.required')
    .transform((value) => value.slice(0, contactLimits.message)),
);

/** Una casilla de HTML llega como `on` (o no llega); en el cliente puede ser un booleano. */
const privacy = z.preprocess(
  (value) => value === true || value === 'on' || value === 'true',
  z.literal(true, 'privacy.required'),
);

export const contactSchema = z.object({ name, contact, need, website, message, privacy });

const isErrorCode = (field: ContactField, code: unknown): code is ContactErrorCode =>
  (contactErrorCodes[field] as readonly unknown[]).includes(code);

/**
 * Valida los campos del formulario (un objeto o `Object.fromEntries(formData)`).
 * Devuelve el primer código de error de cada campo, nunca el texto: el cliente lo traduce.
 */
export function validateContact(input: Record<string, unknown>): ContactResult {
  const parsed = contactSchema.safeParse(input);
  if (parsed.success) {
    const { name, contact, need, website, message } = parsed.data;
    return { success: true, data: { name, contact, need, website, message } };
  }
  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0];
    if (typeof field !== 'string' || !(field in contactErrorCodes) || field in errors) continue;
    if (isErrorCode(field as ContactField, issue.message)) errors[field] = issue.message;
  }
  return { success: false, errors: errors as ContactErrors };
}
