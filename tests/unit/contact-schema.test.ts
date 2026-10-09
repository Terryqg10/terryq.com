import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import es from '../../messages/es.json';
import {
  contactErrorCodes,
  contactLimits,
  normalizePhone,
  normalizeUrl,
  validateContact,
  type ContactErrorCode,
} from '@/features/contact/schema';

const valid = {
  name: 'Ana',
  contact: 'ana@example.com',
  need: 'new-website',
  website: '',
  message: 'Quiero una web.',
  privacy: 'on',
};

const errorsOf = (overrides: Record<string, unknown>) => {
  const result = validateContact({ ...valid, ...overrides });
  return result.success ? undefined : result.errors;
};

describe('validateContact', () => {
  it('acepta un envío completo y devuelve los datos normalizados', () => {
    expect(validateContact(valid)).toEqual({
      success: true,
      data: {
        name: 'Ana',
        contact: { kind: 'email', value: 'ana@example.com' },
        need: 'new-website',
        website: undefined,
        message: 'Quiero una web.',
      },
    });
  });

  it('recorta los espacios del nombre y del mensaje', () => {
    const result = validateContact({ ...valid, name: '  Ana  ', message: '\n hola \n' });
    expect(result.success && [result.data.name, result.data.message]).toEqual(['Ana', 'hola']);
  });

  it.each(['', '   ', '\t\n'])('name.required con %j', (name) => {
    expect(errorsOf({ name })).toEqual({ name: 'name.required' });
  });

  it.each(['', '   '])('message.required con %j', (message) => {
    expect(errorsOf({ message })).toEqual({ message: 'message.required' });
  });

  it('un campo que no llega (null en FormData) cuenta como vacío', () => {
    expect(validateContact({ ...valid, name: null, message: undefined })).toEqual({
      success: false,
      errors: { name: 'name.required', message: 'message.required' },
    });
  });

  it('recorta lo que pase de la longitud máxima', () => {
    const result = validateContact({
      ...valid,
      name: 'a'.repeat(300),
      message: 'b'.repeat(5000),
    });
    expect(result.success && [result.data.name.length, result.data.message.length]).toEqual([
      contactLimits.name,
      contactLimits.message,
    ]);
  });

  describe('contacto', () => {
    it.each(['ana@example.com', 'ana.perez+web@sub.dominio.es', 'A@B.io', '  ana@example.com  '])(
      'email válido %j',
      (contact) => {
        const result = validateContact({ ...valid, contact });
        expect(result.success && result.data.contact).toEqual({
          kind: 'email',
          value: contact.trim(),
        });
      },
    );

    it.each([
      ['600 000 000', '600000000'],
      ['+34 600 000 000', '+34600000000'],
      ['(+44) 20 7946 0958', '+442079460958'],
      ['600.000.000', '600000000'],
      ['600-00-00-00', '600000000'],
      ['  600000000  ', '600000000'],
      ['+123456789012345', '+123456789012345'],
    ])('teléfono válido %j → %j', (contact, value) => {
      const result = validateContact({ ...valid, contact });
      expect(result.success && result.data.contact).toEqual({ kind: 'phone', value });
    });

    it.each(['', '   '])('contact.required con %j', (contact) => {
      expect(errorsOf({ contact })).toEqual({ contact: 'contact.required' });
    });

    it.each([
      'ana',
      'ana@',
      '@example.com',
      'ana@example',
      'ana example@x.com',
      '12345678', // 8 dígitos
      '+1234567890123456', // 16 dígitos
      '600 000 00a',
      '600+000000',
    ])('contact.format con %j', (contact) => {
      expect(errorsOf({ contact })).toEqual({ contact: 'contact.format' });
    });
  });

  describe('necesidad', () => {
    it.each(['new-website', 'redesign', 'brand', 'job', 'other'])('acepta %j', (need) => {
      expect(validateContact({ ...valid, need }).success).toBe(true);
    });

    it.each(['', 'logo', 'NEW-WEBSITE', undefined, 3])('need.required con %j', (need) => {
      expect(errorsOf({ need })).toEqual({ need: 'need.required' });
    });
  });

  describe('web', () => {
    it('es opcional', () => {
      expect(validateContact({ ...valid, website: '   ' }).success).toBe(true);
    });

    it.each([
      ['https://hb.es', 'https://hb.es'],
      ['http://hb.es/inicio?a=1', 'http://hb.es/inicio?a=1'],
      ['hb.es', 'https://hb.es'],
      ['www.hb.es/trabajos', 'https://www.hb.es/trabajos'],
      ['  hb.es  ', 'https://hb.es'],
    ])('acepta %j → %j', (website, expected) => {
      const result = validateContact({ ...valid, website });
      expect(result.success && result.data.website).toBe(expected);
    });

    it.each([
      'javascript:alert(1)',
      'mailto:ana@example.com',
      'ftp://hb.es',
      'https://',
      'hola mundo',
      'https://hb .es',
    ])('website.format con %j', (website) => {
      expect(errorsOf({ website })).toEqual({ website: 'website.format' });
    });
  });

  describe('privacidad', () => {
    it.each(['on', 'true', true])('acepta %j', (privacy) => {
      expect(validateContact({ ...valid, privacy }).success).toBe(true);
    });

    it.each([undefined, '', 'off', 'false', false, 'yes'])('privacy.required con %j', (privacy) => {
      expect(errorsOf({ privacy })).toEqual({ privacy: 'privacy.required' });
    });
  });

  it('junta los errores de varios campos, uno por campo', () => {
    expect(validateContact({})).toEqual({
      success: false,
      errors: {
        name: 'name.required',
        contact: 'contact.required',
        need: 'need.required',
        message: 'message.required',
        privacy: 'privacy.required',
      },
    });
  });
});

describe('normalizePhone y normalizeUrl', () => {
  it('normalizePhone devuelve undefined si no es un teléfono', () => {
    expect(normalizePhone('abc')).toBeUndefined();
    expect(normalizePhone('600 000 000')).toBe('600000000');
  });

  it('normalizeUrl respeta el protocolo que ya trae', () => {
    expect(normalizeUrl('http://hb.es')).toBe('http://hb.es');
    expect(normalizeUrl('HTTPS://hb.es')).toBe('HTTPS://hb.es');
    expect(normalizeUrl('nope nope')).toBeUndefined();
  });
});

describe('mensajes de error', () => {
  const codes = Object.values(contactErrorCodes).flat() as ContactErrorCode[];

  it.each([
    ['es', es],
    ['en', en],
  ])('hay un texto en %s por cada código', (_locale, messages) => {
    for (const code of codes) {
      const [field, rule] = code.split('.') as [keyof typeof messages.contact.errors, string];
      const group = messages.contact.errors[field] as Record<string, string>;
      expect(group[rule]?.trim(), code).toBeTruthy();
    }
  });
});
