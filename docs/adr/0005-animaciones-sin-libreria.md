# ADR-0005 · Animaciones sin librería

## Contexto
El diseño incluye entradas escalonadas, una inclinación de la captura del hero, apariciones al hacer scroll y la transición al abrir un caso. Hay que cumplir `prefers-reduced-motion` y mantener el JS pequeño (spec §6.6).

## Decisión
- Todo en CSS siempre que se pueda (`@keyframes`, `animation-timeline: scroll()` dentro de `@supports`).
- Tres islas cliente pequeñas: `HeroShowcase`, `Reveal` y `WorkTableClient` (spec §4.2).
- Transición al abrir un caso con `<ViewTransition>` de React como mejora progresiva. Si Next 16.4 pide `experimental.viewTransition`, se activa solo si el build y los tests pasan; si no, se cierra la tarea sin el efecto y se anota aquí.
- Solo se animan `transform` y `opacity`. Con movimiento reducido todo pasa a `none`.
- Prohibido: scroll secuestrado, cursor personalizado, botones magnéticos, parallax y contadores animados.

## Alternativas
- Motion (Framer): descartada. Pesa en el bundle y nada de lo que se necesita lo requiere.

## Consecuencias
- Menos JS y mejor LCP, porque el titular del hero nunca parte de `opacity: 0`.
- Las animaciones complejas no son posibles sin revisar este ADR.
- Sin soporte de `animation-timeline`, la captura del hero se queda en su estado de reposo.

- **Resultado de T21:** con Next 16.4.0 y React 19.3.0, `<ViewTransition>` funciona **sin** `experimental.viewTransition`: no hace falta ningún flag. Las imágenes `work-<slug>` (miniatura de la fila, tarjeta de Inicio e imagen del caso) usan `share="morph"` y `default="none"`; el CSS fija 450ms y, con movimiento reducido, anula las animaciones de las transiciones de vista.

## Estado
Aceptado (2026-10-07)
