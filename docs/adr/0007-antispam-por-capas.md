# ADR-0007 · Antispam por capas

## Contexto
El formulario es público y puede recibir spam. Hay que frenarlo sin fricción para las personas y sin un tercero que obligue a cambiar la política de privacidad (spec §10.5).

## Decisión
1. **Trampa y tiempo:** campo oculto `company` (debe llegar vacío) y mínimo de 3 s desde que se monta el formulario (`startedAt`). Si falla, se devuelve un éxito falso sin enviar.
2. **Regla de límite del Firewall de Vercel**, disponible en el plan Hobby (una regla de límite por proyecto).
3. **Cloudflare Turnstile** solo si aun así llega spam, con un nuevo ADR y un cambio en la política de privacidad.

### Configuración de la regla del Firewall (capa 2)
No es código: se configura en el panel de Vercel (proyecto `terryq-com` → Firewall → Custom Rules).

| Ajuste | Valor |
|---|---|
| Condición | Método `POST` y ruta `/contacto` o `/en/contact` |
| Acción | Rate Limit |
| Clave | IP |
| Algoritmo | Ventana fija (Fixed window) |
| Ventana | 10 minutos |
| Peticiones | 5 |
| Al superarse | 429 (Too Many Requests) |

Despliegue en dos pasos: primero en modo **Log** durante una semana, para comprobar que no bloquea a nadie legítimo, y después en **Deny** (429). Al cambiar de modo, anotar aquí la fecha.

## Alternativas
- Turnstile o reCAPTCHA desde el principio: descartadas. Meten un tercero en la página de contacto, con efecto en la política de privacidad, antes de saber si hace falta.

## Consecuencias
- Un visitante legítimo que envíe más de 5 veces en 10 minutos desde la misma IP recibirá 429; es un caso improbable.
- La regla vive en el panel de Vercel, no en el repo; este ADR es su documentación y hay que mantenerlo al día.
- Si el spam supera las capas 1 y 2, se abre un ADR nuevo para Turnstile.

## Estado
Aceptado (2026-10-07)
