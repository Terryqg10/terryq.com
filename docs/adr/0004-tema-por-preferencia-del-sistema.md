# ADR-0004 · Tema solo por `prefers-color-scheme`

## Contexto
El DS tiene variantes light y dark. Hay que decidir cómo se elige el tema (spec §6.4).

## Decisión
- El tema depende únicamente de `prefers-color-scheme`.
- Sin selector manual, sin `next-themes` y sin script en el `<head>`.
- `<meta name="theme-color">` con dos valores (`#f2f0eb` y `#111110`) mediante `viewport.themeColor` y `media`.

## Alternativas
- Selector de tema con `next-themes`: descartada. Añade una dependencia, un script bloqueante en el `<head>` para evitar el parpadeo y una preferencia que guardar. El selector manual queda fuera de alcance (spec §2).

## Consecuencias
- No hay parpadeo del tema porque es CSS puro.
- El visitante no puede contradecir a su sistema operativo desde la web.
- Las capturas de los proyectos son iguales en los dos temas y van sobre `surface-sunken` con borde `line`.

## Estado
Aceptado (2026-10-07)
