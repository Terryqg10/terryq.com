# Portfolio personal — Fase 1: Contenido y posicionamiento

> Estado: **v2.2 — APROBADO por Terry** · Actualizado: 2026-10-07 (F5: el mensaje de WhatsApp en español pasa al tono de portfolio, igual que el inglés) · v2.1: cambios de la Fase 4, Ronda 3 (proceso e IA dentro de /servicios, precio dentro de las preguntas frecuentes, contacto con tono de portfolio) · v2.0 aprobada el 2026-10-06 · Fecha: 2026-10-05 · Depende de: `docs/00-fase-0-descubrimiento.md` (cerrada)
> Idioma: español de España. Versión en inglés: `docs/01b-content-en.md`.
> Los cambios hechos durante la Fase 4 se marcan con **[F4 · UIxx]** y su decisión está en `docs/04-fase-4-ui-alta-fidelidad.md`.

**Cómo leer este documento**
- `[DATO: …]`: falta información que solo tienes tú. No se inventa nada.
- `▸ Elegir`: hay variantes; marca la que prefieras o pide otra.
- Los textos son **copy final propuesto**, no ejemplos: lo que apruebes es lo que irá en la web.

---

## 0. Principios de voz y tono

| Principio | Cómo se aplica |
|---|---|
| **Tutear** (`tú`) ✅ decidido | Es lo habitual entre autónomos y pymes en España y transmite cercanía |
| **Concreto antes que bonito** | "Te respondo en 24 h" en vez de "Comprometidos con la excelencia" |
| **Primera persona del singular** | "Diseño", "te explico". Eres una persona, no una agencia: es una ventaja, no algo que esconder |
| **Sin tecnicismos para clientes** | "Que cargue rápido en el móvil" en vez de "Core Web Vitals". Los detalles técnicos van en el bloque "Para desarrolladores" de cada caso |
| **Solo datos reales** | Nada de "+50 clientes satisfechos" si no es verdad. Mejor pocas pruebas sólidas |
| **Tono de portfolio, no de venta** [F4] | Enseñar trabajo y forma de trabajar; sin llamadas a contratar ni "pide presupuesto" |
| **Prohibido** | "Soluciones digitales innovadoras", "Llevamos tu negocio al siguiente nivel", "Experiencias únicas", "Pasión por…", emojis en titulares |

---

## Datos de contacto (confirmados 2026-10-05)
| Canal | Valor | Uso en la web |
|---|---|---|
| Email | contacto@terryq.com | Pie, contacto, destino del formulario. Reenvía al buzón personal de Terry mediante Cloudflare Email Routing (activo desde 2026-10-06) |
| WhatsApp | +34 614 312 673 | Botón directo: `https://wa.me/34614312673?text=Hola%20Terry%2C%20vengo%20de%20tu%20web%20y%20quer%C3%ADa%20hablarte%20de%20` (abre el chat con "Hola Terry, vengo de tu web y quería hablarte de "). **[F5, 2026-10-07]** Sustituye a "…quería pedir presupuesto para ", en línea con el tono de portfolio y con la versión inglesa (UI43) |

---

## 1. Propuesta de valor

### Hero ✅ Actualizado 2026-10-06 (enfoque de portfolio, a petición de Terry)
**Presentación (pequeña, encima, junto al avatar):** Hola, soy Terry Quiñonez · Madrid
**Titular:** **<Desarrollador web>** (los signos `< >` en gris y peso normal, guiño al código; idea de Terry editando el wireframe)
**Subtítulo:** Diseño y construyo webs, PWAs y sistemas que da gusto usar. Me apasiona todo el recorrido, del primer boceto a la última línea de código, cuidando cada detalle para que se vean bien y funcionen todavía mejor.
> Sustituye al titular A ("Webs que hacen que tus clientes te escriban"), descartado por sonar a venta, y a "Diseño y construyo webs, PWAs y sistemas…", que pasa al subtítulo. Excepción consciente a la regla de no usar "pasión": la pidió Terry y va integrada en una frase concreta, no como eslogan.

### Fila de prueba
`● Proyectos en producción` · `Next.js · TypeScript · Supabase` · `Madrid · Remoto`

> ✅ Confirmado: respuesta en 24 h laborables.

### CTAs (actualizado 2026-10-06: enfoque sutil)
- Principal: **Ver trabajos**
- Secundarios: **GitHub ↗** · LinkedIn ↗
- Sin botones de "Pide tu presupuesto" en toda la web; WhatsApp como botón flotante.

### Descripción corta (para SEO, redes y tarjeta al compartir)
> Terry Quiñonez · Diseño y desarrollo web para autónomos y pequeñas empresas. Webs rápidas, claras y pensadas para conseguir contactos. Madrid y remoto en toda España.

---

## 2. Navegación y elementos comunes

**Menú:** Trabajos · Servicios · Sobre mí · GitHub ↗ · **Contacto** (botón) · selector `ES / EN` — [F4 · UI13] sin "Proceso"
**Logo:** "Terry Q." → siempre enlaza a `/`.
**Menú móvil** [F4 · UI37]: panel a pantalla completa con Trabajos · Servicios · Sobre mí · GitHub ↗, botón Contacto, `ES / EN` y LinkedIn ↗.

**Pie de página**
> **Terry Quiñonez** · Diseño y desarrollo web
> Quijorna, Madrid · Trabajo en remoto en toda España
> contacto@terryq.com · WhatsApp · LinkedIn · GitHub
> Aviso legal · Privacidad · © 2026
> *Esta web está hecha con Next.js y desplegada en Vercel. El código es público en GitHub.*

---

## 3. Página de inicio

### 3.1 Hero
Ver §1.

### 3.2 Trabajos destacados
**Título:** Trabajos recientes
**Entradilla:** Proyectos reales, en producción o como demo funcional. Puedes abrirlos y probarlos.

| Orden | Proyecto | Etiquetas | Línea de resumen |
|---|---|---|---|
| 1 | **HB Construcciones** | Web · Propuesta de identidad · ● Online | Web para una empresa de reformas y piscinas, pensada para recibir presupuestos por WhatsApp. |
| 2 | **Zona F** | Producto web · Demo | Prototipo de casa de apuestas deportivas con boleto, combinadas y cuotas en vivo. |
| 3 | **Finanzas Personales** | Aplicación web · ● Online | App para controlar ingresos, gastos, presupuestos y ahorro mes a mes. |

**Enlace:** Ver todos los trabajos →

### 3.3 Servicios (resumen)
**Título:** Qué puedo hacer por tu negocio

**Web: lo principal**
> Tu web diseñada y programada a medida: una landing para captar clientes, una web completa para tu empresa o una aplicación con funciones propias. Rápida en el móvil, fácil de encontrar en Google y preparada para que te contacten.

**También me encargo de…**
> **Tu imagen de marca:** logo y versiones para web, redes e impresión. **Mantenimiento y hosting:** tu web siempre online, actualizada y con alguien que responde si algo falla.

**Enlace:** Ver servicios →

### 3.4 Proceso (resumen)
> ~~Sección eliminada de la portada~~ [F4 · UI13]. El proceso completo está al final de /servicios (§6).

### 3.5 Reseñas (tras Trabajos destacados)
**Título:** Lo que dicen mis clientes
**Entradilla:** Opiniones reales, verificables en Google.
**Enlace:** Ver todas en Google ↗
> Tarjetas: HB (reseña en Google, dueño de HB), Finanzas Personales (reseña en Google, cuando el cliente haya recibido el servicio) y Zona F ("Opinión tras revisar la demo", de la empresa que la revisó, con su permiso).
> **Regla:** solo se publican reseñas reales. Sin reseñas, la sección no aparece. Las reseñas que aparecen en la web de HB son de clientes de HB y no se usan aquí.

### 3.6 Sobre mí (resumen) — [F4 · UI12]
> Soy Terry. Empecé aprendiendo por mi cuenta, atrapado por las interfaces limpias y bien hechas, con ganas de entender cómo se construían por dentro. Hoy estudio Ingeniería del Software en la Universidad Politécnica de Madrid y vivo en Quijorna, en la sierra oeste de Madrid.
> **Enlace:** Conóceme →

### 3.7 Cierre (discreto)
**Título:** ¿Hablamos?
**Texto:** Si te gusta lo que hago y tienes una idea en mente, escríbeme.
**Enlaces:** contacto@terryq.com · WhatsApp ↗

---

## 4. Página de trabajos (`/trabajos`)

**Título:** Trabajos
**Entradilla:** Webs para clientes, productos propios y propuestas de identidad. Cada proyecto explica el reto, cómo lo resolví y qué tecnología usé.
**Filtros:** Todo · Web · Marca
**Tabla** (filas compactas): Año · Proyecto · Tipo · Estado · →

| Año | Proyecto | Tipo | Estado |
|---|---|---|---|
| 2026 | HB Construcciones | Web para cliente · Propuesta de identidad | ● Online |
| 2026 | Zona F | Producto propio · Demo | ● Demo |
| 2026 | Finanzas Personales | Aplicación propia | ● Online |

---

## 5. Casos de estudio

> Estructura común: ficha lateral → reto → solución → piezas → resultado → bloque desplegable "Para desarrolladores".
> **Mi papel** (texto común a los tres, ver D-IA en Fase 0): *Dirección del proyecto, especificación, diseño, revisión y despliegue. Implementación asistida por IA (Claude Code).*

### 5.1 HB Construcciones

**Ficha**
| | |
|---|---|
| Cliente | HB Construcciones · Reformas integrales y piscinas |
| Ubicación | Villanueva de la Cañada (Madrid) |
| Servicios | Diseño y desarrollo web · Propuesta de identidad |
| Año | 2026 |
| Estado | ● Online · [hb-construcciones.vercel.app](https://hb-construcciones.vercel.app/) |

**Título:** Una web para que pedir presupuesto sea tan fácil como mandar un WhatsApp

**El reto**
> HB Construcciones hace reformas integrales, piscinas, cocinas, baños y ampliaciones en la zona oeste de Madrid. **No tenía web:** todos sus clientes llegaban por contactos y recomendaciones. Necesitaban salir del boca a boca con una web que transmitiera confianza a alguien que va a gastar miles de euros en su casa y que convirtiera esa confianza en una conversación.

**La solución**
> - **WhatsApp como canal principal.** Los clientes de reformas prefieren escribir a rellenar formularios, así que todos los botones llevan a WhatsApp, y el formulario abre la conversación con el mensaje ya preparado.
> - **Barra fija en el móvil** con "Llamar" y "WhatsApp", siempre a un toque.
> - **Respuestas antes de que pregunten.** Preguntas frecuentes sobre licencias de obra, plazos, presupuesto y garantía: las dudas que frenan a un cliente antes de escribir.
> - **Pruebas reales.** Galería de obras, vídeos grabados en la obra y reseñas de sus clientes.
> - **Pensada para buscar en local.** Contenido orientado a búsquedas de reformas y piscinas en su zona.

**Propuesta de identidad**
> Diseñé una propuesta de logo con un kit completo (color, negativo, monocromo e icono en vectorial). El cliente prefirió mantener su logo original, así que la web usa su identidad actual.
> *(Se muestra el kit de variantes.)*

**Resultado**
> HB pasa de depender solo del boca a boca a tener una web propia, online desde octubre de 2026. Es reciente, así que este caso se actualizará con resultados reales (consultas recibidas por WhatsApp) en cuanto haya datos.
> **Recomendación:** activar Vercel Analytics en la web de HB y medir los clics en WhatsApp y Llamar. En 1–2 meses tendrás una cifra real para este caso.
> `[Testimonio del dueño de HB, cuando lo tengas]`

**Para desarrolladores** (desplegable)
> - **Next.js (App Router) + React 19 + TypeScript.**
> - **Tailwind CSS 4**, **Framer Motion** para animaciones moderadas, iconos **Lucide** y tipografías **Geist** cargadas con `next/font`.
> - **Pipeline de medios propio:** scripts en Node/TypeScript que extraen fotogramas de los vídeos de obra y procesan galería y vídeos a **WebP** con `sharp`.
> - **SEO local:** datos estructurados **JSON-LD de LocalBusiness**, metadatos y `lang` configurados.
> - **Conversión:** botón flotante de WhatsApp, barra de contacto fija en móvil y formulario que construye el mensaje de WhatsApp con los datos del usuario.
> - **Medición:** Vercel Analytics.
> - **Vercel** con despliegue automático desde GitHub · ESLint.
> - **Desarrollo guiado por especificación** (`spec.md` + `tasks.md`).

---

### 5.2 Zona F

**Ficha**
| | |
|---|---|
| Tipo | Producto propio · Prototipo funcional |
| Servicios | Diseño de producto · Desarrollo web |
| Año | 2026 (diseñada y construida en 2 semanas) |
| Estado | ● Demo · [zona-f.vercel.app](https://zona-f.vercel.app/) |
| Aviso | Proyecto de demostración. No es una casa de apuestas real ni acepta dinero |

**Título:** Cómo sería una casa de apuestas pensada para el usuario

**El reto**
> Las casas de apuestas tienen interfaces saturadas: cientos de mercados, banners por todas partes y un boleto que cuesta entender. Me propuse diseñar y construir un prototipo que mantuviera todas las funciones de una casa real, pero ordenadas para que apostar sea claro y rápido.

**La solución**
> - **Boleto siempre visible** que calcula al instante la ganancia potencial, con importes rápidos (+10, +50, x2).
> - **Combinadas** con varias selecciones en el mismo boleto.
> - **Partidos en vivo** con minuto, marcador y cuotas 1X2 actualizadas.
> - **Ligas favoritas** por usuario y barra lateral de ligas con contador de partidos.
> - **Promociones** (bono de bienvenida, cashback, apuesta gratis, combinadas, VIP) en un carrusel.
> - **Cash Out:** cerrar una apuesta antes de que termine el partido.
> - **Juego responsable** con límites configurables, accesible desde el menú.
> - **Login** con correo y contraseña o con Google.
> - **Móvil primero:** en pantallas pequeñas el boleto pasa a un botón flotante.

**Resultado**
> Un producto completo y navegable que demuestra cómo resolver la experiencia de usuario de una aplicación compleja, con muchos estados y datos que cambian en tiempo real.

**Para desarrolladores** (desplegable)
> - **Next.js (App Router) + React 19**, renderizado en servidor con Server Components y operaciones con Server Actions.
> - **TypeScript estricto**, sin `any`. **Tailwind CSS v4** con los colores de marca como tokens.
> - **Zustand** para el estado del cliente (boleto, favoritos, filtros y cuotas en vivo); boleto y favoritos persisten en `localStorage`.
> - **Supabase (Postgres)**: las reglas de negocio viven en **funciones SQL** (apostar, combinadas, liquidar partidos, promociones, límites de juego responsable y Cash Out). Todo lo que mueve dinero se ejecuta en el servidor y los datos están protegidos con **RLS**.
> - **Supabase Auth** con `@supabase/ssr`: correo y contraseña, y Google OAuth; la sesión se refresca en cada petición.
> - **Simulación de partidos en vivo** con scripts propios: mover cuotas, liquidar partidos y cargar datos de demostración.
> - **Imágenes generadas con IA** (OpenAI) en un script aparte; la IA no interviene mientras la web funciona.
> - **Vercel** con despliegue automático en cada push a `main` · ESLint · `sharp`.
> - *Repositorio privado: se puede enseñar en una entrevista.*

> **Decisión de Terry (2026-10-05):** la demo de Zona F no se modifica. En el portfolio:
> - Las capturas se centran en la **interfaz** (boleto, partidos en vivo, barra lateral, versión móvil) y **no muestran el hero ni las promos** con jugadores reales.
> - Si se quiere una imagen principal para el caso, se crea **una nueva con jugadores ficticios** solo para el portfolio.
> - **D-ZF ✅ decidido por Terry (definitivo):** la demo pública **se enlaza**.

---

### 5.3 Finanzas Personales

**Ficha**
| | |
|---|---|
| Tipo | Aplicación propia |
| Servicios | Diseño y desarrollo · Base de datos y seguridad |
| Año | 2026 |
| Estado | ● Online · [finanzas-personales-roan.vercel.app](https://finanzas-personales-roan.vercel.app/) · Botón "Probar la demo" (cuando esté listo) |

**Título:** Mis finanzas, mes a mes, sin hojas de cálculo

**El reto**
> Quería saber, sin esfuerzo, cuánto entra y cuánto sale cada mes, cuánto puedo gastar el fin de semana sin romper mi objetivo de ahorro y cuándo me estoy pasando. Las hojas de cálculo se abandonan; necesitaba algo rápido de usar a diario.

**La solución**
> - **Registro mensual** de ingresos y gastos por categorías, con categorías marcadas como esenciales.
> - **Objetivo de ahorro** y cálculo de **cuánto puedes gastar cada fin de semana**.
> - **Presupuestos por categoría** con **alertas** al acercarte al límite.
> - **Movimientos recurrentes** (nómina, alquiler, suscripciones) que se registran solos.
> - **Varias monedas:** cada movimiento guarda el importe original, el tipo de cambio usado y el importe en tu moneda base.
> - **Tema claro y oscuro.**
> - **Modo demo:** cualquiera puede probarla en un clic con datos de ejemplo, sin registrarse.

**Resultado**
> La uso a diario para mis propias finanzas. Es el proyecto donde más he trabajado la seguridad y el modelado de datos.

**Para desarrolladores** (desplegable)
> Next.js (App Router) + TypeScript · Supabase (Postgres + Auth) · **Row Level Security** en todas las tablas: cada usuario solo accede a sus filas (`user_id = auth.uid()`) · borrado en cascada de los datos del usuario · conversión de moneda con histórico de tipos de cambio (`exchange_rate_snapshots`) y el tipo aplicado guardado en cada movimiento · **modo demo con usuarios anónimos de Supabase**: datos sembrados por un trigger, limpieza automática con `pg_cron` y registro con email bloqueado en el servidor con un *Before User Created Hook* · desplegada en Vercel.

---

## 6. Página de servicios (`/servicios`)

**Título:** Servicios
**Entradilla:** Me centro en lo que más impacto tiene en un negocio: una web que funcione. Si además necesitas imagen de marca o que alguien la mantenga, también me encargo.
**Índice "En esta página"** [F4 · UI22]: Web · Marca y mantenimiento · Preguntas frecuentes · Cómo trabajo · Cómo uso la IA

### Web (servicio principal)
**Texto:** Tu web diseñada y programada a medida: una landing para captar clientes, una web completa para tu empresa o una aplicación con funciones propias. Rápida en el móvil, fácil de encontrar en Google y preparada para que te contacten.

| Tipo | Para quién | Incluye | Ejemplo [F4 · UI24] |
|---|---|---|---|
| **Landing page** | Autónomos y negocios que quieren captar contactos rápido | Una página completa: servicios, trabajos, opiniones, preguntas frecuentes y contacto por WhatsApp o formulario | HB Construcciones → |
| **Web corporativa** | Empresas que necesitan varias secciones | Varias páginas, blog opcional y estructura pensada para Google | — |
| **Aplicación a medida** | Negocios con un proceso propio (reservas, paneles, gestión) | Usuarios, base de datos y funciones específicas | Finanzas Personales · Zona F → |

**Siempre incluido:** diseño a medida (nada de plantillas), adaptación a móvil, velocidad de carga, SEO básico, formulario o WhatsApp, textos legales base y una sesión para enseñarte a usarla.

### Marca
> Logo y kit de versiones (color, negativo, monocromo, icono) en vectorial, listo para web, redes e impresión. También banners y piezas para redes.
> **Ejemplo** [F4 · UI24]: kit de logo de HB → "Propuesta de identidad para HB Construcciones →"

### Mantenimiento y hosting
> Tu web alojada, con dominio, copias de seguridad, pequeños cambios y alguien que responde si algo falla. Se paga como plan mensual o anual, aparte del proyecto.
> ✅ Se ofrece en v1.

### Preguntas frecuentes
> [F4 · UI25] El antiguo bloque "Precio" (con su enlace "Escríbeme →") pasa a ser la primera pregunta, con el mismo texto.

- **¿Cuánto cuesta una web?** Cada proyecto es distinto, así que no trabajo con tarifas cerradas. Cuéntame tu idea y te paso un presupuesto a medida.
- **¿Cuánto se tarda en tener la web?** Una landing suele estar lista en 1–2 semanas desde que tengo tus textos y fotos. Una web más grande, según el alcance; te lo indico en el presupuesto.
- **¿Qué necesito darte?** Lo básico: qué haces, a quién y fotos de tu trabajo. Si no tienes textos, te ayudo a escribirlos.
- **¿La web será mía?** Sí. El dominio y el contenido son tuyos.
- **¿Puedo hacer cambios después?** Sí: puedes pedírmelos o tener un plan de mantenimiento.
- **¿Trabajas solo en Madrid?** Trabajo en remoto con negocios de toda España. Si estás cerca, también podemos vernos.
- **¿Usas inteligencia artificial?** Sí, como herramienta para trabajar más rápido. El diseño, las decisiones y la revisión de cada detalle son míos (enlace a "Cómo uso la IA", más abajo).

**Debajo del título de la sección:** ¿Tienes otra duda? Escríbeme.

### Cómo trabajo y Cómo uso la IA
Ver §7: en v2.1 forman parte del final de esta página.

### Cierre de la página [F4 · UI29]
Dos accesos: **Ver los trabajos** (`/trabajos`) · **Cuéntame tu idea** (`/contacto`).

---

## 7. Proceso e IA (al final de `/servicios`, secciones `#proceso` y `#ia`)

> [F4 · UI13] Ya no existe la página `/proceso`. Este contenido se muestra al final de /servicios.

### Cómo trabajo (`#proceso`)
**Entradilla:** Un proceso claro para que sepas en todo momento en qué punto está tu web y qué viene después.

| Paso | Qué pasa | Qué recibes |
|---|---|---|
| **1. Hablamos** | Me cuentas tu negocio, tus clientes y qué quieres conseguir | Preguntas concretas, no un formulario eterno |
| **2. Presupuesto cerrado** | Defino el alcance, el precio y los plazos | Un presupuesto en 24 h, sin letra pequeña |
| **3. Diseño** | Preparo la propuesta visual de las páginas | Ves cómo quedará antes de programar nada |
| **4. Desarrollo** | Construyo la web y te enseño avances | Un enlace de prueba para revisarla |
| **5. Lanzamiento** | La publicamos con tu dominio y revisamos que todo funcione | Tu web online, rápida y lista para recibir contactos |
| **6. Soporte** | Ajustes tras la entrega y mantenimiento si lo necesitas | Alguien que responde |

### Cómo uso la IA (`#ia`, para clientes y empresas)
> Trabajo con un método llamado **desarrollo guiado por especificaciones**: antes de escribir una línea de código, dejo por escrito qué debe hacer la web, cómo y con qué criterios de calidad. Después uso herramientas de IA como Claude Code para programar más rápido, y reviso, pruebo y corrijo cada parte antes de publicarla.
>
> **Para ti significa** entregas más rápidas sin renunciar al control de calidad.
> **Si eres una empresa:** el código de esta web es público. Puedes ver la especificación, las tareas y las decisiones técnicas en el repositorio.
> **Botón:** Ver el repositorio ↗

**Panel "Del papel a producción"** [F4 · UI28]
| Paso | Pieza | Texto | Quién |
|---|---|---|---|
| 01 Especificación | `spec.md` | Qué debe hacer la web, cómo y con qué criterios de calidad. | Yo |
| 02 Tareas | `tasks.md` | El trabajo dividido en tareas, en orden y revisables. | Yo |
| 03 Implementación | Claude Code | La IA programa cada tarea siguiendo la especificación. | IA |
| 04 Revisión | — | Reviso, pruebo y corrijo cada parte antes de publicarla. | Yo |

**Pie del panel:** Las decisiones y la revisión final son siempre mías.

---

## 8. Página "Sobre mí" (`/sobre-mi`)

**Título:** Hola, soy Terry
> `[DATO: foto]` — retrato ilustrado a partir de una foto real (DS10).

**Texto:**
> Soy Terry Quiñonez, desarrollador web. Empecé aprendiendo por mi cuenta con vídeos de YouTube: me atrapaban las interfaces bien hechas, limpias y minimalistas, y quería entender cómo se construían por dentro.
>
> Empecé la carrera en Perú y, con buena parte hecha, vine a España para terminarla: hoy estudio Ingeniería del Software en la Universidad Politécnica de Madrid, con parte de mis estudios convalidados. Vivo en Quijorna, en la sierra oeste de Madrid.
>
> Muchas webs se lo ponen difícil a la gente: menús confusos, formularios eternos, información que no se encuentra. Yo busco lo contrario: **webs que cualquiera entiende a la primera.** Me tomo cada proyecto como propio y no lo doy por terminado hasta que todo funciona bien. Soy constante: cuando me propongo algo, lo saco adelante.

**Frase destacada** [F4 · UI30]: `<Webs que cualquiera entiende a la primera>` (etiqueta: "Lo que busco"). Etiqueta del segundo párrafo: "De Perú a Madrid".

**Datos rápidos** (ficha fija)
| | |
|---|---|
| Ubicación | Quijorna, Madrid · Remoto en toda España |
| Formación | Ingeniería del Software · UPM (en curso) |
| Idiomas | Español (nativo) · Inglés (básico, en aprendizaje) |
| Tecnologías | Next.js · TypeScript · React · Supabase · Tailwind CSS · Vercel |

**Para empresas** (bloque aparte, al final) [F4 · UI31, texto final de Terry, 2026-10-07]
> Tengo las cualidades y las habilidades para aportar desde el primer día y ser un gran colaborador en vuestro equipo. Os invito a conocer [mis proyectos](/trabajos).
> **Botones:** Descargar CV · LinkedIn ↗ · GitHub ↗
> Tono: breve y seguro, sin pedir ni insistir.

---

## 9. Página de contacto (`/contacto`)

**Título:** Hablemos de tu proyecto
**Entradilla** [F4 · UI33]: Cuéntame qué tienes en mente y te respondo en 24 h laborables. Si lo prefieres, escríbeme directamente por WhatsApp.
> Sustituye a "Cuéntame qué necesitas y te respondo en 24 h con un presupuesto cerrado…" (tono de portfolio).

**Formulario**
| Campo | Tipo | Obligatorio |
|---|---|---|
| Nombre | texto | Sí |
| Email o teléfono | texto | Sí |
| ¿Qué necesitas? | Web nueva · Rediseñar mi web · Logo e identidad · **Propuesta de trabajo** [F4 · UI33] · Otra cosa | Sí |
| Web actual, si tienes | URL | No (se marca "Opcional") |
| Cuéntame tu proyecto | texto largo | Sí |
| He leído la política de privacidad | casilla | Sí (RGPD) |

**Nota sobre el formulario:** Todos los campos son obligatorios salvo el opcional.
**Textos de ayuda (placeholder):** Tu nombre · tu@email.com o 600 000 000 · https:// · Qué haces, qué necesitas y para cuándo, más o menos.
**Botón:** Enviar mensaje · mientras se envía: Enviando…

**Validación** [F4 · UI35]
- Resumen: **Faltan datos para poder enviarlo.** Revisa el campo marcado abajo. / Revisa los N campos marcados abajo.
- Nombre: Escribe tu nombre.
- Email o teléfono: Necesito un email o un teléfono para responderte. · Formato incorrecto: Revisa el formato: un email (tu@email.com) o un teléfono.
- ¿Qué necesitas?: Elige una opción.
- Mensaje: Cuéntame un poco de tu proyecto.
- Privacidad: Acepta la política de privacidad para poder enviarlo.

**Éxito:** Mensaje enviado · **¡Recibido!** Te escribo en menos de 24 h. Si es urgente, escríbeme por WhatsApp. · Botones: Escribir por WhatsApp ↗ · Enviar otro mensaje · Enlace: Mientras tanto, puedes ver mis trabajos →
**Error:** **No se ha podido enviar.** Inténtalo de nuevo o escríbeme a contacto@terryq.com. (Se conservan los datos escritos.)

**Otros canales:** WhatsApp (+34 614 312 673) · Email (contacto@terryq.com) · LinkedIn · Respondo en 24 h laborables · Quijorna, Madrid · Remoto en toda España

---

## 10. Página 404

**Título:** Esta página no existe
**Texto:** Puede que el enlace esté mal o que la página se haya movido.
**Botones:** Volver al inicio · Ver trabajos
**Extra** [F4 · UI36]: la ruta pedida en mono (`/ruta → 404`) y "O ve directamente a": Trabajos · Servicios · Sobre mí · Contacto.

---

## 11. SEO por página

| Página | `<title>` | Meta descripción |
|---|---|---|
| Inicio | Terry Quiñonez · Diseño y desarrollo web en Madrid | Webs rápidas y claras para autónomos y pequeñas empresas, pensadas para conseguir contactos. Presupuesto cerrado en 24 h. |
| Trabajos | Trabajos · Terry Quiñonez | Webs para clientes y productos propios: HB Construcciones, Zona F y Finanzas Personales. |
| Servicios | Servicios de diseño web · Terry Quiñonez | Landing pages, webs corporativas, aplicaciones a medida, logos y mantenimiento web. Cómo trabajo y cómo uso la IA. |
| Sobre mí | Sobre mí · Terry Quiñonez | Desarrollador web y estudiante de Ingeniería del Software en la UPM. Quijorna, Madrid. |
| Contacto | Contacto · Terry Quiñonez | Cuéntame tu proyecto o tu propuesta y te respondo en 24 h laborables. |
| 404 | Página no encontrada · Terry Quiñonez | — (`noindex`) |

> [F4 · UI13] Se quita la fila "Proceso": la página ya no existe.

---

## 12. Pendiente de Terry

**Textos en español aprobados (2026-10-06); cambios de la Fase 4 aprobados con la Ronda 3 (2026-10-07).** Versión en inglés en `docs/01b-content-en.md`, actualizada a la v2.1 en la Ronda 4 (v2).

**Decisiones cerradas (2026-10-05):** tutear · mantenimiento y hosting en v1 · respuesta en 24 h laborables.

**Datos**
1. Resultado del modo demo de Finanzas (para el caso de estudio; no bloquea).
2. Foto y CV (pueden llegar más tarde; no bloquean).
