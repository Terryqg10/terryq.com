# spec.md — terryq.com (portfolio de Terry Quiñonez)

> **Estado:** v1.2 — **APROBADO por Terry** (2026-10-07). Preguntas P1–P5 resueltas (§21). v1.2: Vercel en plan Hobby y analítica sin eventos personalizados (§14, §18).
> **Fase:** F5 — Paquete de implementación. Las tareas están en `docs/tasks.md`.
> **Destino:** `docs/spec.md` en el repositorio `Terryqg10/terryq.com` (público).
> **Método:** desarrollo guiado por especificación. Claude Code implementa **tarea a tarea** desde `tasks.md`, y cada tarea cita las secciones de este documento que aplica (§).

---

## 0. Cómo usar este documento

### 0.1 Fuentes y orden de prioridad
Cuando dos fuentes no coinciden, gana la **más específica para ese tema**:

| Tema | Fuente de verdad | En el repo |
|---|---|---|
| Decisiones técnicas, rutas, datos y comportamiento | **Este spec** | `docs/spec.md` |
| Texto en español (todo el copy) | F1 Contenido v2.2 | `docs/planning/01-contenido-es.md` |
| Texto en inglés | 01b Content EN v2 | `docs/planning/01b-content-en.md` |
| Comportamiento de UI y accesibilidad (UI1–UI44) | F4 UI alta fidelidad | `docs/planning/04-ui-alta-fidelidad.md` |
| Aspecto, medidas y composición | Artboards del lienzo (HTML con estilos en línea) | `docs/design/artboards/*.html` |
| Color, tipo, espacio, radios, sombras | `tokens.json` del Design System | `design/tokens.json` |
| Marca, movimiento, iconografía y voz | README del Design System | `docs/design/design-system/README.md` |

Reglas para Claude Code:
1. **No reinterpretar.** Si algo no está en ninguna fuente o las fuentes chocan y este spec no lo resuelve, **para y pregunta a Terry**. No inventes copy, datos, cifras ni enlaces.
2. Los artboards son la referencia de **medidas exactas** (px, columnas, separaciones). Este spec solo repite una medida cuando hace falta para no equivocarse.
3. Los textos marcados **[prop]** (o **[EN-prop]** si solo afecta al inglés) los propone este spec porque no estaban en F1, en 01b ni en los artboards. Terry aún no los ha revisado. Se implementan así y se revisan en la tarea de QA de idioma (§21, P6).
4. Los artboards contienen marcadores de diseño que **nunca** se publican: reseñas con la etiqueta «Ejemplo», «Pendiente de foto», «CV en PDF · pendiente de subir», «avatar ilustrado · pendiente» y el testimonio de HB. Su comportamiento real está en §9.6.

### 0.2 Glosario
- **Isla cliente:** componente con `'use client'`. El resto son Server Components.
- **Flag de contenido:** dato de `site.ts` o de `meta.ts` que, si es `null`, oculta el elemento que depende de él (§9.6).
- **Ruta interna / ruta pública:** las carpetas de `app/` usan nombres internos en inglés; las URL públicas están traducidas (§5).

---

## 1. Contexto y objetivos

Portfolio bilingüe (ES principal, EN secundario) de un desarrollador web. **Público 1:** autónomos y pymes que buscan quien les haga la web. **Público 2:** empresas que buscan contratar a un desarrollador. Tono de portfolio, no de venta: se enseña trabajo real y la forma de trabajar (F1 §0).

| # | Objetivo (F0) | Cómo lo comprueba este spec |
|---|---|---|
| O1 | Entender en <10 s qué hace y para quién | Hero sin scroll en 1440×900 y 390×844: titular, subtítulo, CTA y fila de prueba visibles (§8.1) |
| O2 | Confianza | Trabajos reales con enlace, proceso explicado, solo datos reales (§9.6) |
| O3 | Contactos | Formulario funcional y WhatsApp en todas las páginas (§10). Visitas medidas con Vercel Web Analytics (§14) |
| O4 | Criterio técnico visible | Bloques «Para desarrolladores», repo público con spec, tareas y ADRs (§19) |
| O5 | El sitio demuestra calidad | Lighthouse móvil: rendimiento ≥95 y 100 en accesibilidad, buenas prácticas y SEO. WCAG 2.2 AA (§12, §13) |
| O6 | Mantenimiento sin esfuerzo | Añadir un trabajo = 1 carpeta (`meta.ts` + `es.mdx` + `en.mdx` + imágenes) y 1 línea en el índice (§9.2) |

---

## 2. Alcance

### 2.1 Dentro de v1
Páginas (ES y EN): Inicio, Trabajos, 3 casos (HB Construcciones, Zona F, Finanzas Personales), Servicios (con proceso e IA), Sobre mí, Contacto, Aviso legal, Privacidad y 404. Tema claro y oscuro según el sistema. Formulario con envío por email. Botón flotante de WhatsApp. SEO completo (metadata, OG, sitemap, robots, JSON-LD, hreflang). Analítica sin cookies. CI con tests, accesibilidad y Lighthouse. Despliegue en Vercel con terryq.com.

### 2.2 Fuera de v1
Blog (D9), línea Contenido/vídeo, selector manual de tema, CMS o base de datos, email de confirmación al remitente (ADR-006), página /cookies (no hay cookies, §15.3), avatar animado con ojos que siguen al cursor (espera la ilustración), redirección desde terryquinonez.com (dominio no registrado).

---

## 3. Stack y versiones

Comprobado el 2026-10-07. En la tarea T0 se instalan las **últimas versiones de parche** de estas líneas y se fijan en el lockfile.

| Pieza | Versión | Notas |
|---|---|---|
| Node.js | 24 LTS | `engines` en `package.json` y `.nvmrc` |
| pnpm | última estable | `packageManager` en `package.json` (Corepack) |
| Next.js | **16.4.x** (publicada el 2026-10-06) | App Router, Turbopack. **Cache Components desactivado** (ADR-008). Si 16.4 da un problema que bloquea el build, se baja a 16.3.x y se anota en el ADR |
| React | 19.3 (la que trae Next 16.4) | View Transitions estables (§6.6) |
| TypeScript | 5.x estricto | §17.1 |
| Tailwind CSS | **4.3.x** + `@tailwindcss/postcss` | Configuración en CSS (`@theme`), sin `tailwind.config.js` |
| next-intl | **4.14.x** | Compatible con Next 16. El middleware va en `src/proxy.ts` (nombre del archivo desde Next 16) |
| @next/mdx + @mdx-js/loader + @mdx-js/react | últimas | Sin frontmatter: los metadatos van en `meta.ts` (ADR-002) |
| zod | 4.x | Validación del formulario y de las variables de entorno |
| resend | último SDK | Envío del formulario |
| @vercel/analytics, @vercel/speed-insights | últimas | Sin cookies |
| lucide-react | última | Iconos de trazo 1.75 |
| clsx | última | Unir clases. No se usa `tailwind-merge` |
| Desarrollo | eslint + eslint-config-next, prettier + prettier-plugin-tailwindcss, vitest, @playwright/test, @axe-core/playwright, @lhci/cli, tsx, sharp, png-to-ico | — |

**No se instalan:** Framer Motion/Motion, next-themes, librerías de componentes (shadcn, Radix, etc.), CSS-in-JS ni librerías de formularios. Cada dependencia que no esté en esta tabla necesita un ADR.

---

## 4. Arquitectura

### 4.1 Modelo de render
- **Todo estático.** Cada página se genera en el build para `es` y `en` (`generateStaticParams`), con `dynamicParams = false` y `export const dynamic = 'error'` en el layout de `[locale]`. Si algo intenta leer cookies o cabeceras en una página, **el build falla**, y es justo lo que queremos.
- **Lo único dinámico** es la Server Action del formulario (`features/contact/action.ts`), que se ejecuta con un POST sobre la página de contacto.
- **Cache Components:** desactivado (ADR-008). Hay que borrar el ajuste que añade `create-next-app` 16.4.
- **404 traducida:** se implementa siguiendo la guía de next-intl para `not-found` con `[locale]` (segmento `[...rest]` o la variante que recomiende la versión instalada), de forma compatible con `dynamicParams = false`. Lo que manda es el CA-7.1 y su test (§17.3): estado 404, idioma de la URL y `noindex`.

### 4.2 Islas cliente (lista cerrada)
Solo estos componentes llevan `'use client'`. Para añadir otro hace falta justificarlo en la tarea.

| Isla | Motivo | Peso orientativo |
|---|---|---|
| `MobileMenu` | `<dialog>`, estado abierto/cerrado, bloqueo del scroll | <2 KB |
| `LanguageSwitch` | Ruta equivalente en el otro idioma (`usePathname` de next-intl) | <1 KB |
| `WorkFilters` + `WorkRowPreview` (`WorkTableClient`) | Filtro con `aria-pressed` y vista previa que sigue al cursor | <3 KB |
| `HeroShowcase` | Inclinación 3D que sigue al ratón | <1,5 KB |
| `Reveal` | Un único IntersectionObserver para las apariciones (§6.6) | <1 KB |
| `ContactForm` | `useActionState`, validación en cliente y gestión del foco | <6 KB + zod |
| `RequestedPath` | Muestra la ruta pedida en la 404 | <0,5 KB |

### 4.3 Carpetas

```
terryq.com/
├─ docs/
│  ├─ spec.md                      Este documento
│  ├─ tasks.md                     Tareas atómicas (F5, segunda entrega)
│  ├─ adr/0001-….md … 0010-….md    Decisiones (§19)
│  ├─ planning/                    F1, 01b, F3 y F4 copiados tal cual, solo lectura (F0 no se publica, §16.3)
│  └─ design/
│     ├─ artboards/*.html          16 artboards del lienzo + assets/
│     └─ design-system/            README del DS + README de cada componente
├─ design/tokens.json              Copia exacta del DS. Solo se cambia si cambia el DS
├─ messages/es.json · en.json      Todo el copy de interfaz y de páginas (§9.4)
├─ scripts/
│  ├─ build-tokens.ts              tokens.json → src/styles/tokens.css (§6.1)
│  ├─ build-icons.ts               favicon.svg → favicon.ico + apple-icon.png (§6.7)
│  └─ capture-screenshots.ts       Capturas 2x de los proyectos con Playwright (§9.5)
├─ tests/
│  ├─ unit/                        Vitest
│  └─ e2e/                         Playwright + axe
├─ public/
│  └─ cv/                          PDFs del CV cuando existan (§9.6)
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx             <html lang>, fuentes, Header, Footer, SkipLink, WhatsAppFab, Reveal, Analytics
│  │  │  ├─ page.tsx               Inicio
│  │  │  ├─ work/page.tsx          /trabajos · /en/work
│  │  │  ├─ work/[slug]/page.tsx   Caso de estudio
│  │  │  ├─ services/page.tsx      /servicios · /en/services
│  │  │  ├─ about/page.tsx         /sobre-mi · /en/about
│  │  │  ├─ contact/page.tsx       /contacto · /en/contact
│  │  │  ├─ legal-notice/page.tsx  /aviso-legal · /en/legal-notice
│  │  │  ├─ privacy/page.tsx       /privacidad · /en/privacy
│  │  │  ├─ [...rest]/page.tsx     Llama a notFound() → 404 traducida
│  │  │  ├─ not-found.tsx
│  │  │  └─ opengraph-image.tsx    (y uno por página que lo necesite, §11.3)
│  │  ├─ layout.tsx · not-found.tsx  Los mínimos que pida next-intl para URLs fuera de [locale]
│  │  ├─ sitemap.ts · robots.ts
│  │  └─ icon.svg · favicon.ico · apple-icon.png
│  ├─ components/
│  │  ├─ ui/                       Primitivas del DS (§7.1)
│  │  └─ layout/                   Header, MobileMenu, Footer, LanguageSwitch, SkipLink, WhatsAppFab, Logo
│  ├─ features/
│  │  ├─ home/                     Hero, HeroShowcase, FeaturedProjects, Reviews, ServicesSummary, AboutTeaser, Closing
│  │  ├─ work/                     WorkTable, WorkTableClient, CaseHeader, CaseFacts, CaseSection, BrandKit, NextProject, mdx-components.tsx
│  │  ├─ services/                 ServicesHeader, WebOffer, AlsoBlock, Faq, Process, AiPanel, ExploreMore
│  │  ├─ about/                    AboutHero, Story, QuickFacts, ForCompanies
│  │  ├─ contact/                  ContactForm, schema.ts, action.ts, email.ts, transport.ts, OtherChannels
│  │  └─ not-found/                NotFoundView, RequestedPath
│  ├─ content/
│  │  ├─ types.ts                  Tipos del contenido (§9.1)
│  │  ├─ work/index.ts             Orden de los trabajos
│  │  ├─ work/<slug>/              meta.ts · es.mdx · en.mdx · images/
│  │  ├─ reviews.ts                Reseñas reales. Vacío en v1
│  │  └─ legal/<es|en>/            legal-notice.mdx · privacy.mdx
│  ├─ i18n/                        routing.ts · request.ts · navigation.ts
│  ├─ lib/
│  │  ├─ site.ts                   Datos y flags del sitio (§9.3)
│  │  ├─ env.ts                    Variables de entorno validadas con zod (solo servidor)
│  │  ├─ seo.ts                    Constructores de metadata y JSON-LD
│  │  └─ cn.ts                     clsx
│  ├─ styles/
│  │  ├─ tokens.css                GENERADO. No se edita a mano
│  │  └─ globals.css               @import tailwind + @theme + utilidades del DS
│  ├─ mdx-components.tsx           Lo pide @next/mdx
│  └─ proxy.ts                     Middleware de next-intl
├─ .github/workflows/ci.yml
├─ next.config.ts · postcss.config.mjs · tsconfig.json · eslint.config.mjs · .prettierrc
├─ playwright.config.ts · vitest.config.ts · lighthouserc.json
├─ LICENSE · README.md · .env.example · .nvmrc
```

### 4.4 Reglas de dependencia
1. `app/` solo contiene routing, `generateMetadata`, `generateStaticParams` y la composición de `features/`. No hay estilos ni lógica en las páginas.
2. `features/X` puede importar de `components/`, `content/`, `lib/` e `i18n/`, pero **nunca** de otro `features/Y`. Lo que compartan dos features sube a `components/`.
3. `components/` no importa de `features/` ni de `content/`: recibe los datos por props.
4. `content/` solo contiene datos, tipos y MDX. No tiene componentes, salvo los que se usan dentro del MDX, que viven en `features/work/mdx-components.tsx`.
5. Lo que use secretos importa `'server-only'` (`lib/env.ts`, `features/contact/action.ts`, `transport.ts`, `email.ts`).
6. Se exporta con nombre, salvo donde Next exige `default` (páginas, layouts, `opengraph-image`, `sitemap`, `robots`).

---

## 5. Rutas e internacionalización

### 5.1 Configuración (ADR-001)
- `locales: ['es', 'en']`, `defaultLocale: 'es'`, `localePrefix: 'as-needed'`: el español va sin prefijo y el inglés con `/en`.
- `localeDetection: false`: no se redirige según `Accept-Language`. Cada URL siempre sirve el mismo idioma, lo que es mejor para el SEO y no necesita cookie.
- `localeCookie: false`: next-intl no pone ninguna cookie.
- `pathnames` traducidos (tabla 5.2). Las carpetas usan la ruta interna.
- Las peticiones a `/es/...` redirigen con 308 a la ruta sin prefijo (comportamiento por defecto de `as-needed`).
- Para el render estático se sigue la guía oficial de next-intl para **Next ≥16.3** (`next/root-params`). Solo se usa `setRequestLocale` si esa guía lo pide para nuestro caso.

### 5.2 Mapa de rutas

| Ruta interna | ES (pública) | EN (pública) | Etiqueta de sección (UI1, mono) |
|---|---|---|---|
| `/` | `/` | `/en` | — |
| `/work` | `/trabajos` | `/en/work` | `/trabajos` · `/work` |
| `/work/[slug]` | `/trabajos/[slug]` | `/en/work/[slug]` | `/trabajos/hb-construcciones` · `/work/hb-construcciones` |
| `/services` | `/servicios` | `/en/services` | `/servicios` · `/services` |
| `/about` | `/sobre-mi` | `/en/about` | `/sobre-mi` · `/about` |
| `/contact` | `/contacto` | `/en/contact` | `/contacto` · `/contact` |
| `/legal-notice` | `/aviso-legal` | `/en/legal-notice` | — |
| `/privacy` | `/privacidad` | `/en/privacy` | — |

**Slugs de casos** (iguales en los dos idiomas, porque son nombres propios): `hb-construcciones`, `zona-f`, `finanzas-personales`.

**Etiquetas que no son páginas:** la sección de reseñas de Inicio lleva `/opiniones` (ES) y `/reviews` (EN), como en el lienzo.

### 5.3 Anclas internas (UI26: `#` para secciones)

| Página | ES | EN |
|---|---|---|
| Servicios: Web | `#web` | `#websites` [EN-prop] |
| Servicios: Marca y mantenimiento | `#marca` | `#brand` [EN-prop] |
| Servicios: Preguntas | `#preguntas` | `#faq` |
| Servicios: Cómo trabajo | `#proceso` | `#process` |
| Servicios: Cómo uso la IA | `#ia` | `#ai` |
| Sobre mí: Para empresas | `#para-empresas` | `#for-companies` |

- Los ids salen de `messages/*.json`, no se escriben a mano en el JSX.
- Cada sección con ancla lleva `scroll-margin-top: 96px` (cabecera fija + aire).

### 5.4 Selector de idioma (UI42)
- El texto visible es `ES / EN`, con el idioma actual en `ink` y el otro en `ink-muted`. Es un enlace que lleva a la **ruta equivalente** en el otro idioma, conservando el `slug`. No conserva el ancla.
- Nombre accesible: «ES / EN: cambiar idioma a inglés» (en ES) y «ES / EN: switch language to Spanish» (en EN). Lleva `hreflang` y `lang` del idioma de destino.
- En la 404 lleva a la portada del otro idioma.

### 5.5 SEO multilingüe
- `<html lang="es">` o `lang="en"` según la página.
- En cada página: `alternates.canonical` (URL absoluta propia) y `alternates.languages` con `es`, `en` y `x-default` (que apunta a la versión ES).
- Las páginas legales EN llevan una nota visible de que la versión española es la que prevalece (01b §12).

---

## 6. Estilos: tokens, tipografía, tema y movimiento

### 6.1 De `tokens.json` a Tailwind (ADR-003)
1. `scripts/build-tokens.ts` lee `design/tokens.json` y genera `src/styles/tokens.css`:
   - En `:root`, cada color, sombra y medida de layout como `--tq-<nombre>`, con el valor **light**.
   - En `@media (prefers-color-scheme: dark) { :root { … } }`, los valores **dark**.
   - `:root { color-scheme: light dark; }`.
   - Una cabecera `/* GENERADO por scripts/build-tokens.ts — no editar */`.
2. `pnpm tokens` ejecuta el script. CI lo ejecuta y falla si `tokens.css` cambia (`git diff --exit-code`): así el CSS nunca se separa del DS.
3. `globals.css`:
   ```css
   @import "tailwindcss";
   @import "./tokens.css";
   @theme {
     --color-*: initial;          /* se borra la paleta de Tailwind: solo existen los colores del DS */
     --font-*: initial;
   }
   @theme inline {
     --color-paper: var(--tq-paper);   /* … los 16 colores con su mismo nombre */
     --shadow-sm: var(--tq-shadow-sm); --shadow-md: var(--tq-shadow-md); --shadow-float: var(--tq-shadow-float);
     --font-display: var(--font-bricolage), "Instrument Sans", system-ui, sans-serif;
     --font-sans: var(--font-instrument), system-ui, -apple-system, "Segoe UI", sans-serif;
     --font-mono: var(--font-jetbrains), ui-monospace, "SF Mono", Menlo, monospace;
     --container-content: 1280px; --container-text: 640px;
     --ease-tq: cubic-bezier(0.22, 1, 0.36, 1);
   }
   ```
   Así existen `bg-paper`, `text-ink-muted`, `border-line-strong`, `shadow-float`, `max-w-content`, `max-w-text`, `ease-tq`…

### 6.2 Correspondencia DS → Tailwind (sin cambiar los valores por defecto de Tailwind)

| DS | Valor | Clase de Tailwind |
|---|---|---|
| `space-1 … space-24` | N × 4px | `p-1 … p-24`, `gap-*`, `m-*` (la escala de Tailwind ya es de 4px) |
| `radius-sm` | 8px | `rounded-lg` |
| `radius-md` | 12px | `rounded-xl` |
| `radius-lg` | 16px | `rounded-2xl` (contenedores principales) |
| `radius-xl` | 24px | `rounded-3xl` (marco del hero, imagen del caso, retrato) |
| `radius-pill` | 999px | `rounded-full` |
| `content-max` | 1280px | `max-w-content` |
| `text-max` | 640px | `max-w-text` |
| `tap-min` | 44px | `min-h-11` / `size-11` |

**Layout global:** contenido centrado en `max-w-content`. Margen lateral de 16px en móvil, 24px desde `md` y 40px desde `lg`. Rejilla de 12 columnas con separación de 24px (16px en las filas de tabla). Secciones con `py-16` en móvil y `py-24` en escritorio, más un divisor `border-line` de 1px donde lo marque el artboard.

**Breakpoints:** los de Tailwind. **Composición móvil por debajo de `lg` (1024px)** y de escritorio desde `lg`. Entre `md` y `lg` se usa la composición móvil, con más margen lateral y dos columnas donde quepan (reseñas, accesos de la 404).

### 6.3 Tipografía
- **Fuentes:** `next/font/google`, autoalojadas en el build, por lo que no hay peticiones a Google en el navegador (RGPD). Subconjunto `latin`.
  - Bricolage Grotesque: variable, ejes `wght` (600–700) y `opsz`. Variable `--font-bricolage`.
  - Instrument Sans: 400 y 600. `--font-instrument`.
  - JetBrains Mono: 400 y 500. `--font-jetbrains`.
  - `display: 'swap'`, y `adjustFontFallback` activo para que no haya CLS.
- **Estilos de texto del DS** (`tokens.json` → type): se crean como utilidades `@utility` con el mismo nombre (`text-body-l`, `text-body`, `text-body-strong`, `text-small`, `text-button`, `text-meta`, `text-label`). `text-meta` y `text-label` incluyen `font-variant-numeric: tabular-nums`.
- **Titulares fluidos.** Los artboards fijan los tamaños por página; se implementan como utilidades con `clamp()` interpolando entre 390px y 1440px de ancho:

| Utilidad | Uso | Móvil → escritorio | `clamp()` | Peso · interlineado · tracking |
|---|---|---|---|---|
| `type-hero` | `<Desarrollador web>` | 46 → 92px | `clamp(46px, 1.8071rem + 4.381vw, 92px)` | 700 · 0.98 · −0.035em |
| `type-about` | «Hola, soy Terry» | 48 → 88px | `clamp(48px, 2.0714rem + 3.8095vw, 88px)` | 700 · 0.96 · −0.045em |
| `type-page` | Trabajos, Servicios | 44 → 72px | `clamp(44px, 2.1rem + 2.6667vw, 72px)` | 700 · 1 · −0.04em |
| `type-title` | Título del caso, 404 | 36 → 64px | `clamp(36px, 1.6rem + 2.6667vw, 64px)` | 700 · 1.04 · −0.04em |
| `type-title-contact` | «Hablemos de tu proyecto» | 40 → 64px | `clamp(40px, 1.9429rem + 2.2857vw, 64px)` | 700 · 1.04 · −0.04em |
| `type-closing` | «¿Hablamos?» | 44 → 64px | `clamp(44px, 2.2857rem + 1.9048vw, 64px)` | 700 · 1.04 · −0.035em |
| `type-section` | h2 de Inicio | 32 → 44px | `clamp(32px, 1.7214rem + 1.1429vw, 44px)` | 700 · 1.08 · −0.025em |
| `type-section-lg` | h2 «Web» de Servicios | 40 → 56px | `clamp(40px, 2.1286rem + 1.5238vw, 56px)` | 700 · 1.04 · −0.03em |
| `type-section-md` | h2 de Servicios (Preguntas, Cómo trabajo, IA) y «Para empresas» | 28 → 44px | `clamp(28px, 1.3786rem + 1.5238vw, 44px)` | 700 · 1.08 · −0.025em |
| `type-section-sm` | h2 del caso, Marca y Mantenimiento | 28 → 36px | `clamp(28px, 1.5643rem + 0.7619vw, 36px)` | 700 · 1.12 · −0.02em |
| `type-quote` | `<Webs que cualquiera entiende…>` | 32 → 52px | `clamp(32px, 1.5357rem + 1.9048vw, 52px)` | 700 · 1.04 · −0.035em |
| `type-card` | Nombre de proyecto, «Escríbeme», bloque de GitHub | 24 → 26px | `clamp(24px, 1.4536rem + 0.1905vw, 26px)` | 650 · 1.2 · −0.015em |
| `type-success` | «¡Recibido!» | 36 → 48px | `clamp(36px, 1.9714rem + 1.1429vw, 48px)` | 700 · 1.08 · −0.03em |

- Todos los titulares llevan `text-wrap: balance` y los párrafos `max-w-text`.
- Los signos `< >` de `CodeHeadline` van en `font-mono` 400, color `ink-subtle`, `letter-spacing: -0.08em` y `aria-hidden="true"` (§7.1).
- Si un artboard tiene un tamaño de texto corrido que no está en esta tabla (p. ej. la entradilla de Sobre mí a 21/33), se usa el valor del artboard con una clase arbitraria (`text-[21px]/[33px]`). Ese es el **único** uso permitido de valores arbitrarios de tipo; los colores arbitrarios están prohibidos.

### 6.4 Tema (ADR-004)
- Solo `prefers-color-scheme`, sin selector, sin `next-themes` y sin script en el `<head>`. No hay parpadeo porque es CSS puro.
- `<meta name="theme-color">` con dos valores: `#f2f0eb` (light) y `#111110` (dark), mediante `viewport.themeColor` y `media`.
- Las capturas de los proyectos son iguales en los dos temas. Van sobre `surface-sunken` y con borde `line`.
- El logo usa `currentColor` (§7.2), así que se adapta solo.

### 6.5 Foco, enlaces y estados
- Global: `:focus-visible { outline: 2px solid var(--tq-accent); outline-offset: 2px; }`. Nunca `outline: none` sin una alternativa.
- Enlaces de texto (`TextLink`): sin subrayado en reposo y con un subrayado de 1px que crece de izquierda a derecha en hover (150ms `ease-tq`), como `.tq-lnk` en los artboards. **Los enlaces dentro de párrafos** llevan siempre subrayado (`underline-offset-4`), porque no se distinguen solo por el color (WCAG 1.4.1).
- Botón principal: `bg-accent text-on-accent`, hover `bg-accent-hover`. Secundario: borde `line-strong`, hover borde `ink`. Transición de 150ms.
- Página actual en el menú: subrayado de 1px con `underline-offset-[6px]` y `aria-current="page"`.

### 6.6 Movimiento (ADR-005)
Solo se animan `transform` y `opacity`. Con `prefers-reduced-motion: reduce`, todas las transiciones y animaciones pasan a `none` y el contenido aparece sin moverse.

| Momento | Implementación | Detalle |
|---|---|---|
| Titular del hero | CSS (`@keyframes`) | Cada línea está dentro de una máscara (`overflow: clip`) y sube desde `translateY(100%)`. Escalonado de 60ms, 600ms `ease-tq`. Los `< >` aparecen al final (opacity, 200ms). **Nunca con `opacity: 0` en el texto**: así el h1 cuenta para el LCP desde el primer fotograma |
| Captura del hero: ratón | Isla `HeroShowcase` | Solo con `(hover: hover) and (pointer: fine)`. `perspective: 1200px`, máximo 4°, suavizado con rAF (lerp hasta ~150ms). Estado de reposo: `rotateY(-5deg) rotateX(3deg)` (UI3). Al salir el ratón vuelve al reposo |
| Captura del hero: scroll | CSS `animation-timeline: scroll()` dentro de `@supports` | De `scale(.96)` + inclinación de reposo a `scale(1)` plano en los primeros ~40vh de scroll. Sin soporte, se queda en reposo |
| Apariciones de secciones | Isla `Reveal` (un IntersectionObserver para toda la página) | Los elementos `[data-reveal]` **que ya están en pantalla al cargar no se animan**. Los que están más abajo reciben `data-reveal="pending"` (opacity 0, translateY 12px) al montar y pasan a visibles al entrar (450ms `ease-tq`; 300ms en móvil). Se animan una sola vez. Sin JS, todo es visible |
| Vista previa en /trabajos | Isla `WorkTableClient` | Solo con hover y puntero fino. Tarjeta de 340px girada −2°, que sigue la altura de la fila (250ms `ease-tq`), con un desplazamiento de 24px respecto al cursor y escala 0.9 → 1 al aparecer. `aria-hidden`. Con movimiento reducido aparece fija, sin desplazarse |
| Abrir un caso | `<ViewTransition>` de React 19.3 | La miniatura de la fila o la imagen de la tarjeta (`name="work-<slug>"`) se transforma en la imagen principal del caso (450ms). **Mejora progresiva:** si Next 16.4 todavía pide un flag (`experimental.viewTransition`), se activa solo si el build y los tests pasan. Si no, la tarea se cierra sin el efecto y se anota |
| Hover de enlaces, botones, filas y tarjetas | CSS | 150ms. Las flechas `→` se desplazan 4px. Las tarjetas pasan de `shadow-sm` a `shadow-md` y su borde a `line-strong` (250ms) |
| Botón de WhatsApp | CSS | Hover `translateY(-2px)` |

**Prohibido:** scroll secuestrado, cursor personalizado, botones magnéticos, parallax, contadores animados y animaciones que bloqueen la lectura.

### 6.7 Iconos, logo y favicon
- **Iconos:** `lucide-react`, `strokeWidth={1.75}`, 20px (24px en el botón flotante), `aria-hidden="true"`. Iconos que usan los artboards: `ArrowRight`, `ArrowLeft`, `ArrowUpRight` (o el carácter `↗` en texto), `Download`, `MessageCircle` (WhatsApp), `Code` (bloque de GitHub), `Menu`, `X`, `AlertCircle` (errores), `Check`, `Loader2` (enviando).
- Los nombres de marcas de terceros (GitHub, LinkedIn, WhatsApp) van **como texto**, nunca con su logo (DS · Iconografía).
- **Logo:** `components/layout/Logo.tsx` incluye el SVG de `tq-logo-negro.svg` **en línea** con `fill="currentColor"` (color `ink`), así que sirve para los dos temas sin cambiar de archivo. Altura de **40px** en la cabecera y el pie, que es el mínimo del DS para que `</>` se lea. Los artboards usan 36/32px; se impone la regla del DS. No se recolorea con el acento, sin sombras ni contornos.
- **Favicon (DS9):** `app/icon.svg` = `src/assets/brand/favicon.svg` (cambia de tinta con `prefers-color-scheme`). `app/apple-icon.png` = `src/assets/brand/apple-touch-icon.png` (180×180, ya viene en el kit). `scripts/build-icons.ts` genera `app/favicon.ico` (16/32/48) desde el SVG. Los archivos generados se suben al repo.
- **Iconos de perfil** (`tq-icono-cuadrado-negro.svg` / `-oscuro.svg`): no se usan en la web; se guardan en `src/assets/brand/` para GitHub y LinkedIn.

---

## 7. Componentes

### 7.1 Primitivas (`components/ui/`)
Todas son Server Components. Las props se tipan con uniones discriminadas: no hay booleanos que se contradigan ni `any`.

| Componente | Contrato | Notas de accesibilidad |
|---|---|---|
| `Container` | `as?: 'div' \| 'section' \| …`, `children` | `max-w-content`, márgenes laterales de §6.2 |
| `Button` | `variant: 'primary' \| 'secondary'`, `size: 'md' (44px) \| 'lg' (52px)`, y **o bien** `href` (+ `external?: boolean`, `download?: string`) **o bien** `type: 'button' \| 'submit'` + `onClick?` | Con `href` renderiza `<Link>` (o `<a>` si es externo o de descarga); si no, `<button>`. Si `external`, añade `↗` con `aria-hidden` y un texto oculto «(sitio externo)» / «(external site)». **Máximo un `primary` por pantalla** (DS · Color) |
| `TextLink` | `href`, `external?`, `children` | Subrayado animado (§6.5) |
| `SectionLabel` | `kind: 'route' \| 'anchor'`, `children: string` | Mono `text-meta`, con `/` o `#` en `accent`. Es texto (un `<p>`), no un enlace |
| `CodeHeadline` | `as: 'h1' \| 'blockquote'`, `children`, `lines?: [string, string]` | Los `<` `>` llevan `aria-hidden`. El nombre accesible es solo el texto («Desarrollador web») |
| `StatusBadge` | `status: 'live' \| 'demo'`, `label: string` | Punto `live` relleno o anillo `ink-muted` (demo), con `aria-hidden`. **Siempre acompañado de la palabra** |
| `Tag` | `children` | Pastilla con borde `line`, `text-small` |
| `Card` | `as?`, `interactive?: boolean` | `bg-surface border border-line rounded-2xl shadow-sm`. Si es interactiva: hover `shadow-md` + `border-line-strong` |
| `BrowserFrame` | `url: string`, `image: WorkImage`, `priority?: boolean`, `sizes: string` | Barra superior con tres puntos y la URL en mono. La imagen usa `next/image` |
| `PhoneFrame` | `image: WorkImage`, `sizes: string` | Marco de teléfono (radio y bisel según el artboard) |
| `TextField` / `TextArea` | `id`, `label`, `name`, `optional?: boolean`, `error?: string`, `describedById?`, y los atributos nativos tipados | `<label for>` visible. Si `optional`, la etiqueta «Opcional» / «Optional». Con error: `aria-invalid="true"`, `aria-describedby` apuntando al mensaje, borde `danger` e icono `AlertCircle` junto al texto |
| `RadioPills` | `name`, `legend`, `options: {value,label}[]`, `error?` | `<fieldset>` + `<legend>`. Cada pastilla es un `<input type="radio">` real con su `<label>`, con el input oculto visualmente pero accesible. Foco visible en la pastilla |
| `Checkbox` | `id`, `name`, `label: ReactNode`, `error?` | 20px, `accent-color: var(--tq-accent)` |

### 7.2 Layout (`components/layout/`)

**`Header`** (artboard `inicio-escritorio-claro.html` y los demás)
- `position: sticky; top: 0; z-index: 20`, fondo `paper`, borde inferior `line`. Relleno vertical de 14px.
- **Desde `lg`:** logo (enlace a `/` o `/en`, `aria-label` «Terry Quiñonez, ir al inicio» / «Terry Quiñonez, go to home page», SVG con `alt=""`) · `<nav aria-label="Principal">` con Trabajos, Servicios, Sobre mí, GitHub ↗, el botón Contacto y `LanguageSwitch`. Separación de 28px, `text-button`.
- **El botón Contacto** es `secondary` en todas las páginas y `primary` en /contacto (UI32), donde además lleva `aria-current="page"`.
- **Por debajo de `lg`:** logo · `LanguageSwitch` · botón de menú de 44px (`aria-label` «Abrir menú» / «Open menu», `aria-expanded`, `aria-controls="menu-movil"`).

**`MobileMenu`** (isla, UI37)
- Usa `<dialog id="menu-movil" aria-label="Menú principal">` nativo, que se abre con `showModal()`. Así el fondo queda inerte y `Esc` lo cierra sin código extra.
- A pantalla completa sobre `paper`. Contenido: enlaces grandes (Trabajos, Servicios, Sobre mí, GitHub ↗), cada uno con su ruta en mono debajo, y la página actual en `accent` con `aria-current`. Después, el botón Contacto (`primary`), `ES / EN` y LinkedIn ↗.
- Botón de cerrar de 44px (`aria-label` «Cerrar menú» / «Close menu»).
- Se cierra con `Esc`, el botón de cerrar, al pulsar cualquier enlace y al pasar a `lg` (`matchMedia`). Al cerrarse **el foco vuelve al botón de menú**.
- Bloqueo del scroll del fondo con CSS: `html:has(dialog[open]) { overflow: hidden; }`.
- Mientras está abierto, el botón de WhatsApp queda tapado (el diálogo está en la *top layer*).

**`Footer`**
- Contenido de F1 §2 / 01b §2, con la composición del artboard: logo y «**Terry Quiñonez** · Diseño y desarrollo web / Quijorna, Madrid · Trabajo en remoto en toda España» · `<nav aria-label="Contacto y redes">` con email (`mailto:`), WhatsApp, LinkedIn y GitHub · Aviso legal · Privacidad · © {año del build}.
- Debajo, separada por una línea, la nota en mono: «Hecha con Next.js · Desplegada en Vercel · [Código en GitHub ↗]» / «Built with Next.js · Deployed on Vercel · [Code on GitHub ↗]», que enlaza a `site.repoUrl`. Es la versión del artboard; sustituye a la frase larga de F1 §2.
- Todos los enlaces del pie tienen un área de 44px de alto (`py-[11px]` con interlineado de 22px), como marca la revisión de accesibilidad de F4.

**`WhatsAppFab`**
- `position: fixed`, abajo a la derecha: 24px en escritorio y `max(16px, env(safe-area-inset-*))` en móvil. 56×56, `rounded-full`, `bg-inverse-bg text-inverse-ink shadow-float`, icono `MessageCircle` de 24px.
- `aria-label`: «Escríbeme por WhatsApp» / «Message me on WhatsApp».
- `href`: el enlace de WhatsApp del idioma, con el texto ya escrito (§9.3).
- Aparece en todas las páginas, también en /contacto y en la 404.

**`SkipLink`:** «Saltar al contenido» / «Skip to content». Primer elemento enfocable, apunta a `#contenido` (el `<main>`), oculto fuera de la pantalla hasta recibir el foco, como en los artboards.

**`LanguageSwitch`:** ver §5.4.

---

## 8. Páginas

Para cada página: **artboards** de referencia (en `docs/design/artboards/`), **secciones en orden**, **de dónde sale el texto** y **criterios de aceptación (CA)**. Los CA comunes de §8.0 se aplican a todas.

### 8.0 Criterios comunes a todas las páginas
- CA-G1: un único `h1`, `h2` por sección y `h3` en tarjetas y filas. Landmarks `header`, `nav`, `main#contenido` y `footer`.
- CA-G2: todo enlace interno resuelve con 200 en los dos idiomas (lo comprueba el test de rastreo, §17.3). No hay `href="#"` ni botones sin acción.
- CA-G3: el logo enlaza a la portada de su idioma.
- CA-G4: el texto coincide literalmente con F1 (ES) o 01b (EN), o con §9.4.2 si es texto de interfaz de los artboards.
- CA-G5: sin errores ni avisos en la consola, en desarrollo ni en producción.
- CA-G6: a 390px no hay scroll horizontal de la página (solo se permite en el carrusel de reseñas, que tiene su propio scroll).
- CA-G7: axe sin infracciones en claro y oscuro (§17.3).
- CA-G8: `generateMetadata` con el título y la descripción de F1 §11 / 01b §11, más canonical y alternates (§5.5).
- CA-G9: las secciones que aparecen al hacer scroll llevan `data-reveal` (§6.6), salvo el hero y las cabeceras de página.

### 8.1 Inicio (`/`, `/en`)
**Artboards:** `inicio-escritorio-claro`, `inicio-escritorio-oscuro`, `inicio-movil`, `inicio-escritorio-en`.

| # | Sección | Contenido | Comportamiento |
|---|---|---|---|
| 1 | **Hero** (`aria-labelledby="hero-t"`) | Presentación con avatar de 52px («Hola, soy Terry Quiñonez · Madrid»), `CodeHeadline` h1 en dos líneas (`<Desarrollador` / `web>`, UI2), subtítulo (F1 §1), CTAs **Ver trabajos** (`primary`, enlaza a /trabajos) · **GitHub ↗** · **LinkedIn ↗** (`secondary`), y la fila de prueba bajo un divisor (UI4): `● Proyectos en producción` · `Next.js · TypeScript · Supabase` · `Madrid · Remoto`. A la derecha, `HeroShowcase`: `BrowserFrame` con la portada de HB y `PhoneFrame` superpuesto con su versión móvil. Pie de la captura: «Online · HB Construcciones · 2026 · Abrir web ↗» | Inclinación y scroll (§6.6). La imagen del navegador lleva `priority` (es el LCP). En móvil: CTA principal a todo el ancho, GitHub y LinkedIn en dos columnas (UI10), y la captura debajo del texto, sin efecto de ratón |
| 2 | **Trabajos recientes** (`/trabajos`) | Título, entradilla y enlace «Ver todos los trabajos →» (F1 §3.2). 3 `FeaturedProject` en orden de `content/work/index.ts` | Tarjeta (UI5): imagen 7/12 y datos 5/12. Datos: `2026 · ● Online` (año y estado), `h3` con el nombre, resumen, `Tag`s, stack en mono (`meta.cardStack`) y «Ver caso →». **Toda la tarjeta es un único enlace** al caso (un solo `<a>` con el `h3` dentro y sin enlaces anidados). En móvil se apila: imagen arriba |
| 3 | **Opiniones** (`/opiniones`) | F1 §3.5 | **Solo se muestra si `reviews.length > 0`** (§9.6). En v1 no aparece. Cuando aparezca: rejilla de 3 en escritorio y carrusel con `scroll-snap` en móvil (`role="region"`, `tabindex="0"`, `aria-label` «Opiniones de clientes, desliza para ver más»). El enlace «Ver todas en Google ↗» solo aparece si `site.googleReviewsUrl` no es `null` |
| 4 | **Servicios** (`/servicios`) | F1 §3.3 + §9.4.2: bloque «Lo principal · Web» con las 3 filas (Landing page · Web corporativa · Aplicación a medida, con su línea), y «También me encargo de…» con dos tarjetas (Tu imagen de marca · Mantenimiento y hosting). Enlace «Ver servicios →» | UI6. Filas de 12 columnas en escritorio |
| 5 | **Sobre mí** (`/sobre-mi`) | Avatar grande, texto de UI12 y ficha con Ubicación · Formación · Stack (§9.4.2). Enlace «Conóceme →» | Si no hay avatar, se aplica la alternativa de §9.6 |
| 6 | **¿Hablamos?** (`/contacto`) | F1 §3.7: título, texto, `contacto@terryq.com` grande (`mailto:`), «WhatsApp ↗» y «Respondo en 24 h laborables» | Fondo `accent-soft` con `rounded-2xl` (UI8), el único bloque de color de la portada. El email no es un botón `primary` |

**CA-1.1** En 1440×900 y 390×844, el h1, el subtítulo, el CTA principal y la fila de prueba están visibles sin hacer scroll (O1).
**CA-1.2** LCP ≤2,0 s en el perfil móvil de Lighthouse (§12).
**CA-1.3** Sin reseñas, la sección no se pinta y no queda hueco: el orden pasa a ser Hero → Trabajos → Servicios → Sobre mí → ¿Hablamos?.
**CA-1.4** EN: mismo layout y textos de 01b §3, con el titular `<Web developer>` y las etiquetas `/work`, `/reviews`, `/services`, `/about`, `/contact` (UI41).

### 8.2 Trabajos (`/trabajos`, `/en/work`)
**Artboards:** `trabajos-escritorio`. **No hay artboard móvil:** la versión móvil se define aquí.

| # | Sección | Contenido | Comportamiento |
|---|---|---|---|
| 1 | Cabecera | `SectionLabel` `/trabajos`, h1 `type-page`, entradilla (F1 §4) y a la derecha «3 proyectos · 2026» en mono (calculado) | — |
| 2 | Lista (`aria-label` «Lista de proyectos») | Filtros: `<div role="group" aria-label="Filtrar por tipo">` con 3 botones (Todo · Web · Marca) y su número. Debajo, la tabla | **Filtros (UI14):** botones con `aria-pressed`. El activo va relleno con `ink` y los demás con contorno. El número se calcula a partir de `meta.categories` (Todo 3 · Web 3 · Marca 1). Al cambiar el filtro, una región `aria-live="polite"` oculta anuncia «N proyectos». Sin JS se ven todas las filas y los filtros no se muestran |
| | | **Tabla, desde `md`:** contenedor `Card` con `role="region"`, `aria-label` «Tabla de proyectos» y `tabindex="0"`. Cabecera en `text-label` (Año 1 · Proyecto 6 · Tipo 3 · Estado 2). Cada fila es un `<a>` al caso con rejilla de 12 columnas: año (mono) · miniatura 96×60 + nombre (`body-strong` 17px) + resumen · tipo · `StatusBadge` + flecha | Hover: fondo `paper` y la flecha se desplaza 4px. Vista previa flotante (UI15, §6.6) junto a la fila con hover o foco, solo con puntero fino |
| | | **Móvil (< `md`):** cada proyecto es una fila apilada dentro de la misma `Card`: miniatura 96×60 a la izquierda; a la derecha el nombre, el resumen y una línea mono «2026 · Web para cliente · ● Online»; flecha a la derecha. **Sin scroll horizontal** y sin vista previa | Decisión de este spec (no hay artboard): ver la pregunta P2 en §21 |
| | | Pista bajo la tabla, solo con puntero fino: «Pasa el ratón por una fila para ver la vista previa.» en `text-meta`, color **`ink-muted`** (corrección de F4 · 1.4.3) | — |
| 3 | GitHub | `Card` con icono `Code` en una caja de 56px, h2 `type-card` «Más código y experimentos en GitHub», texto «Incluido el código de esta web, con su especificación y sus tareas.» y botón `secondary` «Ver GitHub ↗» (UI16) | — |

**CA-2.1** Con el filtro «Marca» solo queda HB; con «Todo», las 3 filas en el orden del índice.
**CA-2.2** Navegando con el teclado: Tab recorre filtros → región de la tabla → filas. La vista previa no recibe el foco.
**CA-2.3** A 390px no hay scroll horizontal y cada fila mide ≥44px de alto.

### 8.3 Caso de estudio (`/trabajos/[slug]`, `/en/work/[slug]`)
**Artboards:** `caso-hb-escritorio`, `caso-movil`. **Una sola plantilla para los tres casos** (UI21). El contenido sale de `meta.ts` + `<locale>.mdx` (§9).

| # | Bloque | Contenido | Comportamiento |
|---|---|---|---|
| 1 | Cabecera (UI17) | «← Trabajos» (enlace a /trabajos), posición «01 / 03», ruta en mono `/trabajos/<slug>`, h1 `type-title` con `meta.title`, y la fila de metadatos: nombre · sector o tipo · `StatusBadge` · año · dominio | — |
| 2 | Imagen principal | `BrowserFrame` (`meta.images.cover`, con `priority`) sobre `surface-sunken`, `rounded-3xl`, y `PhoneFrame` (`meta.images.mobile`) que sobresale del bloque | Lleva `<ViewTransition name="work-<slug>">` (§6.6) |
| 3 | Ficha + narrativa (UI18) | **Desde `lg`:** `<aside aria-label="Ficha del proyecto">` sticky (top 104px), 4/12: `CaseFacts` (`<dl>`) con las filas de `meta.facts` + «Mi papel» (texto común, §9.4) + Año + Estado + `meta.notice` si existe, y el **único** botón `primary` de la página: «Abrir la web ↗» (`meta.siteUrl`). Si `meta.demoUrl` existe, debajo va un `secondary` «Probar la demo ↗». **Narrativa** 8/12 con las secciones del MDX | En móvil (UI20) la ficha va completa justo después de la imagen, sin sticky |
| 4 | Secciones del MDX | `<CaseSection id kind>` en este orden: **reto** → **solución** (filas de 12 columnas: idea en negrita 4 + explicación 8, y piezas en imagen con `figcaption`) → **propuesta de identidad** (solo HB: `BrandKit` con 4 tiles: Color · Negativo · Monocromo · Icono, 2×2 en móvil) → **resultado** (con el testimonio solo si `meta.testimonial` existe) → **para desarrolladores** | **La numeración (01, 02…) se calcula según el orden de las secciones presentes.** Zona F y Finanzas no tienen identidad, así que quedan 01 reto · 02 solución · 03 resultado · 04 para desarrolladores. Las etiquetas salen de §9.4.2 |
| 5 | Para desarrolladores | `<details>` nativo, **cerrado por defecto**. Dentro, un `<dl>` de filas etiqueta + texto (`<DevItem label>`) | El `<summary>` es enfocable, tiene ≥44px de alto y un icono que gira con `aria-hidden` |
| 6 | Siguiente proyecto (UI19) | `<nav aria-label="Siguiente proyecto">` con una tarjeta grande: «Siguiente proyecto · 02 / 03», nombre, resumen, captura y «Ver caso →» | El orden es circular: HB → Zona F → Finanzas → HB |

**CA-3.1** Las 3 páginas se generan en el build en los dos idiomas (6 rutas). Un slug desconocido devuelve la 404.
**CA-3.2** Si a un caso le falta el MDX de un idioma, una imagen o un `alt` en algún idioma, **el build falla** (§9.2).
**CA-3.3** Zona F muestra en la ficha el aviso «Proyecto de demostración. No es una casa de apuestas real ni acepta dinero» y **ninguna imagen con jugadores, escudos ni patrocinadores reales** (F1 §5.2).
**CA-3.4** Solo hay un botón `primary` por pantalla.

### 8.4 Servicios (`/servicios`, `/en/services`)
**Artboards:** `servicios-escritorio`, `servicios-movil`. **Texto:** F1 §6 y §7 / 01b §6.

| # | Sección | Contenido y comportamiento |
|---|---|---|
| 1 | Cabecera (UI22) | `SectionLabel` `/servicios`, h1 `type-page`, entradilla y el índice «En esta página» (`<nav aria-label="En esta página">`) con 5 enlaces a las anclas de §5.3. **En móvil** son chips con scroll horizontal (`role="region"`, `tabindex="0"`, nombre accesible) |
| 2 | Web `#web` (UI23, UI24) | Etiqueta «Lo principal», h2 `type-section-lg` «Web», texto y la tabla «Tipos de web» (Tipo 3 · Para quién 4 · Incluye 5) con los ejemplos enlazados: Landing → caso de HB · Aplicación a medida → Finanzas Personales · Zona F. Web corporativa, sin ejemplo. Después, la franja «Siempre incluido» sobre `surface-sunken` con 7 puntos y el icono `Check` |
| 3 | Marca y mantenimiento `#marca` (`aria-label` «Marca, mantenimiento y hosting») | Etiqueta «También me encargo de». Dos tarjetas 6/6: **Marca** (texto + «Propuesta de identidad para HB Construcciones →», que enlaza a `#identidad` del caso de HB) y **Mantenimiento y hosting** (etiqueta «Después de entregarla», texto, lista de 4 puntos y «Plan mensual o anual, aparte del proyecto.») |
| 4 | Preguntas frecuentes `#preguntas` (UI25) | Etiqueta `#preguntas`, h2, «¿Tienes otra duda? [Escríbeme](/contacto).» bajo el título, y las 7 preguntas con `<details>` nativo; **la primera abierta**. La pregunta de la IA enlaza a `#ia` («cómo uso la IA ↓») |
| 5 | Cómo trabajo `#proceso` (UI27) | Entradilla y tabla de 6 filas (paso 1 · nombre 3 · qué pasa 4 · qué recibes 4) con los números grandes en `ink-subtle` (≥24px). En móvil, una lista con «Recibes ·» en mono |
| 6 | Cómo uso la IA `#ia` (UI28) | Texto 5/12 (con los bloques «Para ti significa» y «Si eres una empresa») y el botón `secondary` «Ver el repositorio ↗» (`site.repoUrl`). Panel «Del papel a producción» 7/12 con leyenda (Yo · IA) y 4 pasos. **Yo** en `accent-soft`, **IA** con contorno; el paso de la IA lleva borde discontinuo. Pie: «Las decisiones y la revisión final son siempre mías.» |
| 7 | Sigue explorando (UI29) | `<nav aria-label="Sigue explorando">` con dos tarjetas-enlace 6/6: `/trabajos` «Ver los trabajos» · `/contacto` «Cuéntame tu idea». Sin bloque de color |

**CA-4.1** Los 5 enlaces del índice llevan a su sección y el título no queda tapado por la cabecera (`scroll-margin-top`).
**CA-4.2** En esta página no hay ningún botón `primary`. El único color de acento son las etiquetas, los enlaces y el foco.

### 8.5 Sobre mí (`/sobre-mi`, `/en/about`)
**Artboards:** `sobre-mi-escritorio`, `sobre-mi-movil`. **Texto:** F1 §8 / 01b §8.

| # | Sección | Contenido y comportamiento |
|---|---|---|
| 1 | Cabecera (UI30) | 7/12: `SectionLabel` `/sobre-mi`, h1 `type-about` «Hola, soy Terry», entradilla (primer párrafo de F1 §8, con la segunda frase en `ink`) y la lista en mono con borde superior: Quijorna, Madrid · Ingeniería del Software · UPM · Next.js · TypeScript · Supabase. 4/12 (columna 9): retrato 4:5 `rounded-3xl` con `figcaption` «Retrato ilustrado a partir de una foto real.» **Sin foto, se aplica la alternativa de §9.6 y no se muestra el figcaption** |
| 2 | Mi historia (`aria-label` «Mi historia») | `<aside>` sticky 4/12 «Datos rápidos» (`dl`: Ubicación · Formación · Idiomas · Tecnologías en chips) + historia 7/12 desde la columna 6: «De Perú a Madrid» + párrafo; frase destacada (`<figure>` + `CodeHeadline as="blockquote"` `type-quote`, con la etiqueta «Lo que busco»); los dos últimos párrafos |
| 3 | Para empresas `#para-empresas` (UI31) | `Card` (padding 56px en escritorio): etiqueta `#para-empresas`, h2 `type-section-md`, el texto final de Terry con el enlace «mis proyectos» a /trabajos. A la derecha: **Descargar CV** (`primary`, `download`) y LinkedIn ↗ · GitHub ↗ (`secondary`, en 2 columnas). **Sin CV, el botón no se muestra** (§9.6) |

**CA-5.1** Sin CV en `site.ts`: no hay botón de descarga ni texto de «pendiente», y LinkedIn y GitHub ocupan la columna.

### 8.6 Contacto (`/contacto`, `/en/contact`)
**Artboards:** `contacto-escritorio`, `contacto-movil`, `contacto-estados`. **Texto:** F1 §9 / 01b §9. Comportamiento completo en §10.

| # | Bloque | Contenido |
|---|---|---|
| 1 | Columna izquierda (5/12) | `SectionLabel` `/contacto`, h1 `type-title-contact`, entradilla (UI33) y «Otros canales» en filas: WhatsApp (+34 614 312 673, enlace con el texto preparado) · Email (contacto@terryq.com) · LinkedIn (Terry Quiñonez). Después, «Respondo en 24 h laborables» y «Quijorna, Madrid · Remoto en toda España» |
| 2 | Formulario (columna 7, 6/12) | `Card` con `aria-label` «Formulario de contacto»: h2 «Escríbeme» / «Write to me», la nota «Todos los campos son obligatorios salvo el opcional.» y los campos de §10.1. Junto al botón, «Llega a contacto@terryq.com» en mono |
| — | Móvil (UI32) | Cabecera → **WhatsApp justo debajo de la entradilla** → formulario (con el título «O escríbeme aquí» / «Or write to me here») → resto de canales |

### 8.7 404
**Artboards:** `404-escritorio`, `404-movil`. **Texto:** F1 §10 / 01b §10.
- 6/12: línea mono `/<ruta pedida> → 404` (`RequestedPath`: lee `usePathname()`, recorta a 60 caracteres y escapa el contenido; `404` en `danger`), h1 `type-title`, texto, y los botones «Volver al inicio» (`primary`, icono `ArrowLeft`) y «Ver trabajos» (`secondary`).
- 6/12: `<404>` enorme (200px en escritorio, según el artboard en móvil) con los signos del titular y `aria-hidden`.
- Debajo, `<nav aria-labelledby>` con el título «O ve directamente a» y 4 tarjetas-enlace (Trabajos · Servicios · Sobre mí · Contacto), cada una con su ruta en mono y una flecha. 2×2 en móvil.
- **CA-7.1** Responde con **HTTP 404**, lleva `<meta name="robots" content="noindex">` y sale en el idioma de la URL: `/en/loquesea` en inglés y `/loquesea` en español.

### 8.8 Aviso legal y Privacidad
- Plantilla sencilla: `SectionLabel`, h1 `type-page`, «Última actualización: {fecha}» y el MDX de `content/legal/<locale>/` en `max-w-text` con estilos de prosa del DS (h2 `type-section-sm`, párrafos `text-body`, enlaces subrayados).
- Contenido mínimo en §15. En EN, un aviso en la parte superior: «This is a courtesy translation. The Spanish version prevails.»

---

## 9. Modelo de contenido (ADR-002)

### 9.1 Tipos (`src/content/types.ts`)
```ts
import type { StaticImageData } from 'next/image';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export type Localized<T> = Readonly<Record<Locale, T>>;

export type WorkSlug = 'hb-construcciones' | 'zona-f' | 'finanzas-personales';
export type WorkCategory = 'web' | 'brand';
export type WorkStatus = 'live' | 'demo';

export interface WorkImage {
  readonly src: StaticImageData;          // import estático: ancho, alto y blur automáticos
  readonly alt: Localized<string>;        // obligatorio en los dos idiomas; '' prohibido
}

export interface CaseFact {
  readonly label: Localized<string>;      // «Cliente», «Ubicación», «Tipo», «Servicios»
  readonly value: Localized<string>;
}

export interface Testimonial {
  readonly quote: string;                 // en su idioma original, sin traducir
  readonly quoteLang: Locale;
  readonly translation?: Partial<Localized<string>>; // opcional; se marca «(traducido)» / «(translated)»
  readonly author: string;
  readonly role: Localized<string>;
}

export interface WorkMeta {
  readonly slug: WorkSlug;
  readonly name: string;                  // nombre propio, igual en los dos idiomas
  readonly year: number;
  readonly yearNote?: Localized<string>;  // Zona F: «diseñada y construida en 2 semanas»
  readonly status: WorkStatus;
  readonly categories: readonly WorkCategory[];
  readonly siteUrl: string;               // https://…
  readonly demoUrl: string | null;        // Finanzas: botón «Probar la demo»; null hasta que exista
  readonly title: Localized<string>;      // titular-beneficio del caso
  readonly summary: Localized<string>;    // línea de la tarjeta de Inicio
  readonly rowSummary: Localized<string>; // línea corta de /trabajos
  readonly tags: Localized<readonly string[]>;  // etiquetas de la tarjeta
  readonly typeLabel: Localized<string>;  // columna «Tipo» de /trabajos
  readonly sector: Localized<string>;     // fila de metadatos de la cabecera del caso
  readonly cardStack: readonly string[];  // ['Next.js', 'Tailwind', 'Vercel'] → en mayúsculas por CSS
  readonly facts: readonly CaseFact[];    // filas propias de la ficha (antes de Mi papel · Año · Estado)
  readonly notice: Localized<string> | null;   // aviso de Zona F
  readonly testimonial: Testimonial | null;
  readonly images: {
    readonly cover: WorkImage;            // escritorio, ≥1600px de ancho, 16:10
    readonly mobile: WorkImage;           // móvil, 2x
    readonly thumb: WorkImage;            // miniatura de /trabajos (se recorta 96×60, arriba)
    readonly preview: WorkImage;          // vista previa flotante de /trabajos
    readonly pieces: readonly WorkImage[]; // piezas de la sección Solución
  };
}

export interface Review {
  readonly id: string;
  readonly project: WorkSlug | null;
  readonly source: 'google' | 'direct';
  readonly rating: 1 | 2 | 3 | 4 | 5 | null;
  readonly quote: string;
  readonly quoteLang: Locale;
  readonly translation?: Partial<Localized<string>>;
  readonly author: string;
  readonly role: Localized<string>;
  readonly url: string | null;            // enlace a la reseña en Google, si existe
}
```

### 9.2 Trabajos (`src/content/work/`)
- `index.ts` exporta `works: readonly WorkMeta[]` en el orden HB → Zona F → Finanzas, más `getWork(slug)`, `getNextWork(slug)` y `getPosition(slug)` («01 / 03»).
- `<slug>/meta.ts` exporta `meta` con `satisfies WorkMeta`. Los datos salen literalmente de F1 §3.2, §4 y §5 y de 01b §3–§5.
- `<slug>/es.mdx` y `en.mdx`: solo la narrativa, con los componentes de `features/work/mdx-components.tsx`:

  | Componente MDX | Props | Render |
  |---|---|---|
  | `<CaseSection kind="challenge \| solution \| identity \| outcome \| developers">` | `children` | `<section aria-labelledby>` con su número calculado (§8.3), su etiqueta y su `id`: ES `reto`, `solucion`, `identidad`, `resultado`, `desarrolladores` · EN `challenge`, `solution`, `brand-identity`, `outcome`, `for-developers` |
  | `<SolutionItem title="…">` | `children` | Fila de 12 columnas: idea en negrita 4 + explicación 8 |
  | `<SolutionMedia pieces={[0,1]} />` | índices de `meta.images.pieces` | Piezas en imagen con `figcaption` |
  | `<BrandKit />` | — | 4 tiles del kit de HB (SVG de `images/brand-kit/`) |
  | `<DevItem label="…">` | `children` | Fila del `<dl>` de «Para desarrolladores» |

- Las etiquetas de `DevItem` de HB salen del artboard `caso-hb-escritorio` (Base · Interfaz · Medios · SEO local · Conversión · Despliegue · Método). Las de Zona F y Finanzas están en §9.4.2 [prop].
- **Validación en el build** (`tests/unit/content.test.ts` + un import en tiempo de compilación): cada slug tiene `es.mdx` y `en.mdx`, todas las `WorkImage` tienen `alt` no vacío en los dos idiomas, `siteUrl` empieza por `https://` y el índice no repite slugs. Si algo falla, CI falla.
- Las páginas de caso importan el MDX con `import(\`@/content/work/${slug}/${locale}.mdx\`)` dentro de `generateStaticParams`/la página. No hay compilación en tiempo de ejecución.

### 9.3 Datos del sitio (`src/lib/site.ts`)
```ts
export const site = {
  url: 'https://terryq.com',
  person: { name: 'Terry Quiñonez', legalName: 'Terry Quiñonez Garcia', locality: 'Quijorna', region: 'Madrid', postalCode: '28693', country: 'ES' },
  email: 'contacto@terryq.com',
  whatsapp: {
    number: '34614312673',
    display: '+34 614 312 673',
    text: {
      es: 'Hola Terry, vengo de tu web y quería hablarte de ',             // F1 v2.2 (P1)
      en: "Hi Terry, I found your website and I'd like to talk about ",    // 01b · UI43
    },
  },
  github: 'https://github.com/Terryqg10',
  linkedin: 'https://www.linkedin.com/in/terry-qui%C3%B1onez-601337195/',
  repoUrl: 'https://github.com/Terryqg10/terryq.com',
  googleReviewsUrl: null,                       // flag: enlace «Ver todas en Google»
  cv: { es: null, en: null },                   // flag: '/cv/terry-quinonez-cv-es.pdf'
  avatar: null,                                 // flag: ilustración del avatar (StaticImageData)
  portrait: null,                               // flag: retrato 4:5 de /sobre-mi
  legal: { nif: null },                         // si se rellena, el aviso legal lo muestra (§15.1)
} as const satisfies SiteConfig;
```
- `whatsappHref(locale)` construye `https://wa.me/<number>?text=<encodeURIComponent(text)>`. Se usa en el botón flotante, en Inicio, en Contacto y en el mensaje de éxito.
- `SiteConfig` se tipa en el mismo archivo, sin `any`.

### 9.4 Copy (`messages/es.json`, `messages/en.json`)
#### 9.4.1 Reglas
- Todo el texto que no es narrativa de un caso ni texto legal vive aquí, en estos espacios de nombres: `common` (cabecera, menú, pie, skip link, idioma, WhatsApp, enlaces externos), `home`, `work`, `case`, `services`, `about`, `contact` (con `errors.*`), `notFound`, `legal`, `seo`.
- Los textos se copian **literalmente** de F1 v2.1 y 01b v2. Se usa el formato enriquecido de next-intl (`t.rich`) para negritas, enlaces y spans en `ink`. No se trocean frases para meter etiquetas.
- Next-intl se tipa con `AppConfig['Messages']` a partir de `es.json`: una clave que no existe es un error de TypeScript.
- **Test de paridad:** `es.json` y `en.json` tienen exactamente las mismas claves y ningún valor vacío (§17.3).
- **Mi papel** (común a los tres casos): «Dirección del proyecto, especificación, diseño, revisión y despliegue. Implementación asistida por IA (Claude Code).» / «Project lead, specification, design, review and deployment. AI-assisted implementation (Claude Code).»

#### 9.4.2 Texto de interfaz que está en los artboards y no en F1 / 01b
Va a `messages` tal cual. **[prop]** = propuesto en este spec, pendiente de que lo revise Terry (§21).

| Clave | ES | EN |
|---|---|---|
| `common.nav.label` | Principal | Main |
| `common.footer.navLabel` | Contacto y redes | Contact and social |
| `common.menu.dialogLabel` | Menú principal | Main menu [prop] |
| `common.external` (texto oculto) | (sitio externo) [prop] | (external site) [prop] |
| `common.footer.builtWith` | Hecha con Next.js · Desplegada en Vercel · Código en GitHub ↗ | Built with Next.js · Deployed on Vercel · Code on GitHub ↗ |
| `home.hero.caption` | Online · HB Construcciones · 2026 | Live · HB Construcciones · 2026 |
| `home.hero.openSite` | Abrir web ↗ | Open site ↗ |
| `home.work.cardCta` | Ver caso → | View case study → |
| `home.services.core` | Lo principal | Core service |
| `home.services.title` (bloque) | Web | Websites |
| `home.services.rows` | Landing page — Para captar contactos rápido, con WhatsApp o formulario. · Web corporativa — Varias páginas y una estructura pensada para Google. · Aplicación a medida — Usuarios, base de datos y funciones propias de tu negocio. | (01b §3.3) |
| `home.services.also` | También me encargo de… | I can also take care of… |
| `home.about.title` | Sobre mí | About me |
| `home.about.facts` | Ubicación · Formación · Stack (valores de F1 §8) | Location · Education · Stack |
| `home.reviews.label` | /opiniones | /reviews |
| `home.reviews.regionLabel` | Opiniones de clientes, desliza para ver más | Client reviews, swipe to see more [prop] |
| `home.reviews.demoFeedback` | Opinión tras revisar la demo | Feedback after reviewing the demo |
| `home.reviews.viewProject` | Ver proyecto | View project |
| `home.closing.reply` | Respondo en 24 h laborables | I reply within 24 working hours |
| `work.count` | {n} proyectos · {years} | {n} projects · {years} |
| `work.filters.label` | Filtrar por tipo | Filter by type [prop] |
| `work.filters.all/web/brand` | Todo · Web · Marca | All · Web · Brand |
| `work.listLabel` | Lista de proyectos | Project list [prop] |
| `work.tableLabel` | Tabla de proyectos | Project table [prop] |
| `work.columns` | Año · Proyecto · Tipo · Estado | Year · Project · Type · Status |
| `work.live` | {n} proyectos | {n} projects [prop] (anuncio `aria-live`) |
| `work.hint` | Pasa el ratón por una fila para ver la vista previa. | Hover over a row to see a preview. |
| `work.github.*` | Más código y experimentos en GitHub · Incluido el código de esta web, con su especificación y sus tareas. · Ver GitHub ↗ | More code and experiments on GitHub · Including the code for this website, with its specification and tasks. · See GitHub ↗ |
| `case.back` | Trabajos | Work (con «Back to Work» como nombre accesible, 01b §5) |
| `case.factsLabel` | Ficha del proyecto | Project facts [prop] |
| `case.facts.role/year/status` | Mi papel · Año · Estado | My role · Year · Status |
| `case.openSite` / `case.tryDemo` | Abrir la web ↗ · Probar la demo ↗ | Open the site ↗ · Try the demo ↗ |
| `case.sections` | El reto · La solución · Propuesta de identidad · Resultado · Para desarrolladores | The challenge · The solution · Brand identity proposal · Outcome · For developers |
| `case.brandKit` | Color · Negativo · Monocromo · Icono | Colour · Reversed · Monochrome · Icon |
| `case.pieces.hb` | Galería de obras · escritorio · Barra fija · móvil | Work gallery · desktop · Sticky bar · mobile [prop] |
| `case.testimonial` | Testimonio del cliente | Client testimonial [prop] |
| `case.next` | Siguiente proyecto · {pos} | Next project · {pos} |
| `case.translated` | (traducido) [prop] | (translated) [prop] |
| `case.dev.hb` | Base · Interfaz · Medios · SEO local · Conversión · Despliegue · Método | Stack · Interface · Media · Local SEO · Conversion · Deployment · Method [prop] |
| `case.dev.zonaF` [prop] | Base · Lenguaje y estilos · Estado · Datos y reglas · Autenticación · Simulación · Imágenes · Despliegue · Código | Stack · Language and styles · State · Data and rules · Authentication · Simulation · Images · Deployment · Code |
| `case.dev.finanzas` [prop] | Base · Seguridad · Datos · Moneda · Modo demo · Despliegue | Stack · Security · Data · Currency · Demo mode · Deployment |
| `services.toc` | En esta página | On this page |
| `services.typesLabel` | Tipos de web | Website types [prop] |
| `services.columns` | Tipo · Para quién · Incluye | Type · Who it's for · What's included |
| `services.always` | Siempre incluido | Always included |
| `services.alsoLabel` / `services.alsoAria` | También me encargo de · Marca, mantenimiento y hosting | I can also take care of · Brand, maintenance and hosting [prop] |
| `services.afterDelivery` | Después de entregarla | After delivery |
| `services.processColumns` | Paso · Qué pasa · Qué recibes | Step · What happens · What you get |
| `services.youGet` (móvil) | Recibes · | You get · [prop] |
| `services.ai.forYou` / `services.ai.company` | Para ti significa · Si eres una empresa | For you, that means · If you're a company |
| `services.ai.panel` | Del papel a producción · Yo · IA | From paper to production · Me · AI |
| `services.explore` | Sigue explorando · Ver los trabajos · Cuéntame tu idea | Keep exploring [prop] · See my work · Tell me your idea |
| `about.photoCaption` | Retrato ilustrado a partir de una foto real. | Illustrated portrait based on a real photo. [prop] |
| `about.storyLabel` | Mi historia | My story [prop] |
| `about.factsTitle` | Datos rápidos | Quick facts |
| `about.fromLabel` / `about.aimLabel` | De Perú a Madrid · Lo que busco | From Peru to Madrid · What I aim for |
| `contact.channels` | Otros canales | Other channels |
| `contact.formLabel` | Formulario de contacto | Contact form [prop] |
| `contact.formTitle` / `contact.formTitleMobile` | Escríbeme · O escríbeme aquí | Write to me · Or write to me here |
| `contact.destination` | Llega a contacto@terryq.com | Goes to contacto@terryq.com [prop] |
| `contact.optional` | Opcional | Optional |
| `notFound.goTo` | O ve directamente a | Or go straight to |

### 9.5 Imágenes
- **Fuente:** `src/content/work/<slug>/images/*.png`, a 2x y sin barra de scroll (UI11), importadas de forma estática. `next/image` sirve AVIF/WebP con `sizes` correctos (§12.2). En la imagen principal del hero y en la del caso: `priority` + `fetchPriority="high"`.
- **Capturas provisionales:** las del lienzo (`docs/design/artboards/assets/`). Sirven para empezar, pero tienen poca resolución.
- **Capturas definitivas:** `pnpm screenshots` (`scripts/capture-screenshots.ts`, Playwright con `deviceScaleFactor: 2`) a 1440×900 y 390×844 de las webs publicadas. El encuadre de cada captura está en F4 §Capturas. **En Zona F, solo la interfaz** (partidos en vivo, cuotas, boleto, barra lateral, móvil); nunca el hero ni las promos con jugadores, escudos o patrocinadores. **Terry revisa cada captura antes de que se suba.** Finanzas, en modo demo con datos de ejemplo.
- **Kit de logo de HB:** los 4 SVG del lienzo en `src/content/work/hb-construcciones/images/brand-kit/` (`color.svg`, `negativo.svg` sobre #132A4F, `monocromo.svg`, `icono.svg`), mostrados con `<img>`.
- **Alt:** descriptivo y en los dos idiomas (en `meta.ts`). Por ejemplo: «Portada de la web de HB Construcciones en escritorio, con el titular y los botones de WhatsApp».

### 9.6 Contenido condicional: nunca enlaces muertos (ADR-009)

| Flag | Si es `null` o está vacío | Si existe |
|---|---|---|
| `reviews` (array) | La sección Opiniones no se pinta | Sección completa (§8.1) |
| `site.googleReviewsUrl` | No aparece «Ver todas en Google ↗» | Enlace externo |
| `meta.testimonial` | El bloque del testimonio del caso no se pinta | `<figure>` + `<blockquote lang>` |
| `meta.demoUrl` | No aparece «Probar la demo» | Botón `secondary` en la ficha |
| `site.cv[locale]` | No aparece «Descargar CV» | Botón `primary` con `download` |
| `site.avatar` | **Hero:** solo la línea de texto, sin hueco. **Resumen de Sobre mí en Inicio:** caja `surface-sunken` con el monograma TQ centrado | La ilustración, con `alt` |
| `site.portrait` | **/sobre-mi:** caja 4:5 `surface-sunken` con el monograma TQ (`ink`, ~40% del ancho), sin figcaption | Retrato + figcaption |

**Prohibido publicar:** los textos «Ejemplo», «Pendiente», «[Nombre…]», «CV en PDF · pendiente de subir» y cualquier reseña o testimonio que no sea real. Un test de e2e busca estas cadenas en el HTML generado y falla si aparecen (§17.3).

---

## 10. Formulario de contacto (ADR-006, ADR-007)

### 10.1 Campos (`features/contact/schema.ts`)
Un solo esquema zod que se usa en el cliente (validación al enviar) y en el servidor (la que vale).

| Campo (`name`) | Control | Regla | Código de error → mensaje (F1 §9 / 01b §9) |
|---|---|---|---|
| `name` | `TextField`, `autocomplete="name"`, `maxLength=100` | Obligatorio tras `trim` | `name.required` → «Escribe tu nombre.» |
| `contact` | `TextField` `type="text"`, `autocomplete="email"`, sin `inputMode` (admite email o teléfono), `maxLength=254` | Obligatorio. Válido si es un email (`z.email()`) **o** un teléfono: tras quitar espacios, puntos, guiones y paréntesis, `^\+?\d{9,15}$` | `contact.required` → «Necesito un email o un teléfono para responderte.» · `contact.format` → «Revisa el formato: un email (tu@email.com) o un teléfono.» |
| `need` | `RadioPills` | Uno de `new-website`, `redesign`, `brand`, `job`, `other` | `need.required` → «Elige una opción.» |
| `website` | `TextField`, `type="url"` con `inputMode="url"`, `optional` | Opcional. Si viene, se añade `https://` cuando falta el protocolo y debe ser una URL http(s) válida | `website.format` → «Revisa la dirección de tu web.» **[prop]** / «Check your website address.» **[prop]** |
| `message` | `TextArea`, 5 filas, `maxLength=3000` | Obligatorio tras `trim` | `message.required` → «Cuéntame un poco de tu proyecto.» |
| `privacy` | `Checkbox` con enlace a /privacidad | Debe estar marcada | `privacy.required` → «Acepta la política de privacidad para poder enviarlo.» |
| `company` | Campo trampa: oculto visualmente, `tabindex="-1"`, `autocomplete="off"`, `aria-hidden="true"` | Debe llegar vacío | — (respuesta de éxito falsa) |
| `startedAt` | `hidden`, lo rellena el cliente al montar | Si existe y han pasado <3 s → trampa | — (respuesta de éxito falsa) |

- `<form noValidate>` (UI34: sin validación nativa). La validación se hace **al enviar** y, después del primer intento, cada campo se revalida al salir de él (`blur`) para que el error desaparezca al corregirlo.
- Las etiquetas visibles y los placeholders salen de F1 §9 / 01b §9.

### 10.2 Server Action (`features/contact/action.ts`)
```ts
'use server';
export type ContactState =
  | { status: 'idle' }
  | { status: 'invalid'; errors: Partial<Record<ContactField, ContactErrorCode>>; values: ContactValues }
  | { status: 'error'; values: ContactValues }
  | { status: 'success' };

export async function sendContact(prev: ContactState, formData: FormData): Promise<ContactState>
```
1. Lee el `locale` de un campo oculto validado contra `locales`.
2. Antispam: si `company` no está vacío o `startedAt` indica menos de 3 s → devuelve `{status:'success'}` **sin enviar** (el bot no sabe que lo ha detectado).
3. Valida con el esquema. Si falla → `invalid` con los **códigos** de error (no los textos: el cliente los traduce) y los valores, para no perderlos.
4. Envía con `transport.send()` (§10.4). Si falla → `error` con los valores, y el error se registra en el servidor sin datos personales (solo el código).
5. Si va bien → `success`.
- La acción funciona **sin JavaScript** (formulario con `action={formAction}` de `useActionState`): la página se vuelve a pintar con el estado.

### 10.3 Estados de la interfaz (UI35, artboard `contacto-estados`)

| Estado | Qué se ve | Foco y lectores de pantalla |
|---|---|---|
| Normal | Formulario | — |
| Validación | Resumen arriba en `danger`: «**Faltan datos para poder enviarlo.** Revisa el campo marcado abajo.» / «… Revisa los {n} campos marcados abajo.» (plural con ICU). Mensaje bajo cada campo con icono, `aria-invalid` y `aria-describedby`, borde `danger` | El resumen tiene `role="alert"` y `tabindex="-1"` y **recibe el foco**. Cada mensaje es un enlace al campo en el resumen [prop: opcional si complica] |
| Enviando | Botón desactivado con `Loader2` girando y «Enviando…». `aria-busy="true"` en el formulario | El botón conserva el foco |
| Error de envío | Aviso: «**No se ha podido enviar.** Inténtalo de nuevo o escríbeme a contacto@terryq.com.» **Se conservan todos los datos.** El botón vuelve a estar activo | El aviso tiene `role="alert"` |
| Enviado | **Sustituye al formulario dentro de la misma tarjeta:** «Mensaje enviado» (mono) · h2 «¡Recibido!» · texto · botones «Escribir por WhatsApp ↗» (`primary`) y «Enviar otro mensaje» (`secondary`, que reinicia el formulario) · enlace «Mientras tanto, puedes ver mis trabajos →» | Contenedor con `role="status"`. **El foco pasa al h2** (`tabindex="-1"`) |

### 10.4 Envío (`features/contact/transport.ts` + `email.ts`)
- `transport` es una interfaz `{ send(msg: ContactEmail): Promise<void> }` con dos implementaciones:
  - `resend`: SDK de Resend. **From:** `CONTACT_FROM_EMAIL` (p. ej. `Web terryq.com <formulario@envios.terryq.com>`). **To:** `CONTACT_TO_EMAIL` (`contacto@terryq.com`). **Reply-To:** el email del visitante, si lo que escribió es un email.
  - `mock`: no envía nada y guarda el mensaje en memoria para los tests. Falla a propósito si el mensaje contiene `[[fail]]`. **`lib/env.ts` lanza un error al arrancar si `CONTACT_TRANSPORT=mock` en producción** (`VERCEL_ENV=production`).
- **Email (texto plano + HTML mínimo, sin plantillas externas):** asunto `[terryq.com] {need} · {name}`. En el cuerpo: nombre, contacto, qué necesita (con la etiqueta en español), web, mensaje, idioma de la página y fecha (Europe/Madrid). Todo lo que viene del usuario se escapa en el HTML.
- **No se envía confirmación al remitente** (ADR-006).

### 10.5 Antispam por capas (ADR-007)
1. Campo trampa `company` y tiempo mínimo de 3 s (§10.2).
2. **Regla de límite del Firewall de Vercel** (disponible en el plan Hobby, que permite una regla de límite por proyecto): POST a `/contacto` y `/en/contact`, clave IP, ventana fija de 10 min y 5 peticiones → 429. Se configura en el panel de Vercel y queda documentada en `docs/adr/0007` (no es código). Primero se activa en modo **Log** una semana y después en **Deny/429**.
3. Si aun así llega spam: Cloudflare Turnstile, con un nuevo ADR y un cambio en la política de privacidad.

### 10.6 Variables de entorno (`.env.example`)
| Variable | Ejemplo | Dónde |
|---|---|---|
| `RESEND_API_KEY` | `re_…` | Producción y preview (secreta) |
| `CONTACT_TO_EMAIL` | `contacto@terryq.com` | Todas |
| `CONTACT_FROM_EMAIL` | `Web terryq.com <formulario@envios.terryq.com>` | Todas |
| `CONTACT_TRANSPORT` | `resend` · `mock` | `mock` en local y CI; `resend` en preview y producción |
| `NEXT_PUBLIC_SITE_URL` | `https://terryq.com` | Todas (canonical, OG, sitemap) |

Se validan con zod en `lib/env.ts` (`import 'server-only'`). Si falta una variable, el build falla con un mensaje claro.

---

## 11. SEO

### 11.1 Metadata
- `lib/seo.ts` exporta `buildMetadata({ locale, page, params })`, que devuelve `title` y `description` (F1 §11 / 01b §11), `alternates` (§5.5), `openGraph` (`type: 'website'`, `locale: es_ES | en_GB`, `siteName: 'Terry Quiñonez'`, URL absoluta) y `twitter: { card: 'summary_large_image' }`.
- `metadataBase: new URL(NEXT_PUBLIC_SITE_URL)`.
- Casos: el título es `{meta.name} · {meta.title} · Terry Quiñonez`, recortado a ~60 caracteres. Si no cabe, `{meta.name} · Caso de estudio · Terry Quiñonez` (`Case study` en EN). La descripción es `meta.summary`.
- Aviso legal y Privacidad: indexables, con su propio título.
- 404: `robots: { index: false }`.

### 11.2 Datos estructurados (JSON-LD)
Se inyectan con un `<script type="application/ld+json">` generado en el servidor (escapando `<`).
- **Todas las páginas** (en el layout): `Person` (name, url, jobTitle «Desarrollador web» / «Web developer», `address` {Quijorna, Madrid, ES}, `sameAs` [GitHub, LinkedIn]) y `ProfessionalService` (name «Terry Quiñonez · Diseño y desarrollo web», url, email, `areaServed`: `Country` España + `AdministrativeArea` Comunidad de Madrid, `address` {Quijorna, 28693, ES}, `founder` → la Person). **Sin** `priceRange`, `aggregateRating` ni reseñas mientras no existan reseñas reales.
- **Casos:** `CreativeWork` (name, headline, url, `dateCreated` = año, `creator` → Person, `image` = cover) + `BreadcrumbList` (Inicio › Trabajos › {nombre}).
- Se valida con la herramienta de resultados enriquecidos de Google en la tarea de QA (manual).

### 11.3 Imágenes Open Graph
- `opengraph-image.tsx` (1200×630, `next/og`) para Inicio, Trabajos, Servicios, Sobre mí, Contacto y cada caso. Fondo `paper` claro, el monograma TQ, la etiqueta de ruta en mono (`/trabajos`) y el título en Bricolage Grotesque 700. En los casos, además, la captura `cover` a la derecha.
- Las fuentes para `next/og` son archivos `.ttf` en `src/assets/og-fonts/` (Bricolage Grotesque Bold, JetBrains Mono Regular; licencia OFL incluida).
- Se generan de forma estática en el build.

### 11.4 Sitemap y robots
- `sitemap.ts`: todas las páginas indexables × 2 idiomas, cada una con `alternates.languages` (es, en). `lastModified` = fecha del build.
- `robots.ts`: en producción `allow: '/'` y la URL del sitemap. **En preview y local: `disallow: '/'`** (con `VERCEL_ENV`).
- `www.terryq.com` redirige con 308 a `terryq.com` (se configura en los dominios de Vercel).

---

## 12. Rendimiento

### 12.1 Presupuestos (Lighthouse móvil, Moto G Power, 4G lenta)
| Métrica | Objetivo | Bloquea CI |
|---|---|---|
| Rendimiento | ≥95 en todas las páginas | Sí |
| LCP | ≤2,0 s (Inicio y casos) | Sí (≤2,5 s) |
| CLS | ≤0,05 | Sí (≤0,1) |
| TBT | ≤150 ms | Sí (≤200 ms) |
| INP (campo, Speed Insights) | ≤200 ms | No (se vigila) |
| JS de primera carga por ruta (gzip) | ≤110 KB en Inicio · ≤130 KB en Contacto | Sí (`next build` + script de tamaño) |
| Peso total de Inicio | ≤900 KB transferidos en la primera visita | No (se vigila) |

### 12.2 Reglas
- `sizes` en cada `next/image` según la columna que ocupa. Por ejemplo, la tarjeta destacada: `(min-width: 1024px) 680px, 100vw`.
- Solo la imagen LCP de cada página lleva `priority`. El resto, `loading="lazy"` (el valor por defecto).
- Las fuentes con `next/font` (sin peticiones externas) y solo los pesos usados.
- Sin scripts de terceros, salvo Vercel Analytics y Speed Insights (mismo dominio).
- `optimizePackageImports` no hace falta con lucide (exportación por icono). Se comprueba con el Bundle Analyzer de Turbopack en la tarea de rendimiento.
- Las islas cliente de §4.2 son la lista cerrada (cada isla nueva justifica su peso).

---

## 13. Accesibilidad (WCAG 2.2 AA)

Se implementa **toda** la revisión de accesibilidad de F4 (tabla «Revisión de accesibilidad» y «Para la implementación»). En resumen, y como criterios que se comprueban:

| # | Requisito | Cómo se comprueba |
|---|---|---|
| A1 | Contraste: `ink-subtle` solo en texto ≥24px o marcas; la pista de /trabajos en `ink-muted` | axe + revisión manual |
| A2 | Estado nunca solo por color (`StatusBadge` con palabra, errores con texto e icono) | Revisión de código |
| A3 | Enlace «Saltar al contenido» como primer elemento enfocable | e2e: el primer Tab lo enfoca y Enter mueve el foco a `main` |
| A4 | Foco visible de 2px `accent` en todos los controles; el orden del DOM coincide con el visual | e2e (Tab por cada página) + manual |
| A5 | Zonas con scroll horizontal: `role="region"`, `tabindex="0"` y nombre | axe (`scrollable-region-focusable`) |
| A6 | Objetivos táctiles ≥44px en móvil y ≥24px en escritorio (enlaces del pie a 44px) | e2e: mide las cajas de los controles a 390px |
| A7 | Menú móvil: diálogo modal, `Esc`, foco atrapado, el foco vuelve al botón y scroll del fondo bloqueado | e2e |
| A8 | Formulario: etiquetas visibles, errores con `aria-invalid` y `aria-describedby`, resumen `role="alert"` con foco, éxito `role="status"` con foco, datos conservados | e2e |
| A9 | Idioma: `lang` en `<html>`; `lang` en citas en otro idioma; `hreflang` en el selector | e2e |
| A10 | `prefers-reduced-motion`: sin transiciones ni desplazamientos | e2e con `reducedMotion: 'reduce'` |
| A11 | Zoom al 200% y reflow a 320px sin pérdida de contenido | Manual |
| A12 | Enlaces externos en la misma pestaña (`↗` + texto oculto «(sitio externo)») | Revisión de código |
| A13 | Lector de pantalla: recorrido de Inicio, un caso y Contacto con VoiceOver (macOS/iOS) y NVDA | Manual, en la tarea de QA |

---

## 14. Analítica

- `@vercel/analytics` (`<Analytics />`) y `@vercel/speed-insights` (`<SpeedInsights />`) en el layout, con el plan **Hobby** de Vercel. **No usan cookies**, así que no hace falta banner de consentimiento (§15.3).
- Se miden **visitas, páginas, procedencia y dispositivos** (Web Analytics) y **Core Web Vitals reales** (Speed Insights).
- **No hay eventos personalizados** (`track()`): Vercel no los incluye en el plan Hobby. No se llama a `track()` en ningún sitio.
- La analítica no recoge datos personales.
---

## 15. Legal y privacidad

> Los textos legales los redacta Claude Code en una tarea propia a partir de esta lista. **Terry los revisa antes de publicar.** No es asesoramiento legal.

### 15.1 Aviso legal (`/aviso-legal`)
- **Titular:** Terry Quiñonez Garcia · **Contacto:** contacto@terryq.com · **Localidad:** Quijorna (Madrid), España.
- **Objeto:** portfolio personal para enseñar trabajos y facilitar el contacto. En la web no se vende ni se contrata nada.
- **Propiedad intelectual:** los textos, el diseño, el logo y las imágenes son de Terry Quiñonez, salvo los proyectos de clientes, que se muestran con su permiso. Las marcas de terceros pertenecen a sus titulares. El código fuente del repositorio tiene su propia licencia (§16.4).
- **Enlaces externos** y **responsabilidad:** cláusulas estándar.
- **Legislación aplicable:** española.
- `site.legal.nif` existe y es `null`. Si se rellena, el aviso legal lo muestra automáticamente.

### 15.2 Política de privacidad (`/privacidad`)
1. **Responsable:** Terry Quiñonez Garcia · contacto@terryq.com.
2. **Datos:** los del formulario (nombre, email o teléfono, necesidad, web, mensaje). Por WhatsApp o email, los que tú envíes. Datos técnicos de navegación en los registros del alojamiento y analítica agregada y anónima, **sin cookies**.
3. **Finalidad:** responder a tu consulta o propuesta.
4. **Base jurídica:** tu consentimiento (casilla del formulario, art. 6.1.a RGPD) y, si pides un presupuesto, la aplicación de medidas precontractuales (art. 6.1.b).
5. **Conservación:** el tiempo necesario para responder y, como máximo, **12 meses** si no hay una relación posterior [prop: lo confirma Terry].
6. **Encargados y transferencias:** Vercel Inc. (alojamiento y analítica), Resend (envío del formulario), Cloudflare (reenvío del email) y Google (buzón de destino). Algunos están en EE. UU. **En la tarea legal se comprueba y se indica el mecanismo de cada uno** (Marco de Privacidad de Datos UE-EE. UU. o cláusulas contractuales tipo), según su acuerdo de tratamiento.
7. **Derechos:** acceso, rectificación, supresión, oposición, limitación y portabilidad, escribiendo a contacto@terryq.com. Derecho a reclamar ante la AEPD (aepd.es).
8. **Cookies:** la web no usa cookies.
9. **WhatsApp:** si escribes por WhatsApp, también se aplica la política de privacidad de WhatsApp.

### 15.3 Sin cookies
Lo comprueba un test de e2e: ninguna respuesta lleva `Set-Cookie` y `document.cookie` está vacío en todas las páginas. Por eso no hay banner ni página de cookies. Si una dependencia añade una cookie en el futuro, el test falla.

---

## 16. Seguridad

### 16.1 Cabeceras (`next.config.ts` → `headers()`, solo en producción)
- `Content-Security-Policy`: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests`.
  *`'unsafe-inline'` en scripts es una concesión del render estático, porque los nonces exigen render dinámico. El riesgo es bajo: no hay contenido de usuarios ni scripts de terceros. Si Next estabiliza la integridad de subrecursos (`experimental.sri`), se revisa (ADR-008).*
- `Strict-Transport-Security: max-age=63072000; includeSubDomains` · `X-Content-Type-Options: nosniff` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()` · `X-Frame-Options: DENY` · `Cross-Origin-Opener-Policy: same-origin`.
- Comprobación: securityheaders.com con nota A o superior (en la tarea de lanzamiento).

### 16.2 Server Action
- Next comprueba el `Origin` por defecto. No se amplía `allowedOrigins`.
- Límite de cuerpo por defecto (1 MB). El esquema limita además cada campo (§10.1).
- Los errores no devuelven detalles internos al cliente.

### 16.3 Repositorio público
- `.env*` en `.gitignore`, salvo `.env.example`. Ningún secreto en el código ni en los tests.
- Dependabot semanal (npm y GitHub Actions). `pnpm audit --prod --audit-level=high` en CI (solo dependencias de producción: `braces`, vía ESLint, tiene un aviso high sin parche y es solo de desarrollo; revisar al actualizar ESLint).
- **En `docs/planning/` solo van F1, 01b, F3 y F4.** F0 no se publica: tiene notas internas sobre clientes, precios y otros proyectos (P4). En la copia de F1 del repo, la dirección de Gmail personal de Terry se sustituye por «el buzón personal de Terry».
- El CV, cuando exista, es público (se descarga desde la web y está en el repo). Debe llevar solo los datos que Terry quiera hacer públicos.

### 16.4 Licencia
`LICENSE`: **MIT para el código.** En el README: «Los textos, imágenes, capturas, el logo TQ y el resto de contenido de marca son © Terry Quiñonez y no están cubiertos por la licencia MIT» (pregunta P5).

---

## 17. Calidad, tests y CI

### 17.1 TypeScript y lint
- `tsconfig`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`. Alias `@/*` → `src/*`.
- ESLint (flat config): `next/core-web-vitals` + `next/typescript` y estas reglas en `error`: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/ban-ts-comment` (sin `@ts-ignore` ni `@ts-expect-error` sin descripción), `@typescript-eslint/consistent-type-imports`, `no-restricted-imports` (impide importar `features/X` desde `features/Y` y `components/` desde `content/`, §4.4). Además, jsx-a11y (incluido en la config de Next).
- Prettier + `prettier-plugin-tailwindcss` (orden de clases).
- **Cero** `any`, `@ts-ignore` y `eslint-disable` sin un comentario que lo justifique.

### 17.2 Forma de trabajar
- **Una tarea de `tasks.md` = una rama `t-XX-descripcion` = un PR** con *squash merge*. Commits con Conventional Commits.
- Plantilla de PR (`.github/pull_request_template.md`): tarea, secciones del spec aplicadas, capturas 390/1440, checklist de DoD.
- Vercel crea un preview por PR. **Terry revisa el preview** antes de hacer merge.

### 17.3 Tests
**Unitarios (Vitest):** esquema del formulario (casos válidos e inválidos de cada campo, teléfonos españoles e internacionales), `whatsappHref` (codificación), mapa de rutas (cada ruta interna tiene ES y EN), paridad de `messages`, integridad del contenido (§9.2), numeración de las secciones del caso y `buildMetadata` (canonical y alternates).

**E2E (Playwright, contra `pnpm build && pnpm start` con `CONTACT_TRANSPORT=mock`):** proyectos `desktop-chromium` (1440×900), `mobile-chromium` (390×844) y `mobile-webkit` (iPhone).

| Spec | Qué comprueba |
|---|---|
| `crawl.spec.ts` | Recorre todas las páginas de los dos idiomas desde `/` y `/en`. **Todos los enlaces internos dan 200**, los `mailto:`, `wa.me` y externos tienen un formato válido, no aparecen los textos prohibidos de §9.6 y no hay `Set-Cookie` |
| `a11y.spec.ts` | axe (WCAG 2.2 AA) en cada página × idioma × tema (`colorScheme: 'light' \| 'dark'`): **0 infracciones** |
| `navigation.spec.ts` | Logo → portada, `aria-current` en el menú, selector de idioma a la ruta equivalente (incluidos los casos), enlace de saltar al contenido, anclas de /servicios sin tapar el título |
| `mobile-menu.spec.ts` | Abrir, foco atrapado, `Esc`, cerrar con un enlace, foco de vuelta al botón y scroll bloqueado |
| `work.spec.ts` | Contadores de los filtros, `aria-pressed`, filas visibles, vista previa solo en escritorio y sin scroll horizontal en móvil |
| `case.spec.ts` | Los 6 casos se generan, `<details>` cerrado, siguiente proyecto circular, numeración y un slug inexistente → 404 |
| `contact.spec.ts` | Validación (resumen con foco, mensajes y `aria-invalid`), envío correcto (foco en «¡Recibido!»), error (`[[fail]]`, datos conservados), «Enviar otro mensaje», campo trampa (éxito falso sin envío) y **envío sin JavaScript** (`javaScriptEnabled: false`) |
| `not-found.spec.ts` | Estado 404, idioma según la URL y `noindex` |
| `motion.spec.ts` | Con `reducedMotion: 'reduce'` no hay transformaciones en curso. Sin JS, todo el contenido es visible |
| `targets.spec.ts` | En 390px todos los controles miden ≥44×44 (el pie de escritorio, ≥44 de alto) |

**Revisión visual:** un job genera capturas de cada página a 390 y 1440, en claro y oscuro, y las sube como artefacto de CI para que Terry las compare con los artboards. No hay comparación automática píxel a píxel.

**Lighthouse CI** (`lighthouserc.json`): Inicio, Trabajos, un caso, Servicios, Sobre mí y Contacto, en ES y EN, con perfil móvil y 3 ejecuciones por URL (mediana). Comprueba los presupuestos de §12.1.

### 17.4 CI (`.github/workflows/ci.yml`)
En cada PR y en cada push a `main`: pnpm + Node 24 con caché → `pnpm install --frozen-lockfile` → `pnpm tokens && git diff --exit-code` → `pnpm typecheck` → `pnpm lint` → `pnpm test` → `pnpm build` → comprobación del tamaño de JS → `pnpm e2e` → `pnpm lhci`. Todo es obligatorio para hacer merge (protección de la rama `main`).

### 17.5 Definición de terminado (por tarea)
1. Cumple los CA de la tarea y las secciones del spec que cita.
2. Tiene sus tests y CI está en verde.
3. Sin `any`, `@ts-ignore` ni texto inventado.
4. Terry ha revisado el preview.
5. Si una decisión ha cambiado, el spec o el ADR están actualizados en el mismo PR, y la tarea queda marcada en `tasks.md`.

---

## 18. Despliegue

**Requisitos previos (los prepara Terry):** `gh` con sesión iniciada como `Terryqg10` en su equipo, una cuenta de Vercel (plan **Hobby**), acceso a Cloudflare (DNS de terryq.com) y una cuenta de Resend con API key.

1. **Repo:** Claude Code lo crea con `gh repo create Terryqg10/terryq.com --public` y protege `main` (CI obligatoria y sin push directo).
2. **Vercel:** se importa el repo en la cuenta de Vercel (plan Hobby, framework Next.js, Node 24), se añaden las variables de §10.6 y `main` queda como rama de producción. Se activan Web Analytics y Speed Insights.
3. **Dominio:** `terryq.com` (apex) en producción y `www.terryq.com` con redirección 308 al apex. En Cloudflare, los registros que pide Vercel en modo **DNS only** (sin proxy). **No se tocan** los registros MX/TXT de Email Routing.
4. **Resend:** se verifica el subdominio `envios.terryq.com` (DKIM, SPF y MX de rebotes en Cloudflare, en ese subdominio). Si `_dmarc.terryq.com` no existe, se crea con `p=none` (con informes) y se endurece más adelante. Prueba: un envío real que llega a Gmail sin ir a spam.
5. **Firewall:** la regla de §10.5, primero en Log.
6. **Lanzamiento (F7):** Search Console (propiedad de dominio por TXT) y envío del sitemap · prueba de resultados enriquecidos · inspector de publicaciones de LinkedIn para la tarjeta OG · Lighthouse en producción · securityheaders.com · un envío del formulario desde producción en ES y en EN.

---

## 19. Decisiones (ADRs)
Cada fila es un archivo `docs/adr/00NN-<titulo>.md` con Contexto · Decisión · Alternativas · Consecuencias · Estado.

| ADR | Decisión | Alternativa descartada |
|---|---|---|
| 0001 | Rutas: ES sin prefijo y EN con `/en`, rutas traducidas, sin detección de idioma y sin cookie | `/es` y `/en` para todo; detección por `Accept-Language` |
| 0002 | Contenido: `meta.ts` tipado + MDX por idioma con `@next/mdx`; el copy de páginas en `messages` | Velite o Content Collections; `next-mdx-remote`; CMS |
| 0003 | Tokens generados desde `tokens.json`, paleta de Tailwind borrada y radios y espaciados por defecto de Tailwind | Tokens escritos a mano; copiar `bundle.css` |
| 0004 | Tema solo por `prefers-color-scheme` | Selector de tema con `next-themes` |
| 0005 | Animaciones sin librería: CSS, 3 islas pequeñas y View Transitions | Motion (Framer) |
| 0006 | Formulario: Server Action + Resend desde un subdominio, sin confirmación al remitente | Servicio de formularios externo; autorrespuesta |
| 0007 | Antispam por capas: trampa + tiempo + límite del Firewall de Vercel; Turnstile solo si hace falta | Turnstile o reCAPTCHA desde el principio |
| 0008 | Render estático clásico (`dynamic = 'error'`, `dynamicParams = false`), **sin Cache Components**. Se revisa con Next 17, cuando sea el modelo por defecto | Cache Components + `ensureStatic`: no aporta nada en un sitio sin datos dinámicos, y la integración con next-intl aún tiene problemas abiertos (issue amannn/next-intl#1493) |
| 0009 | Contenido condicional con flags: nunca enlaces muertos ni marcadores publicados | Publicar con «Próximamente» o marcadores |
| 0010 | Logo en línea con `currentColor`, a 40px como mínimo | Dos archivos (negro/blanco) que cambian por tema |

---

## 20. Entradas que necesita Claude Code (kit)
Se entregan junto a `tasks.md` como un paquete que se copia en el repo en la tarea T0:

| Entrada | Origen | Destino en el repo |
|---|---|---|
| F1, 01b, F3 y F4 | Proyecto | `docs/planning/` |
| 16 artboards (HTML) + sus imágenes (con las rutas corregidas) | Lienzo de alta fidelidad | `docs/design/artboards/` |
| README del DS + README de los componentes + `bundle.css` (solo como referencia) | Design System | `docs/design/design-system/` |
| `tokens.json` | Design System | `design/tokens.json` |
| `tq-logo-negro.svg`, `tq-logo-blanco.svg`, `favicon.svg` | Proyecto (`assets/brand/`) | `src/assets/brand/` y `src/app/icon.svg` |
| Kit de logo de HB (4 SVG) | Lienzo | `src/content/work/hb-construcciones/images/brand-kit/` |
| Capturas provisionales (WebP) | Lienzo | `src/content/work/<slug>/images/` (se sustituyen con `pnpm screenshots`) |
| **Pendiente de Terry, no bloquea:** avatar, retrato, CV, reseñas reales, URL del perfil de Google, testimonio de HB, modo demo de Finanzas | — | Flags de §9.6 |

---

## 21. Decisiones de la aprobación (2026-10-07)

| # | Pregunta | Decisión de Terry |
|---|---|---|
| P1 | Mensaje de WhatsApp en español | **Alineado con el inglés:** «Hola Terry, vengo de tu web y quería hablarte de » (F1 v2.2) |
| P2 | /trabajos en móvil (sin artboard) | **Filas apiladas** sin scroll horizontal (§8.2) |
| P3 | Sin avatar ni retrato | **Monograma TQ** en su lugar por ahora (§9.6) |
| P4 | F0 en el repo público | **No se publica.** Solo F1, 01b, F3 y F4 (§16.3) |
| P5 | Licencia | **MIT para el código**; contenido y marca © Terry (§16.4) |
| P6 | Textos **[prop]** de §9.4.2 y §10.1 | Se implementan así y se revisan en la tarea de QA de idioma |

## 22. Definición de terminado de v1
1. Todas las páginas de §8 en ES y EN cumplen sus CA y los comunes (§8.0).
2. CI en verde en `main`, con los presupuestos de §12.1 y 0 infracciones de axe.
3. Revisión manual hecha: lector de pantalla (A13), zoom al 200% (A11) y capturas aprobadas por Terry frente a los artboards.
4. Formulario probado en producción en ES y EN; el email llega a Gmail.
5. Dominio, `www`, HTTPS, cabeceras (A en securityheaders.com), sitemap enviado y OG correctos en LinkedIn.
6. Ningún marcador ni dato inventado publicado (§9.6). Textos legales revisados por Terry.
7. El repositorio tiene README, spec, tasks y ADRs actualizados: es la prueba de /servicios#ia.
