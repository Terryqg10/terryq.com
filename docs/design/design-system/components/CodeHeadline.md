# CodeHeadline

El titular del hero: la frase de presentación con el avatar y `<Desarrollador web>`.

**Estructura:** `tq-intro` (avatar 52px + texto en `meta`) → `h1.tq-headline` con los signos en `tq-headline__bracket` → subtítulo en `body-l` `ink-muted`.

**El consumidor aporta:** el texto del titular en el idioma activo (`Desarrollador web` / `Web developer`) y el avatar (SVG; mientras no exista, el círculo con "TQ").

**Movimiento:** las líneas suben dentro de una máscara (600ms, escalonado 60ms); los signos aparecen al final. Con `prefers-reduced-motion`, sin animación.

**Reglas:** un solo `h1` por página. Tamaño fluido `clamp(44px, 8vw, 80px)`. Los signos nunca en `accent`.
