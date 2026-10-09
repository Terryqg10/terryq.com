import { z } from 'zod';

/** Remitente: un email o «Nombre <email>». */
const sender = z
  .string()
  .refine(
    (value) => z.email().safeParse(value.match(/<([^<>]+)>\s*$/)?.[1] ?? value).success,
    'debe ser un email o «Nombre <email>»',
  );

const common = {
  CONTACT_TO_EMAIL: z.email(),
  CONTACT_FROM_EMAIL: sender,
  NEXT_PUBLIC_SITE_URL: z.url({ protocol: /^https?$/ }),
};

const schema = z.discriminatedUnion('CONTACT_TRANSPORT', [
  z.object({ ...common, CONTACT_TRANSPORT: z.literal('mock') }),
  z.object({
    ...common,
    CONTACT_TRANSPORT: z.literal('resend'),
    RESEND_API_KEY: z.string().min(1),
  }),
]);

export type Env = z.infer<typeof schema>;

/**
 * Valida las variables de entorno (spec §10.6). Lanza un error que nombra cada variable que falla.
 * `CONTACT_TRANSPORT=mock` está prohibido en producción (`VERCEL_ENV=production`).
 */
export function parseEnv(source: Readonly<Record<string, string | undefined>>): Env {
  const result = schema.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues.map(
      (issue) => `- ${issue.path.join('.') || 'CONTACT_TRANSPORT'}: ${issue.message}`,
    );
    throw new Error(`Variables de entorno no válidas (ver .env.example):\n${problems.join('\n')}`);
  }
  if (source.VERCEL_ENV === 'production' && result.data.CONTACT_TRANSPORT === 'mock') {
    throw new Error(
      'CONTACT_TRANSPORT=mock está prohibido en producción (VERCEL_ENV=production): usa "resend".',
    );
  }
  return result.data;
}
