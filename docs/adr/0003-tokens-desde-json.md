# ADR-0003 · Tokens generados desde `tokens.json`

## Contexto
El sistema de diseño define sus colores, sombras y medidas en `design/tokens.json`. El CSS debe coincidir con él y no separarse con el tiempo (spec §6.1).

## Decisión
- `scripts/build-tokens.ts` (`pnpm tokens`) genera `src/styles/tokens.css` desde `design/tokens.json`: variables `--tq-*` con el valor light en `:root` y el valor dark bajo `prefers-color-scheme`.
- La CI ejecuta `pnpm tokens && git diff --exit-code`: si el archivo generado cambia, falla.
- `globals.css` borra la paleta de Tailwind (`--color-*: initial`) y mapea solo los colores del DS con `@theme inline`.
- Los radios y espaciados son los de Tailwind por defecto.

## Alternativas
- Tokens escritos a mano en el CSS: descartada, se desincronizan del DS sin que nadie lo note.
- Copiar el `bundle.css` del kit de diseño: descartada, trae estilos que no usamos y no se puede comprobar contra `tokens.json`.

## Consecuencias
- Solo existen los colores del DS; un color fuera de él no compila en Tailwind.
- Hay que acordarse de ejecutar `pnpm tokens` y subir el resultado cuando cambie `tokens.json`; la CI lo recuerda.

## Estado
Aceptado (2026-10-07)
