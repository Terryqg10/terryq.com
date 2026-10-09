import { describe, expect, it, vi } from 'vitest';
import { buildContactEmail } from '@/features/contact/email';
import { minFillMs, submitContact, type ContactDeps } from '@/features/contact/submit';
import { createMockTransport, createTransport } from '@/features/contact/transport';
import { parseEnv } from '@/lib/env-schema';

const now = new Date('2026-10-10T10:00:00Z');

const fields = {
  name: 'Ana',
  contact: 'ana@example.com',
  need: 'redesign',
  website: 'hb.es',
  message: 'Quiero rediseñar mi web.',
  privacy: 'on',
  locale: 'es',
};

const form = (overrides: Record<string, string> = {}) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries({ ...fields, ...overrides })) {
    formData.set(key, value);
  }
  return formData;
};

const setup = () => {
  const transport = createMockTransport();
  const logError = vi.fn<(code: string) => void>();
  const deps: ContactDeps = {
    transport,
    from: 'Web terryq.com <formulario@envios.terryq.com>',
    to: 'contacto@terryq.com',
    now: () => now,
    logError,
  };
  return { transport, logError, deps };
};

describe('submitContact', () => {
  it('éxito: envía un mensaje con Reply-To del visitante', async () => {
    const { transport, deps } = setup();
    expect(await submitContact(form(), deps)).toEqual({ status: 'success' });
    expect(transport.sent).toHaveLength(1);
    expect(transport.sent[0]).toMatchObject({
      from: 'Web terryq.com <formulario@envios.terryq.com>',
      to: 'contacto@terryq.com',
      replyTo: 'ana@example.com',
      subject: '[terryq.com] Rediseñar mi web · Ana',
    });
    expect(transport.sent[0]?.text).toContain('Web: https://hb.es');
  });

  it('si deja un teléfono no hay Reply-To', async () => {
    const { transport, deps } = setup();
    await submitContact(form({ contact: '+34 600 000 000' }), deps);
    expect(transport.sent[0]?.replyTo).toBeUndefined();
    expect(transport.sent[0]?.text).toContain('Contacto: +34600000000');
  });

  it('inválido: devuelve los códigos y los valores tal como se escribieron, sin enviar', async () => {
    const { transport, deps } = setup();
    const state = await submitContact(
      form({ name: '  ', contact: 'ana@', need: '', message: ' Hola ', privacy: '' }),
      deps,
    );
    expect(state).toEqual({
      status: 'invalid',
      errors: {
        name: 'name.required',
        contact: 'contact.format',
        need: 'need.required',
        privacy: 'privacy.required',
      },
      values: {
        name: '  ',
        contact: 'ana@',
        need: '',
        website: 'hb.es',
        message: ' Hola ',
        privacy: false,
      },
    });
    expect(transport.sent).toEqual([]);
  });

  it('trampa rellena: éxito falso sin enviar', async () => {
    const { transport, deps } = setup();
    expect(await submitContact(form({ company: 'Spam S.L.' }), deps)).toEqual({
      status: 'success',
    });
    expect(transport.sent).toEqual([]);
  });

  it('enviado en menos de 3 s: éxito falso sin enviar', async () => {
    const { transport, deps } = setup();
    const startedAt = String(now.getTime() - (minFillMs - 1));
    expect(await submitContact(form({ startedAt }), deps)).toEqual({ status: 'success' });
    expect(transport.sent).toEqual([]);
  });

  it('con startedAt en el futuro también es un bot', async () => {
    const { transport, deps } = setup();
    await submitContact(form({ startedAt: String(now.getTime() + 60_000) }), deps);
    expect(transport.sent).toEqual([]);
  });

  it('pasados 3 s se envía', async () => {
    const { transport, deps } = setup();
    const startedAt = String(now.getTime() - minFillMs);
    expect(await submitContact(form({ startedAt }), deps)).toEqual({ status: 'success' });
    expect(transport.sent).toHaveLength(1);
  });

  it.each(['', 'abc'])('sin JavaScript (startedAt %j) se envía', async (startedAt) => {
    const { transport, deps } = setup();
    await submitContact(form({ startedAt }), deps);
    expect(transport.sent).toHaveLength(1);
  });

  it('el trampa tiene prioridad aunque el resto sea inválido', async () => {
    const { deps } = setup();
    expect(await submitContact(form({ company: 'x', name: '' }), deps)).toEqual({
      status: 'success',
    });
  });

  it('[[fail]]: error con los valores, y se registra solo el código', async () => {
    const { transport, logError, deps } = setup();
    const state = await submitContact(form({ message: 'Hola [[fail]]' }), deps);
    expect(state).toEqual({
      status: 'error',
      values: {
        name: 'Ana',
        contact: 'ana@example.com',
        need: 'redesign',
        website: 'hb.es',
        message: 'Hola [[fail]]',
        privacy: true,
      },
    });
    expect(transport.sent).toEqual([]);
    expect(logError).toHaveBeenCalledExactlyOnceWith('mock-fail');
  });

  it('un error inesperado del transporte se registra como unknown', async () => {
    const { deps, logError } = setup();
    const state = await submitContact(form(), {
      ...deps,
      transport: {
        send: () => Promise.reject(new Error('Ana ana@example.com')),
      },
    });
    expect(state.status).toBe('error');
    expect(logError).toHaveBeenCalledExactlyOnceWith('unknown');
  });

  it('un idioma desconocido cae al idioma por defecto', async () => {
    const { transport, deps } = setup();
    await submitContact(form({ locale: 'fr' }), deps);
    expect(transport.sent[0]?.text).toContain('Idioma de la página: Español');
    await submitContact(form({ locale: 'en' }), deps);
    expect(transport.sent[1]?.text).toContain('Idioma de la página: English');
  });
});

describe('buildContactEmail', () => {
  const data = {
    name: 'Ana\nBcc: x@y.com',
    contact: { kind: 'email', value: 'ana@example.com' },
    need: 'job',
    website: undefined,
    message: '<script>alert("x")</script> & más\nsegunda línea',
  } as const;
  const email = buildContactEmail(data, {
    from: 'a@b.c',
    to: 'd@e.f',
    locale: 'en',
    date: new Date('2026-10-10T22:30:00Z'),
  });

  it('escapa en el HTML todo lo que viene del visitante', () => {
    expect(email.html).not.toContain('<script>');
    expect(email.html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; más');
  });

  it('el texto plano lleva el mensaje tal cual', () => {
    expect(email.text).toContain('<script>alert("x")</script> & más\nsegunda línea');
  });

  it('el asunto es de una sola línea', () => {
    expect(email.subject).toBe('[terryq.com] Propuesta de trabajo · Ana Bcc: x@y.com');
  });

  it('la fecha va en hora de Madrid', () => {
    // 22:30 UTC del 10 de octubre es la 0:30 del 11 en Madrid (CEST, UTC+2).
    expect(email.text).toContain('11 de octubre de 2026');
    expect(email.text).toContain('0:30');
  });

  it('sin web lo dice', () => {
    expect(email.text).toContain('Web: (no indicada)');
  });
});

describe('createTransport', () => {
  const base = {
    CONTACT_TO_EMAIL: 'contacto@terryq.com',
    CONTACT_FROM_EMAIL: 'formulario@envios.terryq.com',
    NEXT_PUBLIC_SITE_URL: 'https://terryq.com',
  };

  it('con mock devuelve siempre el mismo transporte', () => {
    const env = parseEnv({ ...base, CONTACT_TRANSPORT: 'mock' });
    expect(createTransport(env)).toBe(createTransport(env));
  });

  it('con resend devuelve uno propio', () => {
    const env = parseEnv({ ...base, CONTACT_TRANSPORT: 'resend', RESEND_API_KEY: 're_test' });
    const transport = createTransport(env);
    expect(typeof transport.send).toBe('function');
    expect(transport).not.toBe(createTransport(parseEnv({ ...base, CONTACT_TRANSPORT: 'mock' })));
  });
});
