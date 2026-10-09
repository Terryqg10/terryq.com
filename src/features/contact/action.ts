'use server';

import { env } from '@/lib/env';
import { submitContact, type ContactState } from './submit';
import { createTransport } from './transport';

export async function sendContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  return submitContact(formData, {
    transport: createTransport(env),
    from: env.CONTACT_FROM_EMAIL,
    to: env.CONTACT_TO_EMAIL,
    now: () => new Date(),
    logError: (code) => console.error(`[contact] envío fallido: ${code}`),
  });
}
