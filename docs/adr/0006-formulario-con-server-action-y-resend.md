# ADR-0006 · Formulario con Server Action y Resend

## Contexto
El formulario de contacto es lo único dinámico del sitio. Debe funcionar sin JavaScript, no guardar datos y minimizar los terceros (spec §10).

## Decisión
- Server Action (`features/contact/action.ts`) con un esquema zod compartido entre cliente y servidor; la validación del servidor es la que vale.
- Envío con Resend desde el dominio verificado (`formulario@terryq.com`; Resend pone DKIM en `resend._domainkey` y SPF y rebotes en `send`, sin tocar el Email Routing del raíz) hacia `contacto@terryq.com`, con `Reply-To` del visitante si dejó un email.
- Transporte intercambiable: `resend` y `mock` (tests y local). `lib/env.ts` falla al arrancar si `CONTACT_TRANSPORT=mock` en producción.
- No se envía confirmación al remitente.

## Alternativas
- Servicio de formularios externo: descartado a favor de una Server Action propia, que mantiene los datos entre el visitante, Resend y el buzón de Terry.
- Autorrespuesta al remitente: descartada (ver spec §2, fuera de alcance: «email de confirmación al remitente»).

## Consecuencias
- El envío real con Resend se activó en T39 (2026-10-11). Se verificó el dominio raíz y no un subdominio `envios`: la clave de API restringida a `terryq.com` rechaza (403) cualquier otro remitente.
- El visitante ve la confirmación en pantalla, pero no recibe correo.
- Los mensajes no se guardan en ningún sitio salvo el buzón de destino.

## Estado
Aceptado (2026-10-07)
