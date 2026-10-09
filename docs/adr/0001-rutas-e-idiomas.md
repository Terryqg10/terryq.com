# ADR-0001 · Rutas e idiomas

## Contexto
El sitio es bilingüe (ES/EN). Hay que decidir cómo se ven las URL de cada idioma y cómo se elige el idioma. Spec §5.1 y §5.2.

## Decisión
- El español va sin prefijo y el inglés con `/en` (`localePrefix: 'as-needed'`, `defaultLocale: 'es'`).
- Las rutas se traducen (`/trabajos` ↔ `/en/work`, `/sobre-mi` ↔ `/en/about`…). Las carpetas usan la ruta interna.
- Sin detección de idioma (`localeDetection: false`): no se redirige según `Accept-Language`.
- Sin cookie (`localeCookie: false`).
- Las peticiones a `/es/...` redirigen con 308 a la ruta sin prefijo.

## Alternativas
- `/es` y `/en` para todo: descartada, el español es el idioma principal y no necesita prefijo.
- Detección por `Accept-Language`: descartada. Una misma URL serviría idiomas distintos, lo que perjudica al SEO, y obligaría a usar una cookie.

## Consecuencias
- Cada URL sirve siempre el mismo idioma, así que el SEO es limpio y no hace falta aviso de cookies por este motivo (spec §15.3).
- Hay que mantener la tabla de rutas traducidas (spec §5.2) y los `alternates` entre idiomas.
- Quien entre con un navegador en inglés a la URL en español verá español; puede cambiar con el selector de idioma.

## Estado
Aceptado (2026-10-07)
