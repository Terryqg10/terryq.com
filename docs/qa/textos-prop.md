# Textos [prop] para aprobar (T38)

Son los textos que propuso el spec porque no estaban en F1, en 01b ni en los artboards (spec §0.1 regla 3, §21 P6). **Ya están implementados tal como aparecen aquí.** Para cada uno: marca ✅ si te vale, o escribe el texto que prefieres. Los cambios los aplico yo en este mismo PR.

Qué significa cada columna: **ES** y **EN** son los textos tal como están ahora en la web. «Dónde se ve» dice si un visitante lo lee o solo lo oye un lector de pantalla.

## A. Etiquetas que solo oye un lector de pantalla

| # | Clave | ES | EN | Dónde se ve | OK |
|---|---|---|---|---|---|
| 1 | `common.menu.dialogLabel` | Menú principal | Main menu | Nombre del menú móvil abierto | [ ] |
| 2 | `common.external` | (sitio externo) | (external site) | Texto oculto detrás de cada enlace con ↗ | [ ] |
| 3 | `home.reviews.regionLabel` | Opiniones de clientes, desliza para ver más | Client reviews, swipe to see more | Nombre del carrusel de reseñas (hoy no se muestra: no hay reseñas) | [ ] |
| 4 | `work.filters.label` | Filtrar por tipo | Filter by type | Nombre del grupo de filtros de Trabajos | [ ] |
| 5 | `work.listLabel` | Lista de proyectos | Project list | Nombre de la lista en móvil | [ ] |
| 6 | `work.tableLabel` | Tabla de proyectos | Project table | Nombre de la tabla en escritorio | [ ] |
| 7 | `work.live` | {n} proyectos (singular: 1 proyecto) | {n} projects (1 project) | Anuncio al cambiar el filtro | [ ] |
| 8 | `case.factsLabel` | Ficha del proyecto | Project facts | Nombre de la ficha del caso | [ ] |
| 9 | `case.testimonial` | Testimonio del cliente | Client testimonial | Nombre del bloque de testimonio | [ ] |
| 10 | `contact.formLabel` | Formulario de contacto | Contact form | Nombre del formulario | [ ] |
| 11 | `services.also.ariaLabel` | Marca, mantenimiento y hosting | Brand, maintenance and hosting | Nombre de la sección «También me encargo de» | [ ] |

## B. Textos que sí se leen en pantalla

| # | Clave | ES | EN | Dónde se ve | OK |
|---|---|---|---|---|---|
| 12 | `case.translated` y `home.reviews.translated` | (traducido) | (translated) | Junto a un testimonio en otro idioma (hoy sin uso: no hay testimonios) | [ ] |
| 13 | `case.pieces.hb` | Galería de obras · escritorio · Barra fija · móvil | Work gallery · desktop · Sticky bar · mobile | Pies de las piezas del caso de HB | [ ] |
| 14 | `services.web.typesLabel` | Tipos de web | Website types | Título de la tabla de tipos en Servicios | [ ] |
| 15 | `services.also.label` | También me encargo de | I can also take care of | Etiqueta sobre las tarjetas Marca y Mantenimiento | [ ] |
| 16 | `services.process.youGet` | Recibes · | You get · | Prefijo de «lo que recibes» en «Cómo trabajo» (móvil) | [ ] |
| 17 | `services.explore.label` | Sigue explorando | Keep exploring | Etiqueta del cierre de Servicios (los otros dos textos son del 01b) | [ ] |
| 18 | `about.photoCaption` | Retrato ilustrado a partir de una foto real. | Illustrated portrait based on a real photo. | Pie del retrato en Sobre mí | [ ] |
| 19 | `about.storyLabel` | Mi historia | My story | Etiqueta de la sección de Sobre mí | [ ] |
| 20 | `contact.destination` | Llega a contacto@terryq.com | Goes to contacto@terryq.com | Aviso bajo el botón de enviar | [ ] |
| 21 | `contact.errors.website.format` | Revisa la dirección de tu web. | Check your website address. | Error del campo «Tu web» si la URL no vale | [ ] |

## C. Etiquetas de «Para desarrolladores» en los casos

Las de HB salen del artboard; las de Zona F y Finanzas las propuso el spec.

| # | Caso | ES | EN | OK |
|---|---|---|---|---|
| 22 | HB (EN, el ES es del artboard) | Base · Interfaz · Medios · SEO local · Conversión · Despliegue · Método | Stack · Interface · Media · Local SEO · Conversion · Deployment · Method | [ ] |
| 23 | Zona F | Base · Lenguaje y estilos · Estado · Datos y reglas · Autenticación · Simulación · Imágenes · Despliegue · Código | Stack · Language and styles · State · Data and rules · Authentication · Simulation · Images · Deployment · Code | [ ] |
| 24 | Finanzas Personales | Base · Seguridad · Datos · Moneda · Modo demo · Despliegue | Stack · Security · Data · Currency · Demo mode · Deployment | [ ] |

## D. Anclas de URL en inglés (solo EN)

| # | Sección | ES | EN propuesto | OK |
|---|---|---|---|---|
| 25 | Servicios: Web | `/servicios#web` | `/en/services#websites` | [ ] |
| 26 | Servicios: Marca y mantenimiento | `/servicios#marca` | `/en/services#brand` | [ ] |

## Cómo contestar
Basta con responder, por ejemplo: «todo OK salvo el 7 → …, el 18 → …». Si no cambias nada, lo dejo como está.
