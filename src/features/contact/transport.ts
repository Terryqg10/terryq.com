import { Resend } from 'resend';
import type { Env } from '@/lib/env-schema';
import type { ContactEmail } from './email';

/** Falló el envío. `code` no lleva datos del visitante: es lo único que se registra. */
export class ContactTransportError extends Error {
  constructor(readonly code: string) {
    super(`Contact transport failed: ${code}`);
    this.name = 'ContactTransportError';
  }
}

export interface ContactTransport {
  send(message: ContactEmail): Promise<void>;
}

/** Envío real con Resend. */
export function createResendTransport(apiKey: string): ContactTransport {
  const resend = new Resend(apiKey);
  return {
    async send(message) {
      const { error } = await resend.emails.send({
        from: message.from,
        to: message.to,
        replyTo: message.replyTo,
        subject: message.subject,
        text: message.text,
        html: message.html,
      });
      if (error) throw new ContactTransportError(error.name);
    },
  };
}

/** Marca que hace fallar al transporte mock (spec §10.4). */
export const mockFailMarker = '[[fail]]';

export interface MockTransport extends ContactTransport {
  readonly sent: readonly ContactEmail[];
  reset(): void;
}

/** No envía nada: guarda el mensaje en memoria para los tests. Falla si el mensaje contiene `[[fail]]`. */
export function createMockTransport(): MockTransport {
  const sent: ContactEmail[] = [];
  return {
    sent,
    reset() {
      sent.length = 0;
    },
    async send(message) {
      if (message.text.includes(mockFailMarker)) throw new ContactTransportError('mock-fail');
      sent.push(message);
    },
  };
}

/** Un solo mock por proceso, para que quien lo consulte vea lo que envió la acción. */
let sharedMock: MockTransport | undefined;

export function createTransport(env: Env): ContactTransport {
  if (env.CONTACT_TRANSPORT === 'resend') return createResendTransport(env.RESEND_API_KEY);
  return (sharedMock ??= createMockTransport());
}
