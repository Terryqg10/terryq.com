# ADR-0002 · Modelo de contenido

## Contexto
El sitio tiene pocos casos de estudio y páginas con copy propio en dos idiomas. No hay datos dinámicos, CMS ni base de datos (spec §9). Se quiere contenido tipado y revisable en Git.

## Decisión
- Metadatos de cada caso en un `meta.ts` tipado (sin frontmatter), y el cuerpo en MDX por idioma con `@next/mdx`.
- El copy de las páginas va en `messages/*.json` (next-intl).
- Los textos visibles salen siempre de `messages` o del MDX, nunca del componente.

## Alternativas
- Velite o Content Collections: descartadas, añaden una capa de generación que un sitio de este tamaño no necesita.
- `next-mdx-remote`: descartada, está pensada para MDX que llega de fuera del build.
- CMS: descartado, el contenido cambia poco y debe quedar versionado en el repo (spec §2, fuera de alcance).

## Consecuencias
- Los tipos detectan en compilación un caso sin traducción o sin imagen.
- Añadir un caso exige tocar código y desplegar; es aceptable por el ritmo de cambios.
- Las dependencias MDX (`@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`) son parte del stack aprobado (spec §3).

## Estado
Aceptado (2026-10-07)
