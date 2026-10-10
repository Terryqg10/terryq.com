# Guion de prueba manual (T38 · spec §13 A11 y A13)

Lo hace Terry con la web en **producción o en el preview de Vercel** (no en local: el CSP y las cabeceras solo se aplican en producción). Duración aproximada: 1 hora. Anota el resultado de cada paso (✅ / ⚠️ con una frase / ❌) y pásamelo; lo copio al PR.

> Ya automatizado (no hace falta repetirlo a mano): axe sin infracciones en todas las páginas, idiomas y temas; objetivos táctiles ≥44 px en 390 px; formulario con errores y envío; menú móvil (foco, `Esc`, scroll bloqueado); `prefers-reduced-motion`; **sin scroll horizontal a 320 px y con zoom al 200 %** (`reflow.spec.ts`). Lo de abajo es lo que solo una persona con un lector de pantalla puede juzgar.

## 1. Zoom al 200 % y reflow a 320 px (A11)
En Chrome, ventana de 1440 px de ancho, `Ctrl` + `+` hasta el 200 % (equivale a 720 px), y después ventana estrecha de 320 px (o el modo móvil de DevTools a 320×640).

| Páginas | Qué mirar | Resultado |
|---|---|---|
| Inicio, un caso (HB), Contacto, Servicios | No hay scroll horizontal. Nada queda cortado ni tapado: titulares, botones, tabla de «Cómo trabajo», franja «Siempre incluido», formulario | |
| Menú móvil abierto | Se ven todas las opciones y el botón de cerrar | |
| Texto al 200 % (solo el texto, `Ctrl` + `+` en Firefox con «solo texto») | El botón flotante de WhatsApp no tapa contenido importante | |

## 2. Lector de pantalla (A13)
Recorridos que hay que hacer, en **español** y repetir el de Inicio en **inglés** (`/en`):

### 2.1 VoiceOver (macOS con Safari; si tienes iPhone, también Safari en iOS)
Activa VoiceOver con `Cmd` + `F5`. Navega con `Ctrl` + `Opt` + flechas, y con el rotor (`Ctrl` + `Opt` + `U`) para encabezados, enlaces y formularios.

### 2.2 NVDA (Windows con Firefox o Chrome)
Navega con `H` (encabezados), `K` (enlaces), `F` (campos de formulario), `D` (regiones) y `Tab`.

### Recorrido A · Inicio
| Paso | Se espera | Resultado |
|---|---|---|
| Al cargar y pulsar `Tab` una vez | Primer foco: «Saltar al contenido». Con `Enter` el foco pasa al contenido principal | |
| Encabezados | Un solo `h1` («Desarrollador web…»); los `h2` siguen el orden de las secciones | |
| Titular `<Desarrollador web>` | Lo lee como «Desarrollador web», sin decir «menor que»/«mayor que» | |
| Cabecera | La navegación se anuncia como «Principal» y la página actual como «página actual» | |
| Tarjetas de proyectos | Cada tarjeta es un enlace con el nombre del proyecto; se entiende a dónde lleva sin ver la imagen | |
| Capturas | Los textos alternativos describen la pantalla; el logo dentro de enlaces no se lee dos veces | |
| Enlaces con ↗ | Dice «(sitio externo)» tras el texto | |
| Botón flotante de WhatsApp | Tiene nombre («WhatsApp»…) y abre el chat | |
| Selector de idioma | Dice el idioma al que cambia y su `hreflang` es el correcto | |

### Recorrido B · Un caso (HB Construcciones)
| Paso | Se espera | Resultado |
|---|---|---|
| Encabezados | `h1` con el título del caso; `h2` numerados por sección | |
| «Ficha del proyecto» | Se anuncia como grupo con ese nombre y cada dato se lee como etiqueta + valor | |
| Galería y kit de logo | Cada pieza tiene nombre y se distingue color / negativo / monocromo / icono | |
| «Para desarrolladores» (desplegable) | Se anuncia como cerrado/abierto; se abre con `Enter` o `Espacio` | |
| «Siguiente proyecto» | Es un enlace con el nombre del siguiente caso | |

### Recorrido C · Contacto
| Paso | Se espera | Resultado |
|---|---|---|
| Campos | Cada campo se anuncia con su etiqueta; los opcionales dicen «opcional» | |
| Enviar vacío | El foco va al resumen de errores («Faltan datos…») y se lee; cada campo con error se anuncia como «no válido» con su mensaje | |
| Corregir y enviar | Se anuncia «Enviado» / «Recibido» y el foco está en ese mensaje | |
| Casilla de privacidad | Se entiende a qué obliga y el enlace a Privacidad es alcanzable | |
| Aviso «Llega a contacto@terryq.com» | Se lee tras el botón de enviar | |

## 3. Qué hacer con los resultados
- ✅ en todo: T38 queda sin bloqueos.
- ⚠️ (molesta pero se puede usar): lo anoto como mejora y no bloquea.
- ❌ (no se puede completar una tarea): lo arreglo en este PR y repites ese paso.
