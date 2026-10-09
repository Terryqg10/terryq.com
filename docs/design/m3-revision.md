# Revisión visual de M3 (T24)

Las capturas salen del job `capturas` de CI (artefacto `capturas-m3`, abrir `index.html`) o en local con `pnpm capture:pages`. Cada ruta se captura a 390 y 1440 px, en claro y oscuro, junto al artboard que le corresponde.

**Alcance de esta lista:** comparación a mano de las páginas de escritorio en claro (Inicio, Trabajos, caso HB, Servicios, Sobre mí). Móvil, oscuro y EN están en las capturas pero **no** se han revisado una a una: es lo que tiene que mirar Terry. Los artboards solo existen en claro (salvo Inicio) y no hay artboard de Zona F ni de Finanzas.

## Diferencias que son esperadas (flags de spec §9.6, no son fallos)
- Inicio: no aparece «Lo que dicen mis clientes» (reseñas ocultas hasta que haya reseñas reales).
- Caso HB: no aparece el bloque de testimonio.
- Sobre mí: no aparece «Descargar CV» ni la nota «CV pendiente de subir».

## Diferencias que necesitan decisión de Terry
| # | Página | Artboard | Implementación | Propuesta |
|---|--------|----------|----------------|-----------|
| 1 | Todas (escritorio) | Contenido a 80 px de margen (contenedor de 1280) | Contenido a 120 px de margen (contenedor de 1200) | Confirmar cuál manda; si es el artboard, ajustar el contenedor |
| 2 | Inicio (hero) | Chip con avatar junto a «Hola, soy Terry» | Sin avatar | Depende de la foto/retrato (pendiente) |
| 3 | Inicio y Sobre mí | Retrato ilustrado provisional (silueta) con etiqueta «Pendiente de foto» y pie «Retrato ilustrado a partir de una foto real» | Logo TQ sobre fondo liso, sin etiqueta ni pie | Decidir si se muestra la silueta provisional o el logo hasta tener el retrato |
| 4 | Inicio y Servicios | Iconos en las tarjetas «Tu imagen de marca» y «Mantenimiento y hosting», y `</>` en la tarjeta Web | Sin iconos | Añadir iconos (T24a) |
| 5 | Servicios | «Siempre incluido» en 3 columnas | 2 columnas | Ajustar la rejilla (T24a) |
| 6 | Servicios | FAQ con iconos `+` / `×` | Chevrones | Unificar con el artboard (T24a) |
| 7 | Servicios | Etiquetas «Yo» / «IA» como píldoras | Texto con punto, sin píldora | Ajustar (T24a) |
| 8 | Caso HB | «Para desarrolladores» abierto | Cerrado | Comprobar qué dice el spec; el artboard puede estar mostrando el estado abierto |
| 9 | Caso HB | Móvil de la galería sobre fondo beige | Sin fondo | Ajustar (T24a) |
| 10 | Trabajos | Artboard con plantillas sin rellenar (`{{p.name}}`) | Tabla real | Sin comparación posible; revisar a ojo |

## Nota técnica
Las imágenes `display:none` (p. ej. el móvil del hero a 390 px) no cargan nunca; el script de captura las ignora. No es un bug de la web.

## CA de T24
Terry aprueba o crea las tareas de corrección (T24a, T24b…). Hasta entonces M3 no se da por cerrada.
