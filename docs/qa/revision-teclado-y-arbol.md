# Revisión por teclado y por el árbol de accesibilidad (T42)

Hecha el 2026-10-12 sobre <https://terryq.com> con Chromium (1280×900), recorriendo la página con `Tab` y leyendo el DOM y los nombres accesibles. **No sustituye** a la prueba con VoiceOver o NVDA (T43): detecta problemas de estructura, no cómo suena cada cosa.

Páginas revisadas: Inicio (ES y EN), caso de HB (ES) y Contacto (ES y EN).

## Resultado

| Comprobación | Resultado |
|---|---|
| `lang` del documento | `es` / `en` según la página |
| Un solo `h1` por página | ✅ en las 5 |
| Saltos de nivel de encabezado (h1 → h3…) | ✅ ninguno |
| Enlaces, botones y campos sin nombre accesible | ✅ ninguno |
| Imágenes sin `alt` | ✅ ninguna |
| Enlaces genéricos («aquí», «más»…) | ✅ ninguno |
| `id` duplicados | ✅ ninguno |
| Foco visible en cada elemento tabulable (hasta 40 por página) | ✅ todos tienen anillo |
| Primer `Tab` | ✅ «Saltar al contenido» / «Skip to content» |
| Orden de tabulación | ✅ coincide con el orden visual: saltar → logo → Trabajos → Servicios → Sobre mí → GitHub → Contacto → idioma → contenido |
| Enlaces externos | ✅ anuncian «(sitio externo)» / «(external site)» |
| Selector de idioma | ✅ «ES / EN: cambiar idioma a inglés» / «…switch language to Spanish» |
| Puntos de referencia (landmarks) | ✅ `header`, `nav «Principal»`, `main`, secciones con nombre, `aside «Ficha del proyecto»`, `footer`, `nav «Contacto y redes»` |

## Detalles que no son fallos

- **El «Saltar al contenido» funciona:** tras `Enter`, la URL pasa a `#contenido` y el siguiente `Tab` cae dentro de `main` («Ver trabajos»). El foco en sí queda en `body` (el `main` no es enfocable); es el comportamiento normal del navegador. Con VoiceOver o NVDA habrá que confirmar que el cursor virtual salta a `main` (T43).
- **Dos `nav «Principal»`:** uno es el menú de escritorio y el otro es el panel del menú móvil, oculto en escritorio (`display` sin caja), por lo que no se anuncia dos veces.
- **Encabezado «O escríbeme aquí / Escríbeme» en Contacto:** son dos variantes (móvil y escritorio) del mismo `h2`; solo una es visible a la vez.

## Mejora opcional
- Añadir `tabindex="-1"` a `main` para que el salto del enlace «Saltar al contenido» deje el foco *dentro* de `main` en Safari antiguo. Hoy el siguiente `Tab` ya cae bien, así que no es urgente.
