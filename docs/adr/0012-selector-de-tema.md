# ADR-0012 · Botón de modo claro y oscuro

## Contexto
El ADR-0004 decidió que el tema dependiera solo de `prefers-color-scheme`, sin selector manual (spec §2 lo dejaba fuera de alcance). Terry pidió el 2026-10-12 un botón visible para cambiar entre modo claro y oscuro, porque no se encuentra cómo hacerlo desde la web.

## Decisión
- Un botón de icono (luna en claro, sol en oscuro) en la cabecera, junto al selector de idioma, en escritorio y en móvil. Es un interruptor: `aria-pressed` indica si el modo oscuro está activo; la etiqueta es «Modo oscuro» / «Dark mode». Mide 44×44.
- La elección se guarda en `localStorage` (clave `tq-theme`, valores `light` o `dark`), **sin cookies**. Sin elección, el tema sigue al sistema.
- La elección se aplica en `<html data-theme="light|dark">`. `tokens.css` (generado) mantiene `prefers-color-scheme` para el caso sin elección (`:root:not([data-theme='light'])`) y añade `:root[data-theme='dark']` y `:root[data-theme='light']` con su `color-scheme`.
- Un script en línea de pocas líneas en el `<head>` pone `data-theme` antes del primer pintado, para que no haya parpadeo. La CSP ya permite scripts en línea (`'unsafe-inline'`). `<html>` lleva `suppressHydrationWarning`.
- El icono lo decide el CSS (`tq-theme-sun`, `tq-theme-moon`) y es correcto antes de hidratar.
- Se añade la isla cliente `ThemeToggle` (spec §4.2). **No** se instala `next-themes`: el script y el botón son propios.

## Alternativas
- `next-themes`: descartada. Otra dependencia para algo que son 8 líneas de script y un botón.
- Cookie en vez de `localStorage`: descartada. La web no usa cookies (§15.3) y no hace falta que el servidor sepa el tema.
- Selector de tres estados (sistema / claro / oscuro): descartada por simplicidad. El visitante que quiera volver a «seguir al sistema» borra los datos del sitio.

## Consecuencias
- Sustituye a lo decidido en el ADR-0004 sobre «sin selector manual y sin script en el `<head>`». El resto de ese ADR sigue vigente (CSS puro como base, `theme-color` con dos valores).
- La barra del navegador móvil (`theme-color`) sigue al sistema aunque el visitante contradiga el tema: es un detalle menor.
- Las capturas de los proyectos no cambian entre temas (§6.4).
- La política de privacidad dice que la web no usa cookies, y sigue siendo cierto. `localStorage` solo guarda una preferencia de interfaz que el visitante pide al pulsar el botón; no la envía a ningún sitio. Si Terry quiere mencionarlo en la política, es un cambio de texto legal que debe aprobar él.

## Estado
Aceptado (2026-10-12) · sustituye parcialmente al ADR-0004
