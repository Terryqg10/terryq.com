# Portfolio personal — Fase 3: Marca y Design System

> Estado: **v1.1 — APROBADO** por Terry (2026-10-07). Solo queda pendiente el avatar, a la espera de una foto.
> Design System (referencia viva para diseño y para Claude Code): https://claude.ai/artifact/GzhJExT74sjsTw4E3ufMds

El Design System es la **fuente de verdad** de la parte visual. Contiene:
- los tokens: color, tipo, espacio, radios, sombras y layout;
- la guía de marca (README);
- 10 componentes, cada uno con vista previa y guía;
- el logo TQ y el favicon.

Este documento solo resume las decisiones.

## Decisiones
| # | Decisión | Detalle |
|---|---|---|
| DS1 | **Paleta "Papel cálido"** con tema claro y oscuro | `paper` #F2F0EB / #111110 · `ink` #141414 / #F2F0EB · acento **verde bosque** `accent` #1F5B44 / #7CCFA6 · `live` para el punto de estado. Todos los pares de texto llegan a ≥4.5:1 en los dos temas (comprobado) |
| DS2 | **Tipografía** | Bricolage Grotesque (titulares, 600–700) · Instrument Sans (texto, 400/600) · JetBrains Mono (metadatos y los `< >`). Sin Inter/Roboto/Arial |
| DS3 | **Titular** `<Desarrollador web>` | Texto en display 700 `ink`; signos en mono 400 `ink-subtle` |
| DS4 | **Espacio y layout** | Escala de 4px; contenido a 1280px; rejilla de 12 columnas; secciones separadas por 96px (escritorio) / 64px (móvil) |
| DS5 | **Radios y sombras** | 16px contenedores (rounded-2xl), 24px marco del hero, 12px inputs, pastilla en botones; sombras muy suaves |
| DS6 | **Movimiento** | Tabla de momentos, duraciones y curva `cubic-bezier(0.22, 1, 0.36, 1)` en el README del sistema (basada en W20) |
| DS7 | **Logo TQ v2 (redibujado)** | Construcción geométrica a partir del original de Terry: todos los cortes a 45°, la Q es un círculo perfecto y el `</>` es simétrico. Versiones en SVG: negra, blanca e iconos cuadrados. Tamaño mínimo con `</>`: 40px. Archivos en `assets/brand/` y en el grupo *Logos* del sistema |
| DS8 | **Componentes** | Button, NavBar, CodeHeadline, FeaturedProject, WorkRow, StatusBadge, ReviewCard, CaseFacts, TextField, WhatsAppFab. Clases `tq-` en `components/bundle.css` |
| DS9 | **Favicon** | Solo "TQ", sin `</>`, porque el `</>` no se lee a 16–32px. Archivos y uso:<br>• `favicon.svg`: cambia a tinta clara con `prefers-color-scheme: dark`.<br>• `favicon.ico`: 16, 32 y 48 px.<br>• `apple-touch-icon.png`: 180px sobre `paper`.<br>En Next.js se colocan en `app/` (`icon.svg`, `favicon.ico`, `apple-icon.png`) |
| DS10 | **Foto / avatar** | El avatar será una ilustración vectorial basada en una foto de Terry; vale una foto con ropa de calle. Opcionalmente, una foto editada con IA para "Sobre mí" y LinkedIn, siempre con su cara real y sin alterar sus rasgos |

## Pendiente
- **Avatar ilustrado:** espera la foto de referencia de Terry.
- Siguiente fase: **F4 — UI en alta fidelidad** (aplicar el sistema a los wireframes). Arranca cuando Terry dé el visto bueno.
