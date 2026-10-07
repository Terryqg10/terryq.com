# tasks.md — terryq.com

> **Estado:** v1.0 · 2026-10-07 · Deriva de `docs/spec.md` v1.2 (aprobado).
> **Cómo se usa:** Claude Code hace **una tarea por rama y por PR** (`t-XX-descripcion`), en orden. Antes de empezar una tarea lee las secciones del spec que cita. Al terminar, marca la casilla `[x]` en este archivo dentro del mismo PR y espera la revisión de Terry en el preview de Vercel.
> **Si algo no está en el spec o en las fuentes de §0.1, para y pregunta.** No se inventa copy, ni datos, ni enlaces.

## Reglas comunes a todas las tareas
1. Se cumple la **definición de terminado** (spec §17.5): CA de la tarea + tests + CI en verde + sin `any` ni `@ts-ignore` + revisión de Terry.
2. Cada tarea toca **solo** los archivos de su alcance. Si descubre un cambio necesario fuera de él, lo anota en el PR como tarea nueva, sin hacerlo.
3. Todo el texto visible sale de `messages/*.json` o del MDX, nunca escrito en el JSX.
4. Si una decisión del spec cambia, se actualizan el spec y el ADR en el mismo PR.
5. Commits con Conventional Commits; *squash merge* a `main`.

## Hitos
| Hito | Tareas | Resultado |
|---|---|---|
| **M0 · Base** | T00–T05 | Repo público, calidad, CI, previews en Vercel y ADRs |
| **M1 · Sistema** | T06–T11 | Tokens, i18n, fuentes, datos, contenido y primitivas |
| **M2 · Estructura** | T12–T16 | Cabecera, pie, menú móvil, WhatsApp, analítica y movimiento |
| **M3 · Páginas** | T17–T24 | Inicio, Trabajos, casos, Servicios y Sobre mí |
| **M4 · Contacto, 404 y legal** | T25–T29 | Formulario completo, 404 traducida y textos legales |
| **M5 · SEO, seguridad y calidad** | T30–T38 | Metadata, JSON-LD, OG, sitemap, cabeceras, capturas finales, QA y rendimiento |
| **M6 · Lanzamiento** | T39–T42 | Email real, dominio, firewall y lanzamiento |

## Antes de empezar (lo prepara Terry)
- [ ] `gh auth login` en su equipo con la cuenta **Terryqg10**.
- [ ] Cuenta de **Vercel** (plan Hobby) con sesión iniciada con la cuenta de GitHub Terryqg10.
- [ ] Cuenta de **Resend** creada (la API key se pide en T39).
- [ ] Acceso al **DNS de Cloudflare** de terryq.com (se usa en T39 y T40).
- [ ] El **kit** (`terryq-kit/`) descomprimido en una carpeta accesible para Claude Code.

---

## M0 · Base

### T00 · Crear el proyecto y el repositorio
- **Spec:** §3, §4.3, §16.4, §18.1 · **Depende de:** —
- **Hacer:**
  - `pnpm create next-app@latest terryq.com` con TypeScript, ESLint, Tailwind, App Router, `src/`, alias `@/*` y Turbopack. **Quitar Cache Components** del `next.config.ts` generado (ADR-008).
  - Fijar Node 24 (`.nvmrc`, `engines`) y pnpm (`packageManager`).
  - Copiar el kit: `docs/` (planning, design), `design/tokens.json` y `src/assets/brand/`. Las imágenes de los proyectos de `src/content/work/**` y `docs/spec.md` + `docs/tasks.md`, tal cual.
  - `LICENSE` MIT. `README.md` mínimo: qué es, stack, cómo arrancar, enlace al spec y la nota de §16.4 sobre el contenido.
  - `.env.example` con las variables de §10.6 y `.gitignore` con `.env*` (salvo `.env.example`).
  - Borrar el contenido de ejemplo de `create-next-app` (página, SVG de `public/`).
  - `gh repo create Terryqg10/terryq.com --public --source . --push` con descripción «Portfolio de Terry Quiñonez · Next.js + TypeScript · Spec-driven».
- **CA:** `pnpm dev` y `pnpm build` funcionan · el repo es público y tiene la estructura de §4.3 (carpetas vacías con `.gitkeep` donde aún no hay código) · no se ha subido ningún secreto.

### T01 · TypeScript, lint y formato
- **Spec:** §17.1, §4.4 · **Depende de:** T00
- **Hacer:** las opciones de `tsconfig` de §17.1 · ESLint flat config con las reglas en `error` y `no-restricted-imports` para las reglas de §4.4 · Prettier + `prettier-plugin-tailwindcss` · scripts `typecheck`, `lint`, `format`, `format:check`.
- **CA:** `pnpm typecheck && pnpm lint && pnpm format:check` pasan · un import de `features/a` desde `features/b` da error (se comprueba con un archivo temporal que **no** se sube).

### T02 · Tests: Vitest y Playwright
- **Spec:** §17.3 · **Depende de:** T01
- **Hacer:** `vitest.config.ts` (entorno node, alias `@`) · `playwright.config.ts` con los proyectos `desktop-chromium`, `mobile-chromium` y `mobile-webkit`, `webServer` = `pnpm build && pnpm start` y `CONTACT_TRANSPORT=mock` · `@axe-core/playwright` instalado · helper `tests/e2e/utils.ts` (lista de rutas por idioma, función `axeCheck`) · un test unitario y uno de e2e de humo.
- **CA:** `pnpm test` y `pnpm e2e` pasan en local.

### T03 · CI, plantilla de PR y protección de `main`
- **Spec:** §17.2, §17.4, §16.3 · **Depende de:** T02
- **Hacer:** `.github/workflows/ci.yml` con los pasos de §17.4 (los que aún no existen, como `tokens` o `lhci`, se añaden en sus tareas) · `.github/pull_request_template.md` · `.github/dependabot.yml` (npm y actions, semanal) · `pnpm audit --audit-level=high` · protección de `main` con `gh api` (CI obligatoria, sin push directo, squash).
- **CA:** un PR de prueba muestra la CI y no se puede hacer merge con la CI en rojo.

### T04 · Conectar Vercel (previews)
- **Spec:** §18.2 · **Depende de:** T03
- **Hacer:** importar el repo en la cuenta de Vercel (plan Hobby; Next.js, Node 24) · variables de entorno de §10.6 con `CONTACT_TRANSPORT=mock` en preview por ahora · activar Web Analytics y Speed Insights · **todavía sin dominio**.
- **CA:** cada PR tiene su URL de preview · `main` despliega en la URL `*.vercel.app` de producción · `robots` de preview bloquea la indexación (se completa en T33; mientras tanto, Vercel ya marca los previews con `noindex`).

### T05 · ADRs
- **Spec:** §19 · **Depende de:** T00
- **Hacer:** `docs/adr/0000-plantilla.md` (Contexto · Decisión · Alternativas · Consecuencias · Estado) y los 10 ADRs de §19, con su motivo tal como lo explica el spec. ADR-0007 incluye cómo configurar la regla del Firewall (§10.5) y ADR-0008 enlaza el issue de next-intl.
- **CA:** 10 archivos, cada uno con una decisión, su alternativa descartada y su estado «Aceptado (2026-10-07)».

---

## M1 · Sistema

### T06 · Tokens y estilos base
- **Spec:** §6.1, §6.2, §6.3 (utilidades), §6.5, §6.6 (regla de movimiento reducido) · **Depende de:** T02
- **Hacer:** `scripts/build-tokens.ts` (`pnpm tokens`) → `src/styles/tokens.css` · `globals.css` con `@theme` (paleta de Tailwind borrada), los mapeos de §6.1, las utilidades de texto del DS, las 13 utilidades `type-*` de §6.3, el foco global · regla global de `prefers-reduced-motion` · paso de CI `pnpm tokens && git diff --exit-code`.
- **Tests:** unitario del generador (incluye los 16 colores, el bloque dark y las 3 sombras; los valores coinciden con `tokens.json`).
- **CA:** `bg-paper text-ink` funcionan y `bg-blue-500` no genera CSS · en modo oscuro del sistema cambian todos los colores.

### T07 · i18n y rutas
- **Spec:** §5 entero, §4.1 · **Depende de:** T06
- **Hacer:** `src/i18n/routing.ts` (locales, `as-needed`, `localeDetection: false`, `localeCookie: false`, `pathnames` de §5.2) · `request.ts` y `navigation.ts` según la guía de next-intl para Next ≥16.3 · `src/proxy.ts` · `app/[locale]/layout.tsx` con `<html lang>`, `generateStaticParams`, `dynamicParams = false` y `dynamic = 'error'` · `messages/es.json` y `en.json` con el espacio `common` · tipado de mensajes (`AppConfig`) · páginas vacías de todas las rutas de §5.2 con su `h1` desde `messages` (se sustituyen en M3).
- **Tests:** unitarios de paridad de `messages` y de que cada ruta interna tiene ES y EN · e2e: `/servicios` y `/en/services` dan 200, `/es/servicios` redirige con 308 a `/servicios`, y ninguna respuesta lleva `Set-Cookie`.
- **CA:** `pnpm build` genera todas las rutas como estáticas (en el resumen del build, ninguna ruta es dinámica salvo la de contacto cuando exista).

### T08 · Fuentes, metadatos del viewport e iconos
- **Spec:** §6.3 (fuentes), §6.4, §6.7 · **Depende de:** T07
- **Hacer:** `next/font/google` para las 3 familias (variables `--font-bricolage`, `--font-instrument`, `--font-jetbrains`) en el layout · `viewport.themeColor` claro/oscuro · `app/icon.svg` (favicon del kit), `app/apple-icon.png` (del kit) y `scripts/build-icons.ts` → `app/favicon.ico` (16/32/48).
- **CA:** sin peticiones a `fonts.googleapis.com` en el navegador (se comprueba en e2e con `page.on('request')`) · CLS de las fuentes = 0 en Lighthouse · el favicon cambia de tinta con el tema.

### T09 · Datos del sitio y entorno
- **Spec:** §9.3, §10.6 · **Depende de:** T07
- **Hacer:** `src/lib/site.ts` con `SiteConfig` tipado y los valores de §9.3 · `whatsappHref(locale)` · `src/lib/env.ts` con zod y `server-only` (incluida la prohibición de `CONTACT_TRANSPORT=mock` en producción) · `src/lib/cn.ts`.
- **Tests:** `whatsappHref` genera exactamente los enlaces de F1 v2.2 y 01b (comparación de cadenas) · `env` falla si falta una variable.

### T10 · Modelo de contenido y MDX
- **Spec:** §9.1, §9.2, §9.5, §9.6 · **Depende de:** T09
- **Hacer:** `src/content/types.ts` (§9.1) · `content/work/index.ts` con los helpers · `meta.ts` de los 3 trabajos con los datos **literales** de F1 §3.2/§4/§5 y 01b §3–§5 (alt de cada imagen en los dos idiomas, usando las capturas provisionales del kit) · `reviews.ts` vacío · `@next/mdx` + `src/mdx-components.tsx` · `features/work/mdx-components.tsx` con `CaseSection`, `SolutionItem`, `SolutionMedia`, `BrandKit` y `DevItem` **solo con su semántica** (el estilo va en T21) · los 6 MDX (`es.mdx`, `en.mdx` × 3) con la narrativa literal de F1 §5 / 01b §5 y las etiquetas de `DevItem` de §9.4.2.
- **Tests:** `tests/unit/content.test.ts` (§9.2): MDX en los dos idiomas, `alt` no vacíos, `https://`, slugs únicos y numeración de secciones (HB 01–05; Zona F y Finanzas 01–04).
- **CA:** ningún texto inventado: cada frase del MDX aparece en F1 o 01b.

### T11 · Primitivas de UI
- **Spec:** §7.1, §6.5 · **Depende de:** T06, T08
- **Hacer:** `Container`, `Button`, `TextLink`, `SectionLabel`, `CodeHeadline`, `StatusBadge`, `Tag`, `Card`, `BrowserFrame`, `PhoneFrame`, `TextField`, `TextArea`, `RadioPills` y `Checkbox`, con los contratos de §7.1 y las medidas de los artboards · página de revisión `app/[locale]/(dev)/ui/page.tsx` que enseña todas las variantes y **llama a `notFound()` cuando `VERCEL_ENV === 'production'`** (solo sirve para que Terry la revise en el preview; no se enlaza desde ningún sitio).
- **Tests:** e2e con axe sobre la página de revisión (claro y oscuro) en el entorno de test.
- **CA:** el tipo de `Button` impide pasar `href` y `type` a la vez · la página de revisión coincide con los componentes del DS (Terry la revisa).

---

## M2 · Estructura

### T12 · Cabecera, pie, enlace de salto y selector de idioma
- **Spec:** §7.2 (Header, Footer, SkipLink, LanguageSwitch), §5.4, §6.7 (Logo) · **Depende de:** T11
- **Hacer:** `Logo` (SVG en línea con `currentColor`, 40px), `Header` de escritorio con `aria-current`, `SkipLink`, `Footer` (versión de escritorio y móvil de los artboards) y `LanguageSwitch` (isla) · todo en el layout · textos en `messages.common`.
- **Tests:** e2e: el logo lleva a la portada del idioma, el selector lleva a la ruta equivalente en todas las rutas de §5.2 (incluidos los 3 casos), el primer Tab enfoca el enlace de salto y los enlaces del pie miden ≥44px de alto.

### T13 · Menú móvil
- **Spec:** §7.2 (MobileMenu), §13 A7 · **Depende de:** T12
- **Hacer:** botón de menú por debajo de `lg` y `MobileMenu` con `<dialog>` + `showModal()` y todo el comportamiento de §7.2.
- **Tests:** `mobile-menu.spec.ts` (§17.3).

### T14 · WhatsApp flotante y analítica
- **Spec:** §7.2 (WhatsAppFab), §14 · **Depende de:** T12
- **Hacer:** `WhatsAppFab` · `<Analytics />` y `<SpeedInsights />` en el layout (sin eventos personalizados, §14).
- **Tests:** e2e: el botón aparece en todas las páginas con el `href` del idioma · no hay llamadas a `track()` en el código (búsqueda en CI).

### T15 · Movimiento: apariciones
- **Spec:** §6.6 (apariciones), CA-G9 · **Depende de:** T11
- **Hacer:** isla `Reveal` (un IntersectionObserver para toda la página) y las clases CSS de `data-reveal` · documentar en el componente cómo marcar secciones.
- **Tests:** `motion.spec.ts`: sin JS todo es visible; con `reducedMotion: 'reduce'` no hay transformaciones; lo que está en pantalla al cargar no se anima.

### T16 · Comprobación de enlaces y marcadores (base del rastreo)
- **Spec:** §17.3 (`crawl.spec.ts`), §9.6, §15.3 · **Depende de:** T12
- **Hacer:** `crawl.spec.ts` que recorre todo desde `/` y `/en`: 200 en los enlaces internos, formato válido de `mailto:`, `wa.me` y externos, ausencia de los textos prohibidos de §9.6 y sin `Set-Cookie`. A partir de aquí, **cada página nueva queda cubierta automáticamente**.
- **CA:** el test pasa con las páginas vacías de T07.

---

## M3 · Páginas

### T17 · Inicio: hero
- **Spec:** §8.1 (fila 1), §6.6 (titular, captura), CA-1.1, CA-1.2 · **Depende de:** T11, T15
- **Hacer:** `features/home/Hero` (presentación con la alternativa del avatar de §9.6, `CodeHeadline` en dos líneas con la animación CSS, subtítulo, CTAs y fila de prueba) e isla `HeroShowcase` (inclinación con el ratón + aplanado con `animation-timeline`).
- **Tests:** e2e: O1 en 1440×900 y 390×844 (h1, subtítulo, CTA y fila de prueba dentro del viewport) · axe.

### T18 · Inicio: resto de secciones
- **Spec:** §8.1 (filas 2–6), CA-1.3, CA-1.4 · **Depende de:** T17, T10
- **Hacer:** `FeaturedProjects` (toda la tarjeta es un enlace), `Reviews` (condicional, con su carrusel), `ServicesSummary`, `AboutTeaser` (con la alternativa del monograma) y `Closing` · Inicio en EN.
- **Tests:** e2e: sin reseñas no hay sección `/opiniones` ni hueco · con una reseña de prueba (fixture solo de test) la sección aparece y el carrusel es enfocable.

### T19 · Trabajos
- **Spec:** §8.2 entero · **Depende de:** T18
- **Hacer:** cabecera, filtros, tabla desde `md`, **filas apiladas por debajo de `md`** (decisión P2), vista previa flotante (isla `WorkTableClient`), pista y bloque de GitHub.
- **Tests:** `work.spec.ts` (§17.3) + CA-2.1, CA-2.2, CA-2.3.

### T20 · Caso de estudio: plantilla
- **Spec:** §8.3 entero, §9.2 · **Depende de:** T10, T19
- **Hacer:** `app/[locale]/work/[slug]` con `generateStaticParams` (3 × 2), cabecera, imagen principal, `CaseFacts` (sticky desde `lg`), los estilos de los componentes del MDX, `BrandKit` con los 4 SVG, el desplegable «Para desarrolladores» cerrado y `NextProject` circular.
- **Tests:** `case.spec.ts` (§17.3) + CA-3.1 a CA-3.4.

### T21 · Transición de la fila al caso
- **Spec:** §6.6 (abrir un caso), ADR-005 · **Depende de:** T20
- **Hacer:** `<ViewTransition name="work-<slug>">` en la miniatura de la fila, en la imagen de la tarjeta de Inicio y en la imagen del caso. Si Next 16.4 pide `experimental.viewTransition`, se activa **solo** si el build y los tests pasan; si no, se cierra la tarea sin el efecto y se anota en ADR-005.
- **CA:** con movimiento reducido no hay animación · ningún test existente se rompe.

### T22 · Servicios
- **Spec:** §8.4 entero, §5.3 · **Depende de:** T18
- **Hacer:** las 7 secciones de §8.4 con sus anclas desde `messages`, el índice (chips con scroll en móvil), la tabla de tipos con los ejemplos enlazados, las preguntas con `<details>` (la primera abierta), el proceso, el panel de la IA y «Sigue explorando».
- **Tests:** e2e: CA-4.1 (cada ancla visible bajo la cabecera) y CA-4.2 (ningún botón `primary`).

### T23 · Sobre mí
- **Spec:** §8.5 entero, §9.6 (retrato y CV) · **Depende de:** T18
- **Hacer:** cabecera con el retrato (alternativa del monograma mientras `site.portrait` sea `null`), «Mi historia» con la ficha fija y la frase destacada, y «Para empresas» con el CV condicional.
- **Tests:** e2e: CA-5.1 · con un CV de prueba (fixture de test) aparece el botón con `download`.

### T24 · Revisión de M3 con Terry
- **Spec:** §17.3 (revisión visual) · **Depende de:** T17–T23
- **Hacer:** job de CI que genera capturas de todas las páginas hechas a 390 y 1440 en claro y oscuro y las sube como artefacto · lista de diferencias con los artboards para que Terry decida.
- **CA:** Terry aprueba o crea tareas de corrección (T24a, T24b…).

---

## M4 · Contacto, 404 y legal

### T25 · Formulario: esquema
- **Spec:** §10.1 · **Depende de:** T09
- **Hacer:** `features/contact/schema.ts` (zod) con los tipos `ContactField`, `ContactErrorCode` y `ContactValues`, la normalización del teléfono y de la URL, y los mensajes de error en `messages` (`contact.errors.*`).
- **Tests:** unitarios de cada regla de §10.1 (al menos 25 casos: emails válidos e inválidos, teléfonos `600 000 000`, `+34 600 000 000`, `(+44) 20 7946 0958`, cadenas con espacios, URL sin protocolo…).

### T26 · Formulario: Server Action y envío
- **Spec:** §10.2, §10.4, §10.5 (capas 1 y 2), §10.6 · **Depende de:** T25
- **Hacer:** `action.ts`, `transport.ts` (resend + mock), `email.ts` (texto plano + HTML escapado) y el antispam (campo trampa + tiempo mínimo).
- **Tests:** unitarios de la acción con el transporte mock: inválido → códigos y valores; trampa → éxito sin envío; `[[fail]]` → error con valores; éxito → mensaje en el mock con `Reply-To` correcto.

### T27 · Formulario: página de contacto
- **Spec:** §8.6, §10.3, §13 A8 · **Depende de:** T26, T12
- **Hacer:** la página con sus dos columnas y su orden en móvil, y la isla `ContactForm` con `useActionState`, los 5 estados de §10.3, la gestión del foco, `startedAt` al montar, y «Enviar otro mensaje».
- **Tests:** `contact.spec.ts` completo (§17.3), **incluido el envío sin JavaScript**.

### T28 · Página 404
- **Spec:** §8.7, §4.1 (404 traducida) · **Depende de:** T12
- **Hacer:** `[locale]/not-found.tsx`, la captura de rutas desconocidas según next-intl y la isla `RequestedPath`.
- **Tests:** `not-found.spec.ts` (CA-7.1).

### T29 · Aviso legal y privacidad
- **Spec:** §8.8, §15 · **Depende de:** T12
- **Hacer:** la plantilla legal y los 4 MDX (`es` y `en` × 2), redactados a partir de §15. En la PR, una tabla con el mecanismo de transferencia de cada proveedor (Vercel, Resend, Cloudflare, Google), **con el enlace a la fuente oficial de cada uno** (su DPA o su certificación del Data Privacy Framework).
- **CA:** **Terry revisa y aprueba los textos** antes del merge (no es asesoramiento legal) · la casilla del formulario enlaza a la política del idioma.

---

## M5 · SEO, seguridad y calidad

### T30 · Metadata
- **Spec:** §11.1, §5.5, CA-G8 · **Depende de:** T27
- **Hacer:** `lib/seo.ts` con `buildMetadata` y `generateMetadata` en todas las páginas (títulos y descripciones de F1 §11 / 01b §11; los casos según §11.1) y `metadataBase`.
- **Tests:** unitarios de canonical y alternates · e2e: cada página tiene su `<title>`, `description`, `link rel=alternate` (es, en, x-default) y canonical absoluta.

### T31 · Datos estructurados
- **Spec:** §11.2 · **Depende de:** T30
- **Hacer:** JSON-LD de `Person` y `ProfessionalService` en el layout, y de `CreativeWork` + `BreadcrumbList` en los casos.
- **Tests:** e2e: el JSON es válido y tiene los campos de §11.2 · sin `aggregateRating`.

### T32 · Imágenes Open Graph
- **Spec:** §11.3 · **Depende de:** T30
- **Hacer:** fuentes `.ttf` en `src/assets/og-fonts/` (con su licencia OFL), una plantilla común y `opengraph-image.tsx` por página y por caso.
- **CA:** las imágenes se generan en el build (1200×630) · Terry revisa 3 de muestra.

### T33 · Sitemap y robots
- **Spec:** §11.4 · **Depende de:** T30
- **Hacer:** `sitemap.ts` con alternates y `robots.ts` según `VERCEL_ENV`.
- **Tests:** e2e: el sitemap contiene las páginas indexables × 2 y ninguna 404 ni la página de revisión de UI.

### T34 · Cabeceras de seguridad
- **Spec:** §16.1, §16.2 · **Depende de:** T27
- **Hacer:** `headers()` en `next.config.ts` (solo en producción) con la CSP y el resto de cabeceras.
- **Tests:** e2e contra `next start`: las cabeceras están presentes · sin errores de CSP en la consola en ninguna página (incluidas las analíticas y la View Transition).

### T35 · Capturas definitivas
- **Spec:** §9.5 · **Depende de:** T20
- **Hacer:** `scripts/capture-screenshots.ts` (`pnpm screenshots`) con los encuadres de F4 §Capturas a 2x · Zona F **solo con la interfaz** (sin hero ni promociones) · Finanzas en modo demo · sustituir las provisionales y actualizar los `alt` si el encuadre cambia.
- **CA:** **Terry revisa cada captura** en el PR (se adjuntan) · ninguna muestra jugadores, escudos ni patrocinadores reales.

### T36 · Accesibilidad y objetivos táctiles (suite completa)
- **Spec:** §13, §17.3 (`a11y.spec.ts`, `targets.spec.ts`, `navigation.spec.ts`) · **Depende de:** T27, T28, T29
- **Hacer:** completar las specs de §17.3 que falten para todas las páginas, idiomas y temas.
- **CA:** 0 infracciones de axe · todos los controles ≥44px en 390px.

### T37 · Rendimiento
- **Spec:** §12 · **Depende de:** T35
- **Hacer:** `lighthouserc.json` con las URLs y presupuestos de §12.1 · script de tamaño de JS por ruta · paso `pnpm lhci` en CI · revisión con el Bundle Analyzer de Turbopack y ajuste de `sizes` y `priority`.
- **CA:** todos los presupuestos de §12.1 en verde en CI.

### T38 · QA de idioma y QA manual
- **Spec:** §21 (P6), §13 (A11, A13), §0.1 regla 3 · **Depende de:** T36, T37
- **Hacer:** lista de todos los textos **[prop]** en el PR para que Terry los apruebe o los cambie, y aplicar sus cambios · guion de prueba manual (VoiceOver y NVDA en Inicio, un caso y Contacto; zoom al 200%; reflow a 320px) y anotar los resultados en el PR.
- **CA:** Terry aprueba los textos · los resultados de la prueba manual quedan sin bloqueos.

---

## M6 · Lanzamiento

### T39 · Email real con Resend
- **Spec:** §10.4, §18.4 · **Depende de:** T27
- **Hacer:** verificar `envios.terryq.com` en Resend (Terry añade los registros en Cloudflare, guiado paso a paso) · `_dmarc` con `p=none` si no existe · `RESEND_API_KEY` y `CONTACT_TRANSPORT=resend` en preview y producción · envío de prueba desde el preview en ES y EN.
- **CA:** los dos emails llegan a la bandeja de entrada de Terry (no a spam), con `Reply-To` correcto · los registros de Email Routing no se han tocado.

### T40 · Dominio
- **Spec:** §18.3 · **Depende de:** T38
- **Hacer:** `terryq.com` en producción y `www` con 308 en Vercel · registros en Cloudflare en modo **DNS only**.
- **CA:** `https://terryq.com` sirve la web con HTTPS · `www` redirige · `/es/...` redirige a la ruta sin prefijo.

### T41 · Firewall
- **Spec:** §10.5 (capa 2), ADR-0007 · **Depende de:** T40
- **Hacer:** la regla de límite en modo **Log** · recordatorio en el PR para pasarla a **Deny/429** al cabo de una semana (tarea T41b).
- **CA:** la regla aparece en el panel del Firewall con la ruta y el método correctos.

### T42 · Lanzamiento (F7)
- **Spec:** §18.6, §22 · **Depende de:** T39–T41
- **Hacer:** la lista de §18.6: Search Console y sitemap, resultados enriquecidos, inspector de LinkedIn, Lighthouse en producción, securityheaders.com y envío real del formulario en ES y EN · README final (qué es, cómo está hecho, enlaces al spec, tareas y ADRs) · actualizar el estado de este archivo y del spec a «v1 publicada».
- **CA:** se cumplen los 7 puntos de la definición de terminado de v1 (§22).

---

## Fuera de esta lista (cuando lleguen los datos de Terry)
Cada uno es un PR pequeño que **solo cambia datos**, no código: avatar (`site.avatar`), retrato (`site.portrait`), CV (`site.cv` + PDF en `public/cv/`), reseñas reales (`reviews.ts` + `site.googleReviewsUrl`), testimonio de HB (`meta.testimonial`) y demo de Finanzas (`meta.demoUrl`).
