# CLAUDE.md — terryq.com

Portfolio bilingüe (ES/EN) de Terry Quiñonez. Next.js 16 (App Router) + TypeScript estricto + Tailwind 4 + next-intl, en Vercel. Se desarrolla **guiado por especificación**.

## Antes de escribir código
1. Lee `docs/spec.md` (la fuente de verdad técnica) y la tarea que toca en `docs/tasks.md`.
2. Lee solo las secciones del spec que cita la tarea, y las fuentes que esas secciones mencionan (§0.1):
   - Copy ES: `docs/planning/01-contenido-es.md` · Copy EN: `docs/planning/01b-content-en.md`
   - Comportamiento de UI: `docs/planning/04-ui-alta-fidelidad.md`
   - Medidas: `docs/design/artboards/*.html` (HTML con estilos en línea; las imágenes están en `assets/`)
   - Tokens: `design/tokens.json` · Marca: `docs/design/design-system/README.md`
3. Los README de componentes de `docs/design/design-system/components/` son **anteriores a la Fase 4**. Si contradicen a F4 o al spec (p. ej. «Proceso» en el menú, asteriscos en los campos), ganan F4 y el spec.

## Reglas que no se negocian
- **Una tarea = una rama `t-XX-…` = un PR.** No adelantes trabajo de otras tareas.
- **No inventes** copy, datos, cifras, reseñas ni enlaces. Si falta algo o las fuentes chocan, **para y pregunta a Terry**.
- Cero `any`, `@ts-ignore` y `eslint-disable` sin justificación. Tipos cerrados y uniones discriminadas.
- Server Components por defecto. `'use client'` solo en las islas de spec §4.2.
- Todo el texto visible sale de `messages/*.json` o del MDX.
- Ningún enlace muerto ni botón sin acción. El contenido pendiente se oculta con los flags de spec §9.6.
- Solo colores del DS (`bg-paper`, `text-ink-muted`…). Prohibidos los colores arbitrarios.
- Respeta `prefers-reduced-motion` y WCAG 2.2 AA (spec §13).
- Si una decisión cambia, actualiza el spec y su ADR en el mismo PR.

## Comandos
```bash
pnpm dev            # desarrollo
pnpm build          # build de producción (todas las páginas estáticas)
pnpm typecheck      # TypeScript
pnpm lint           # ESLint
pnpm test           # Vitest
pnpm e2e            # Playwright (con CONTACT_TRANSPORT=mock)
pnpm tokens         # regenera src/styles/tokens.css desde design/tokens.json
pnpm screenshots    # capturas 2x de los proyectos (T35)
pnpm lhci           # Lighthouse CI
```

## Terminado = (spec §17.5)
CA de la tarea cumplidos · tests escritos y en verde · CI en verde · casilla marcada en `docs/tasks.md` · preview revisado por Terry.
