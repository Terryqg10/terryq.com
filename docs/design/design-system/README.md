Sistema visual del portfolio de **Terry Quiñonez** (terryq.com), desarrollador web en Madrid. Es la referencia para diseñar y programar la web: cada decisión de color, tipo, espacio y movimiento sale de aquí. Base: "Papel cálido" — un lienzo neutro y cálido donde el trabajo es el protagonista, un único verde de acento y un guiño constante al código (`< >`).

## Principios

1. **El trabajo es el protagonista.** El sistema es sobrio para que las capturas de los proyectos destaquen. Nada de decoración sin propósito.
2. **Densidad con aire.** Filas compactas en rejilla de 12 columnas para escanear; el espacio en blanco (`space-24` entre secciones) separa, no las líneas gruesas ni las sombras.
3. **Contraste de peso, no de color.** La jerarquía se construye con `display` en 700 frente a `body` en 400 y con `ink` frente a `ink-muted`. El color de acento es escaso.
4. **Sutil y fluido.** Pocas animaciones, muy cuidadas. Nada se mueve sin motivo.
5. **El código como firma.** Los signos `< >` del titular y el `</>` del logo son el rasgo de marca; se usan con moderación.

## Voz y contenido

- Español de España, **tuteo**, primera persona del singular ("diseño", "construyo"). Es una persona, no una agencia.
- Concreto antes que bonito: "Web para una empresa de reformas, pensada para recibir presupuestos por WhatsApp", no "soluciones digitales innovadoras".
- Tono de portfolio, no de venta: sin "Pide tu presupuesto" ni urgencias. El contacto es discreto ("¿Hablamos?").
- Solo datos reales. Nunca reseñas, cifras ni clientes inventados; las reseñas de ejemplo no se publican.
- Sin emojis. Metadatos en mono con separador ` · ` (punto medio con espacios): `01 · 2026 · ● Online`.
- Inglés: misma estructura, inglés británico natural (`<Web developer>`).

## Color

- Fondo de página: `paper`. Contenedores: `surface` con borde `line` de 1px y `radius-lg`. Zonas hundidas (fondo de capturas): `surface-sunken`.
- Texto: `ink` para titulares y texto principal; `ink-muted` para descripciones y metadatos. `ink-subtle` **solo** en texto ≥24px o marcas (los `< >` del titular).
- Acento `accent` (verde bosque): botón principal, enlaces dentro de texto y anillo de foco. Como mucho **un** botón `accent` por pantalla. Texto sobre relleno accent: `on-accent`.
- Estado "Online / En producción": punto `live` + la palabra, en `meta`. Nunca solo el color.
- `accent-soft`: fondo del bloque de cierre "¿Hablamos?" y de chips de estado.
- Botón flotante de WhatsApp: `inverse-bg` con icono `inverse-ink`.
- Ambos temas (claro y oscuro) son obligatorios y siguen `prefers-color-scheme`; todos los pares de texto cumplen 4.5:1 en los dos (ver notas de cada token).

## Tipografía

Tres familias de Google Fonts (cargar con `display=swap` y solo los pesos usados):

| Rol | Familia | Pesos | Uso |
|---|---|---|---|
| `display` | Bricolage Grotesque | 600, 700 | Titulares: `display-xl`, `display-l`, `heading-1`, `heading-2` |
| `sans` | Instrument Sans | 400, 600 | Todo el texto: `body-l`, `body`, `body-strong`, `small`, `button` |
| `mono` | JetBrains Mono | 400, 500 | Metadatos y etiquetas: `meta`, `label`; los `< >` del titular |

- El titular del hero es `<Desarrollador web>` en `display-xl`: el texto en `ink` 700 y los signos `< >` en `mono` 400, color `ink-subtle`.
- Titulares con `text-wrap: balance`; párrafos con máx. `text-max` (640px).
- Tamaños de display fluidos en la implementación con `clamp()` entre el valor móvil indicado en cada estilo y el de escritorio.
- Números alineados (años, tablas): `font-variant-numeric: tabular-nums`.
- Nunca Inter, Roboto ni Arial.

## Espacio y layout

- Contenido centrado a `content-max` (1280px); gutter lateral `space-4` en móvil y 40px en escritorio.
- Rejilla de `grid-columns` (12): filas de tabla (año 1 · miniatura 2 · proyecto 4 · tipo 3 · estado 2) y composiciones 7/5 (hero, filas destacadas, servicios) y 4/8 (ficha + narrativa del caso).
- Secciones separadas por `space-24` (escritorio) / `space-16` (móvil) y un divisor `line` de 1px.
- Controles con altura mínima `tap-min` (44px).

## Bordes, radios y sombras

- Contenedores principales: `radius-lg` (16px, el "rounded-2xl"). Marco del hero e imagen del caso: `radius-xl`. Inputs: `radius-md`. Botones y chips: `radius-pill`.
- La separación se hace con borde `line` y espacio. `shadow-sm` en reposo, `shadow-md` solo en el marco del hero y en hover; `shadow-float` solo en el botón de WhatsApp.
- Prohibido: tarjetas con borde de color a la izquierda, degradados, glassmorphism.

## Movimiento

Sutil y fluido. Solo se animan `transform` y `opacity`; objetivo 60 fps. Con `prefers-reduced-motion: reduce` todo pasa a aparición instantánea.

| Momento | Qué hace | Duración · curva |
|---|---|---|
| Titular del hero | Las líneas suben 100% dentro de una máscara, escalonadas 60ms; los `< >` aparecen al final | 600ms · `cubic-bezier(0.22, 1, 0.36, 1)` |
| Captura del hero | Inclinación 3D que sigue al ratón (máx. 4°, `perspective: 1200px`); al hacer scroll se aplana y escala de 0.96 a 1 | seguimiento con suavizado 150ms |
| Secciones | Aparecen al entrar en pantalla: opacity 0→1, translateY 12px→0, una sola vez | 450ms · misma curva |
| Miniatura en /trabajos | Sigue al cursor sobre la fila (desplazada 24px), escala 0.9→1 al entrar | 250ms |
| Abrir un proyecto | View Transitions: la imagen de la fila crece hasta ser la imagen principal del caso | 450ms |
| Enlaces y botones | Subrayado que crece de izquierda a derecha; botón: fondo `accent-hover` | 150ms |

- El contenido es visible desde el primer fotograma: las entradas parten de un estado legible, nunca de `opacity: 0` esperando al scroll.
- No hay scroll "secuestrado", cursor personalizado ni botones magnéticos.
- En móvil no hay efectos de ratón; las entradas se acortan a 300ms.

## Iconografía

- Iconos de trazo de **Lucide** (`stroke-width` 1.75, 20px; 24px en el botón flotante), color `currentColor`.
- Sin emojis como iconos. Flechas de texto `→` y `↗` (enlace externo) en enlaces.
- Iconos de marcas de terceros (GitHub, LinkedIn): solo el nombre como texto o el icono genérico de Lucide.

## Logo

- Logo oficial: monograma **TQ** con `</>` en la Q (grupo de assets *Logos*). Siempre enlaza a la portada.
- Fondos claros: `tq-logo-negro.svg`; fondos oscuros: `tq-logo-blanco.svg`. Perfiles: iconos cuadrados.
- Geometría: todos los cortes a 45°, Q circular y `</>` simétrico (versión redibujada del original de Terry).
- Tamaño mínimo con `</>` legible: 40px de alto. Por debajo se usa el **favicon**: solo "TQ", sin `</>` (`favicon.svg`, que cambia a tinta clara en modo oscuro; `apple-touch-icon.png` de 180px sobre `paper` para iPhone).
- No recolorear con el acento, no añadir sombras ni contornos.

## Avatar

Ilustración vectorial de Terry (pendiente de foto de referencia). Pequeño (52px, círculo) junto a "Hola, soy Terry Quiñonez · Madrid" en el hero; grande en "Sobre mí" y en la página 404. En escritorio, los ojos siguen al cursor; quieto con `prefers-reduced-motion`.

## Accesibilidad

- Anillo de foco: contorno sólido de 2px `accent` con 2px de separación (`outline-offset: 2px`) en todo elemento interactivo; ≥3:1 sobre `paper` y `surface` en ambos temas.
- Controles reales: `<a href>`, `<button>`, `<input>` con `<label>`. Botones solo icono con `aria-label`.
- Estado nunca solo por color (el punto `live` siempre lleva la palabra).
- Objetivo WCAG 2.2 AA.

## Componentes

`Button`, `NavBar`, `CodeHeadline`, `FeaturedProject`, `WorkRow`, `StatusBadge`, `ReviewCard`, `CaseFacts`, `TextField`, `WhatsAppFab`. Las clases están en `components/bundle.css` (prefijo `tq-`); cada componente tiene su guía y su vista previa.
