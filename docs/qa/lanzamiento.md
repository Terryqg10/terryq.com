# Lanzamiento de v1 (T42 · spec §18.6 y §22)

Resultados medidos el 2026-10-11 y 2026-10-12 sobre <https://terryq.com>. Lo marcado con ⏳ lo hace Terry en sus cuentas.

## Comprobaciones en producción

| Punto | Resultado | Estado |
|---|---|---|
| Dominio y HTTPS | `https://terryq.com` sirve la web; `www` redirige con 308 al raíz; `/es/...` redirige con 308 a la ruta sin prefijo; `http` redirige a `https` | ✅ |
| Cabeceras (securityheaders.com) | Nota **A** (limitada a A por `'unsafe-inline'` en `script-src`, necesario para los scripts de Next) | ✅ |
| Lighthouse (14 URLs, mediana de 3 ejecuciones, perfil móvil) | Rendimiento 95–97 · accesibilidad 100 · SEO 100 · buenas prácticas 96–100 · CLS ≤0,04 · TBT 33–76 ms · LCP 2,6–2,9 s | ✅ (LCP dentro del umbral de ADR-0011; objetivo original 2,0 s) |
| Sitemap y robots | `sitemap.xml` con 20 URLs y hreflang; `robots.txt` permite indexar y apunta al sitemap | ✅ |
| JSON-LD | `Person` y `ProfessionalService` en todas las páginas; `CreativeWork` y `BreadcrumbList` en los casos | ✅ |
| Open Graph | `og:url`, `og:title` y `og:image` con `https://terryq.com`; imagen PNG 1200×630 | ✅ |
| Formulario en producción | Probado en ES y EN; los correos llegan a Recibidos de `contacto@terryq.com`, con `Reply-To` del visitante | ✅ |
| Firewall | Regla de límite en modo Log (T41); pasar a Deny el 2026-10-18 (T41b) | ✅ |
| Search Console y envío del sitemap | Propiedad de dominio `terryq.com` verificada con el TXT `google-site-verification` (autorizado desde Cloudflare); sitemap `https://terryq.com/sitemap.xml` enviado el 2026-10-12 | ✅ |
| Inspector de publicaciones de LinkedIn | `https://terryq.com`: tarjeta con la imagen Open Graph y el título «Terry Quiñonez · Diseño y desarrollo web en Madrid»; URL canónica `https://terryq.com` | ✅ |
| Prueba de resultados enriquecidos de Google | | ⏳ (opcional) |
| Prueba manual con lector de pantalla y zoom (T38) | | ⏳ |

## Conocido y aceptado
- **Buenas prácticas 96 en Contacto:** Chrome registra un aviso de política CSP en el panel de problemas (no hay errores en la consola y el formulario funciona). Es un candidato de mejora, no un bloqueo.
- **LCP 2,6–2,9 s** frente al objetivo de 2,0 s: ver ADR-0011.

## Definición de terminado de v1 (§22)
1. Páginas de §8 en ES y EN con sus CA: ✅
2. CI en verde en `main` con los presupuestos (ADR-0011) y 0 infracciones de axe: ✅
3. Revisión manual (lector de pantalla, zoom al 200 %) y capturas aprobadas: ⏳ capturas aprobadas; falta la prueba con lector de pantalla
4. Formulario probado en producción en ES y EN: ✅
5. Dominio, `www`, HTTPS, cabeceras A, sitemap enviado y OG correctos en LinkedIn: ✅
6. Ningún marcador ni dato inventado; textos legales revisados por Terry: ✅
7. Repositorio con README, spec, tasks y ADRs al día: ✅ (este PR)
