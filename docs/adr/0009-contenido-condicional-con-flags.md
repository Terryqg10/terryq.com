# ADR-0009 · Contenido condicional con flags

## Contexto
Parte del contenido aún no existe o no puede inventarse: reseñas, testimonios, demos, CV, ilustración y retrato. No pueden publicarse enlaces muertos ni marcadores (spec §9.6).

## Decisión
- Cada pieza opcional (`reviews`, `site.googleReviewsUrl`, `meta.testimonial`, `meta.demoUrl`, `site.cv[locale]`, `site.avatar`, `site.portrait`) se pinta solo si existe; si es `null` o está vacía, el elemento desaparece o se sustituye por el monograma TQ, sin dejar huecos.
- Prohibido publicar «Ejemplo», «Pendiente», «[Nombre…]», «CV en PDF · pendiente de subir» y cualquier reseña o testimonio que no sea real.
- Un test e2e busca esas cadenas en el HTML generado y falla si aparecen (spec §17.3).

## Alternativas
- Publicar con «Próximamente» o marcadores: descartada. Da imagen de obra inacabada y arriesga dejar texto provisional en producción.

## Consecuencias
- Rellenar un dato real basta para que aparezca su sección, sin tocar componentes.
- Los componentes deben contemplar siempre el caso vacío y tener tests para él.

## Estado
Aceptado (2026-10-07)
