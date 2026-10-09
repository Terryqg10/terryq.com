# ADR-0010 · Logo en línea con `currentColor`

## Contexto
El logo `</>` debe verse bien en el tema light y en el dark. El DS fija una altura mínima para que se lea (spec §6.7).

## Decisión
- `components/layout/Logo.tsx` incluye el SVG de `tq-logo-negro.svg` en línea con `fill="currentColor"` (color `ink`), así que se adapta al tema sin cambiar de archivo.
- Altura de 40px como mínimo en la cabecera y el pie. Los artboards usan 36/32px; se impone la regla del DS.
- No se recolorea con el acento, ni lleva sombras ni contornos.

## Alternativas
- Dos archivos (negro y blanco) que cambian por tema: descartada. Obliga a intercambiarlos con CSS o JS, duplica los assets y puede mostrar el equivocado.

## Consecuencias
- Un solo origen del logo y cero peticiones extra.
- El SVG forma parte del HTML; el enlace lleva `aria-label` y el SVG, `alt=""`.

## Estado
Aceptado (2026-10-07)
