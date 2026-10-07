# Portfolio personal — Fase 4: UI en alta fidelidad

> Estado: **FASE 4 CERRADA — Rondas 1, 2, 3 y 4 aprobadas** (Ronda 2 aprobada por Terry el 2026-10-07, al empezar la Fase 5) · Actualizado: 2026-10-07 · Depende de: F1 (copy), F2 (wireframes), F3 (Design System, aprobado)
> Lienzo de alta fidelidad: https://claude.ai/artifact/Wx2MFDB7P2hweFQ9jsdZf3

Aquí se aplica el Design System "Terry Q." a los wireframes. Los colores, las tipografías y los radios son tokens del sistema, y los artboards los usan como variables CSS con sus mismos nombres (`--paper`, `--ink-muted`, `--accent`, `--danger`…). Así Claude Code puede pasarlos tal cual a Tailwind.

**Destino:** este documento, el lienzo y el Design System son la referencia visual que recibe Claude Code en la Fase 5 (paquete de implementación: `spec.md` + `tasks.md`, siguiendo el desarrollo guiado por especificación).

## Plan por rondas
| Ronda | Artboards | Estado |
|---|---|---|
| 1 | Inicio · escritorio (claro) · Inicio · escritorio (oscuro) · Inicio · móvil | ✅ Aprobada |
| 2 | Trabajos · Caso de estudio (HB) · Caso · móvil | ✅ Aprobada (2026-10-07) |
| 3 | Servicios (con proceso y "Cómo uso la IA") · Sobre mí · Contacto · Estados del formulario · 404 — escritorio y móvil (9 artboards) | ✅ Aprobada |
| 4 | Inicio en inglés (escritorio) + revisión de accesibilidad de todos los artboards | ✅ Aprobada |

## Decisiones de la Ronda 1
| # | Decisión | Motivo |
|---|---|---|
| UI1 | **Etiquetas de sección como rutas**: `/trabajos`, `/servicios`, `/sobre-mi`, `/contacto` (en mono, con la `/` en el color de acento) | Hace de firma de código, en la línea de `<Desarrollador web>` y del `</>` del logo, y sustituye a la numeración 01, 02… que usan muchas plantillas. Coincide con las URLs reales |
| UI2 | **Titular a 92px en dos líneas**: `<Desarrollador` / `web>` | Lo primero que se ve es un momento tipográfico con mucha fuerza; los `< >` van en mono gris |
| UI3 | **Captura del hero con inclinación 3D** (−5°/3°) más un móvil superpuesto | Es el estado de reposo del efecto que sigue al ratón (W20); enseña escritorio y móvil a la vez |
| UI4 | **Fila de prueba separada por una línea** bajo los botones | Agrupa los datos (en producción · stack · ubicación) sin que compitan con los botones |
| UI5 | **Tarjeta de proyecto**: imagen 7/12 y datos 5/12; abajo, el stack en mono y "Ver caso →" | Se lee rápido: qué es → para quién → con qué está hecho |
| UI6 | **Servicios**: el bloque "Web" incluye los 3 tipos (landing, corporativa, aplicación) en filas de 12 columnas | Hace visible la oferta principal sin tener que ir a /servicios |
| UI7 | ~~Proceso como tira de 6 columnas~~ | Sustituida por UI13 |
| UI8 | **Cierre "¿Hablamos?" sobre `accent-soft`** con el email grande | Es el único bloque de color de la portada; el contacto se ve sin empujar a contratar (W17) |
| UI9 | **Reseñas con la etiqueta "Ejemplo"** | Solo sirven para el diseño; en producción solo se muestran reseñas reales (W14) |
| UI10 | **Móvil**: CTA principal a todo el ancho, GitHub y LinkedIn en dos columnas, reseñas en carrusel con *scroll-snap* y botón de menú de 44px | Áreas táctiles de 44px o más y el patrón de W14 |
| UI11 | **Capturas reales colocadas** (2026-10-07) | Se hicieron desde las webs publicadas. **Hero:** portada de HB (ya a 1600×1000), con la versión móvil en el marco de teléfono. **Tarjetas:** galería de obras de HB · Zona F (partidos en vivo, cuotas y boleto, **sin el hero ni las promos con jugadores reales**) · Finanzas en modo demo. Recortada la barra de desplazamiento. **Decisión de Terry: las capturas definitivas a 2x (≥1600px, sin barra de desplazamiento) las hará Claude Code en la implementación**; las del lienzo son de referencia (qué pantalla y qué encuadre) |
| UI12 | **"Sobre mí" en la portada, solo personal** (petición de Terry) | Se quita "Hablas conmigo desde el primer mensaje hasta el último ajuste" y "diseño y desarrollo webs para negocios". **Texto nuevo** (sustituye a F1 §3.6): *"Soy Terry. Empecé aprendiendo por mi cuenta, atrapado por las interfaces limpias y bien hechas, con ganas de entender cómo se construían por dentro. Hoy estudio Ingeniería del Software en la Universidad Politécnica de Madrid y vivo en Quijorna, en la sierra oeste de Madrid."* |
| UI13 | **Sin sección de proceso en la portada ni enlace "Proceso" en el menú** (decisión de Terry, 2026-10-07) | La portada sirve para presentarse y enseñar los trabajos. Menú: Trabajos · Servicios · Sobre mí · GitHub · Contacto. El contenido de proceso y "Cómo uso la IA" (F1 §7) pasa al final de /servicios (Ronda 3), donde sigue siendo útil para clientes y empresas. No hay página /proceso |

## Decisiones de la Ronda 2
| # | Decisión | Motivo |
|---|---|---|
| UI14 | **/trabajos: tabla filtrable** (Todo · Web · Marca, con contador) en filas de 12 columnas: año 1 · proyecto 6 (miniatura + nombre + resumen) · tipo 3 · estado 2 + flecha | Alta densidad, se escanea en segundos (W3). Los filtros son botones reales con `aria-pressed` |
| UI15 | **Vista previa flotante al pasar sobre una fila** (W20): tarjeta de 340px ligeramente girada (−2°) con la captura del proyecto, que se desplaza a la altura de la fila. En el lienzo funciona en modo Play | Da el "momento wow" de /trabajos sin saturar; solo con ratón, nunca en táctil; con `prefers-reduced-motion` aparece sin desplazarse |
| UI16 | **Cierre de /trabajos: bloque "Más código y experimentos en GitHub"** | W19; recuerda que el código de la propia web es público |
| UI17 | **Caso: cabecera** con volver a Trabajos, posición (01 / 03), ruta `/trabajos/hb-construcciones`, título-beneficio a 64px y fila de metadatos; **imagen principal** sobre `surface-sunken` con marco de navegador y móvil superpuesto que sobresale del bloque | Presenta el resultado antes de la explicación; el móvil enseña la barra fija, que es parte de la solución |
| UI18 | **Caso: ficha fija (sticky) 4/12 + narrativa 8/12** con secciones numeradas 01 Reto · 02 Solución (filas de 12 columnas: idea en negrita 4 + explicación 8, y piezas en imagen) · 03 Propuesta de identidad (kit de logo en 4 tiles) · 04 Resultado (+ testimonio, solo si existe) · 05 Para desarrolladores (desplegable `<details>`; en el lienzo aparece abierto para enseñar el contenido; **en la web, cerrado por defecto**) | W6 y W7. La ficha incluye "Mi papel" y el único botón de acento de la página: "Abrir la web ↗" |
| UI19 | **Caso: siguiente proyecto** como tarjeta grande con captura | Mantiene la navegación entre casos sin volver al índice |
| UI20 | **Caso en móvil:** ficha completa justo después de la imagen (W10), solución en lista apilada, kit de logo en 2×2 y "Para desarrolladores" cerrado | Datos clave antes de la narrativa; menos scroll |
| UI21 | **Plantilla común**: Zona F y Finanzas usan exactamente la misma plantilla de caso con su contenido de F1 §5.2 y §5.3 (no se dibujan aparte). En el lienzo, sus enlaces apuntan de momento a /trabajos | Evita duplicar artboards; Claude Code genera las tres páginas desde MDX con la misma plantilla |

## Decisiones de la Ronda 3
| # | Decisión | Motivo |
|---|---|---|
| UI22 | **/servicios: cabecera con índice "En esta página"** (Web · Marca y mantenimiento · Preguntas · Cómo trabajo · Cómo uso la IA). En móvil, chips con *scroll* horizontal | La página es larga y mezcla oferta, dudas y método; el índice deja saltar a lo que interesa |
| UI23 | **Web como bloque principal**: tabla de 12 columnas (Tipo 3 · Para quién 4 · Incluye 5) y franja "Siempre incluido" en `surface-sunken` con 7 puntos. **Marca** y **Mantenimiento y hosting** en dos tarjetas 6/6 | Misma jerarquía que la portada (UI6) pero con todo el detalle de F1 §6 |
| UI24 | **Cada servicio enlaza a una prueba real cuando existe**: Landing → caso HB · Aplicación a medida → Finanzas Personales y Zona F · Marca → kit de logo de HB. Web corporativa, sin ejemplo (aún no hay ninguno) | Tono de portfolio: en lugar de vender, enseña qué se ha hecho. ✅ Aprobado con la ronda |
| UI25 | **El precio pasa a ser la primera pregunta frecuente** ("¿Cuánto cuesta una web?", con el texto de F1 §6 sin cambios). Preguntas con `<details>` nativo, la primera abierta. La pregunta de la IA enlaza a `#ia` en vez de a "Proceso" | Quita el bloque de precio con su llamada a la acción; la información sigue ahí para quien la busca |
| UI26 | **Secciones internas con `#`**: `#preguntas`, `#proceso`, `#ia` (la `/` se reserva para páginas) | Mantiene la firma de código de UI1 y coincide con las anclas reales |
| UI27 | **"Cómo trabajo" como tabla de 6 filas** (paso 1 · nombre 3 · qué pasa 4 · qué recibes 4), números grandes en `ink-subtle`. En móvil, lista con "Recibes ·" en mono | Contenido de F1 §7 sin cambios; densidad alta, sin tarjetas infladas |
| UI28 | **"Cómo uso la IA"**: texto de F1 §7 (5/12) + panel "Del papel a producción" (7/12) con 4 pasos — Especificación `spec.md` · Tareas `tasks.md` · Implementación (Claude Code) · Revisión — y quién hace cada uno (**Yo** en `accent-soft`, **IA** con contorno; el paso de la IA lleva borde discontinuo). Botón "Ver el repositorio ↗" | Hace visible que la IA es una herramienta dentro de un proceso controlado, que es justo lo que busca una empresa. **Texto nuevo de apoyo** (aprobado): "El trabajo dividido en tareas, en orden y revisables" · "La IA programa cada tarea siguiendo la especificación" · "Las decisiones y la revisión final son siempre mías" |
| UI29 | **/servicios termina con dos accesos**: "Ver los trabajos" y "Cuéntame tu idea" (contacto), sin bloque de color | Cierre discreto, sin repetir el "¿Hablamos?" de la portada |
| UI30 | **/sobre-mi**: titular "Hola, soy Terry" a 88px + retrato 4:5 (pendiente de foto); historia 8/12 con **ficha fija** 4/12 (Ubicación · Formación · Idiomas · Tecnologías en chips), el mismo patrón que el caso (UI18); frase destacada **`<Webs que cualquiera entiende a la primera>`** con los signos del titular (DS3). Texto de F1 §8 sin cambios | Página personal, con un momento tipográfico propio y coherente con el hero |
| UI31 | **"Para empresas" al final de /sobre-mi**, en su propia tarjeta, con el único botón de acento: "Descargar CV" (+ LinkedIn y GitHub). **Texto final de Terry (2026-10-07):** dos frases, breves y seguras — tiene las cualidades y habilidades para aportar y ser un gran colaborador, e invita a conocer sus proyectos (enlace a /trabajos). Sin chips ni listas de modalidades | La historia queda solo personal; lo dirigido a quien contrata está aparte y suena elegante, sin pedir |
| UI32 | **/contacto: 5/12 + 7/12** — titular, entradilla, "Otros canales" (WhatsApp con el mensaje preparado · Email · LinkedIn) en filas, y "Respondo en 24 h laborables"; a la derecha, el formulario en una tarjeta. En la cabecera, el botón Contacto aparece relleno (página actual). En móvil, WhatsApp justo debajo de la entradilla y los demás canales después del formulario | El canal rápido se ve primero en móvil; en escritorio el formulario manda |
| UI33 | **Copy de contacto adaptado al tono de portfolio** (✅ aprobado con la ronda): entradilla *"Cuéntame qué tienes en mente y te respondo en 24 h laborables. Si lo prefieres, escríbeme directamente por WhatsApp."* (quita "con un presupuesto cerrado") y nueva opción **"Propuesta de trabajo"** en "¿Qué necesitas?" | El formulario también debe servir a empresas que quieran contratar a Terry, que es el objetivo del portfolio |
| UI34 | **Formulario**: "¿Qué necesitas?" como pastillas (radio accesibles, `fieldset` + `legend`); solo se marca el campo opcional ("Web actual, si tienes"); privacidad con casilla de 20px en `accent`. Sin validación nativa del navegador: valida al enviar | Menos ruido que los asteriscos; mensajes propios y coherentes |
| UI35 | **Estados del formulario** (artboard "Estados" + interactivo en Play con el ajuste `estado` y `simularFallo`): **Normal** · **Validación** (resumen `role="alert"` + mensaje bajo cada campo con icono, `aria-invalid` y `aria-describedby`; borde `danger`) · **Enviando** (spinner y botón desactivado) · **Error de envío** (aviso con el texto de F1 §9; **se conservan los datos** y se puede reintentar) · **Enviado** (sustituye al formulario en la misma tarjeta, `role="status"`, con WhatsApp, "Enviar otro mensaje" y enlace a trabajos) | `danger` solo en errores y siempre con texto (DS). **Mensajes nuevos** (aprobados): "Faltan datos para poder enviarlo." · "Escribe tu nombre." · "Necesito un email o un teléfono para responderte." · "Revisa el formato: un email (tu@email.com) o un teléfono." · "Elige una opción." · "Cuéntame un poco de tu proyecto." · "Acepta la política de privacidad para poder enviarlo." |
| UI36 | **404**: ruta pedida en mono (`/trabjos → 404`, en producción la real), titular y texto de F1 §10, `<404>` enorme con los signos del titular, botones "Volver al inicio" (acento) y "Ver trabajos", y accesos a las cuatro páginas | Convierte el error en una salida clara, con la misma firma visual |
| UI37 | **Menú móvil a pantalla completa** (`role="dialog"`, `aria-modal`): enlaces grandes con su ruta, página actual marcada en acento, Contacto como botón de acento, ES/EN y LinkedIn; botón de cerrar de 44px. Funciona en Play en todos los artboards móviles, incluidos Inicio · móvil y Caso · móvil (2026-10-07) | Cumple "los modales siempre se pueden cerrar" y "ningún botón sin acción" |
| UI38 | **Navegación del lienzo conectada**: el menú de Inicio, Trabajos y Caso (y "Ver servicios →" y "Conóceme →" de la portada) ya lleva a las páginas nuevas | Sin enlaces a anclas provisionales. En Inicio · móvil, "Ver servicios" y "Conóceme" llevan a las páginas móviles |

## Decisiones de la Ronda 4
| # | Decisión | Motivo |
|---|---|---|
| UI39 | **Página de muestra en inglés: Inicio · escritorio** (artboard "Home · desktop · English") | Es la página con más variedad de componentes (hero, tarjetas, reseñas, servicios, sobre mí, cierre, pie) y la primera que ve una empresa extranjera. El resto de páginas EN se generan desde `01b-content-en.md` v2 con las mismas plantillas |
| UI40 | **Mismo layout en ES y EN, sin ajustes por idioma.** El inglés es un 10–15% más corto; ningún componente depende de la longitud del texto | Una sola plantilla por página; menos mantenimiento |
| UI41 | **Rutas de sección en inglés** (`/work`, `/reviews`, `/services`, `/about`, `/contact`) y `<Web developer>` en el titular | Coinciden con las URLs `/en/...` reales (UI1) |
| UI42 | **Selector de idioma**: texto visible `ES / EN` con el idioma actual en `ink`; nombre accesible que empieza por el texto visible ("ES / EN: cambiar idioma a inglés" / "…switch language to Spanish") y `hreflang`. En el lienzo, ES ↔ EN enlazan entre sí en Inicio | WCAG 2.5.3 (la etiqueta incluye el texto visible) |
| UI43 | **WhatsApp en EN** abre el chat con "Hi Terry, I found your website and I'd like to talk about " (en vez de "…a quote for") | Tono de portfolio. **[F5, 2026-10-07]** El español se alinea: "Hola Terry, vengo de tu web y quería hablarte de " |
| UI44 | **01b-content-en.md v2**: alineado con F1 v2.1 (sin /process, servicios con ejemplos, precio en FAQ, IA, contacto, validación, para empresas, 404, SEO) | Fuente única del copy en inglés para Claude Code |

### Revisión de accesibilidad (WCAG 2.2 AA) — todos los artboards
| Criterio | Estado | Detalle |
|---|---|---|
| 1.1.1 Texto alternativo | ✅ | Capturas con `alt` descriptivo; logos dentro de enlaces con `alt=""` + `aria-label` en el enlace; decoración (`< >`, `<404>`, puntos de estado, iconos) con `aria-hidden` |
| 1.3.1 Estructura | ✅ | Un `h1` por página, `h2` por sección, `h3` en tarjetas; `header`/`nav`/`main`/`footer`; listas, `dl` para fichas, `fieldset`+`legend` en las pastillas del formulario |
| 1.4.3 Contraste | ✅ corregido | `ink-subtle` solo en texto ≥24px o marcas. **Arreglado:** la pista "Pasa el ratón por una fila…" de /trabajos (12px) pasa a `ink-muted` |
| 1.4.1 Uso del color | ✅ | Estados (Online/Demo) y errores siempre con texto e icono, no solo color |
| 1.4.10 Reflow / 1.4.4 Texto al 200% | ✅ | Páginas fluidas (`flex-wrap`, rejillas que pasan a una columna); tabla de /trabajos con scroll propio |
| 2.1.1 Teclado | ✅ corregido | Todo son `a`, `button`, `input`, `details`. **Añadido** `tabindex="0"` + `role="region"` + nombre a las zonas con scroll horizontal (carrusel de reseñas, tabla de proyectos) |
| 2.4.1 Saltar bloques | ✅ añadido | **Enlace "Saltar al contenido"** (aparece al recibir foco) en todas las páginas, apuntando a `main` |
| 2.4.3 Orden del foco / 2.4.7 Foco visible | ✅ | Orden del DOM = orden visual; anillo de 2px en `accent` con `outline-offset` en todos los controles |
| 2.4.4 Propósito de enlaces | ✅ | Textos explícitos ("Ver caso →", "Abrir la web ↗"); `aria-current="page"` en el menú |
| 2.5.3 Etiqueta en el nombre | ✅ corregido | Selector de idioma (UI42) |
| 2.5.8 Tamaño del objetivo | ✅ corregido | Controles ≥44px en móvil y ≥24px en escritorio. **Arreglado:** "Aviso legal" y "Privacidad" del pie de escritorio con área de 44px de alto |
| 2.3.3 / movimiento | ✅ | `prefers-reduced-motion` desactiva transiciones; la vista previa de /trabajos aparece sin desplazarse |
| 3.1.1 / 3.1.2 Idioma | ✅ | `lang="es"` / `lang="en"` por página; `hreflang` en el selector |
| 3.3.1 / 3.3.2 / 3.3.3 Formularios | ✅ | Etiquetas visibles, campo opcional marcado, errores por campo con texto + `aria-invalid` + `aria-describedby`, resumen `role="alert"`, éxito `role="status"`, datos conservados tras un fallo |
| 4.1.2 Nombre, función, valor | ✅ | Menú móvil con `aria-expanded`/`aria-controls`, filtros con `aria-pressed`, botones solo icono con `aria-label` |

**Para la implementación (no se puede representar en el lienzo):**
- Menú móvil: atrapar el foco dentro del panel, cerrarlo con `Esc`, devolver el foco al botón de menú y bloquear el scroll del fondo.
- Formulario: al fallar la validación, mover el foco al resumen de errores; tras enviar, mover el foco al mensaje de éxito.
- `scroll-margin-top` en las secciones con ancla para que la cabecera fija no tape los títulos.
- Enlaces externos (↗) en la misma pestaña; si alguno se abre en otra, añadir "(se abre en una pestaña nueva)" como texto oculto.
- Comprobar con axe y Lighthouse (objetivo 100 en accesibilidad), lector de pantalla (VoiceOver/NVDA) y zoom al 200% antes de publicar.

## Capturas (referencia de encuadre)
| Archivo | Contenido | Uso |
|---|---|---|
| `hb-portada-escritorio` | Portada de HB a 1440×900 (1600×1000) | Hero y caso de HB |
| `hb-movil` | Portada de HB a 375×812 (2x) | Hero (teléfono) y caso de HB |
| `hb-trabajos-escritorio` | Galería "Nuestros trabajos" de HB | Tarjeta de HB, miniatura, caso |
| `zonaf-escritorio` | Partidos en vivo, cuotas y boleto con una selección | Tarjeta de Zona F, miniatura |
| `zonaf-movil` | Partidos en vivo en móvil (2x) | Siguiente proyecto (móvil); caso de Zona F |
| `finanzas-escritorio` | Panel en modo demo (datos de ejemplo) | Tarjeta de Finanzas, miniatura |
| Kit de logo HB (SVG) | Color · negativo (fondo #132A4F) · monocromo · icono | Caso de HB, sección 03; tarjeta Marca de /servicios |

## Pendiente
- Avatar ilustrado y retrato de /sobre-mi (esperan la foto). Mientras tanto se muestra el monograma TQ (spec §9.6). CV en PDF.
- Capturas definitivas a 2x: tarea de Claude Code en la implementación.
- **Fase 5 — paquete de implementación:** `spec.md` aprobado el 2026-10-07; `tasks.md` y kit entregados el mismo día.
- **/trabajos en móvil** (sin artboard): filas apiladas sin scroll horizontal, aprobado por Terry en la Fase 5 (spec §8.2). Sustituye a la "tabla con scroll propio" de la revisión de accesibilidad.
