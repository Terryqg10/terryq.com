import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseEnv } from '@/lib/env-schema';

const valid = {
  CONTACT_TRANSPORT: 'mock',
  CONTACT_TO_EMAIL: 'contacto@terryq.com',
  CONTACT_FROM_EMAIL: 'Web terryq.com <formulario@envios.terryq.com>',
  NEXT_PUBLIC_SITE_URL: 'https://terryq.com',
};
const resend = { ...valid, CONTACT_TRANSPORT: 'resend', RESEND_API_KEY: 're_test' };

const without = (source: Record<string, string>, name: string) =>
  Object.fromEntries(Object.entries(source).filter(([key]) => key !== name));

describe('parseEnv', () => {
  it('acepta la configuración de mock sin RESEND_API_KEY', () => {
    expect(parseEnv(valid).CONTACT_TRANSPORT).toBe('mock');
  });

  it('acepta la configuración de resend con su clave', () => {
    expect(parseEnv(resend)).toMatchObject({
      CONTACT_TRANSPORT: 'resend',
      RESEND_API_KEY: 're_test',
    });
  });

  it.each(Object.keys(valid))('falla si falta %s y lo nombra', (name) => {
    const rest = without(valid, name);
    expect(() => parseEnv(rest)).toThrow(name);
  });

  it('falla si con resend falta RESEND_API_KEY', () => {
    const rest = without(resend, 'RESEND_API_KEY');
    expect(() => parseEnv(rest)).toThrow('RESEND_API_KEY');
  });

  it('rechaza un transporte desconocido y valores mal formados', () => {
    expect(() => parseEnv({ ...valid, CONTACT_TRANSPORT: 'smtp' })).toThrow();
    expect(() => parseEnv({ ...valid, CONTACT_TO_EMAIL: 'no-es-un-email' })).toThrow(
      'CONTACT_TO_EMAIL',
    );
    expect(() => parseEnv({ ...valid, CONTACT_FROM_EMAIL: 'Web <nope>' })).toThrow(
      'CONTACT_FROM_EMAIL',
    );
    expect(() => parseEnv({ ...valid, NEXT_PUBLIC_SITE_URL: 'terryq.com' })).toThrow(
      'NEXT_PUBLIC_SITE_URL',
    );
  });

  it('acepta un remitente que es solo un email', () => {
    expect(
      parseEnv({ ...valid, CONTACT_FROM_EMAIL: 'formulario@envios.terryq.com' }),
    ).toBeDefined();
  });

  it('prohíbe CONTACT_TRANSPORT=mock en producción', () => {
    expect(() => parseEnv({ ...valid, VERCEL_ENV: 'production' })).toThrow(/prohibido/);
    expect(parseEnv({ ...valid, VERCEL_ENV: 'preview' })).toBeDefined();
    expect(parseEnv({ ...resend, VERCEL_ENV: 'production' })).toBeDefined();
  });
});

describe('env', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('se valida al importarse (servidor)', async () => {
    for (const [name, value] of Object.entries(valid)) vi.stubEnv(name, value);
    const { env } = await import('@/lib/env');
    expect(env.NEXT_PUBLIC_SITE_URL).toBe('https://terryq.com');
  });

  it('falla al importarse si falta una variable', async () => {
    for (const [name, value] of Object.entries(valid)) vi.stubEnv(name, value);
    vi.stubEnv('CONTACT_TO_EMAIL', '');
    await expect(import('@/lib/env')).rejects.toThrow('CONTACT_TO_EMAIL');
  });
});
