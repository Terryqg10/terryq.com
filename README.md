# terryq.com

Portfolio bilingüe (ES/EN) de **Terry Quiñonez**, desarrollador web en Quijorna (Madrid): <https://terryq.com>.

Es una web estática con una sola parte dinámica, el formulario de contacto. Se construyó con **desarrollo guiado por especificación**: la especificación, las tareas y las decisiones están en este repositorio, y cada tarea fue una rama, un pull request y un merge con el CI en verde.

## Qué es

- Inicio, Trabajos, tres casos de estudio (HB Construcciones, Zona F y Finanzas Personales), Servicios, Sobre mí, Contacto, aviso legal y privacidad, y una 404 traducida. Todo en español (sin prefijo) y en inglés (`/en`).
- Tema claro y oscuro según el sistema, sin cookies y sin scripts de terceros salvo Vercel Analytics y Speed Insights.
- SEO completo: metadata, hreflang, Open Graph por página, JSON-LD, sitemap y robots.

## Cómo está hecho

| Pieza              | Elección                                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| Framework          | Next.js 16 (App Router, Turbopack), React 19, páginas estáticas                                       |
| Lenguaje y estilos | TypeScript estricto, Tailwind CSS 4, tokens generados desde `design/tokens.json`                      |
| i18n               | next-intl, rutas por idioma (ADR-0001)                                                                |
| Contenido          | `meta.ts` + MDX por caso e idioma (ADR-0002), textos de interfaz en `messages/`                       |
| Formulario         | Server Action con zod y Resend, sin JavaScript también funciona (ADR-0006)                            |
| Antispam           | Campo trampa y tiempo mínimo, y una regla de límite en el Firewall de Vercel (ADR-0007)               |
| Calidad            | Vitest, Playwright (Chromium y WebKit), axe (WCAG 2.2 AA), Lighthouse CI, comprobación del peso de JS |
| Despliegue         | Vercel (plan Hobby), dominio y DNS en Cloudflare, correo con Cloudflare Email Routing y Resend        |

Las decisiones de arquitectura están en [`docs/adr/`](docs/adr/).

## Cómo arrancar

Requisitos: Node 24 y pnpm.

```bash
pnpm install
cp .env.example .env.local   # en local el transporte del formulario es "mock"
pnpm dev                     # http://localhost:3000
```

| Comando                                      | Qué hace                                                               |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `pnpm build` · `pnpm start`                  | Build de producción y servidor                                         |
| `pnpm typecheck` · `pnpm lint` · `pnpm test` | Tipos, ESLint y tests unitarios                                        |
| `pnpm e2e`                                   | Playwright (arranca la web en el puerto 3100 con el transporte `mock`) |
| `pnpm size`                                  | Tamaño del JS de primera carga por ruta (tras `pnpm build`)            |
| `pnpm lhci`                                  | Lighthouse CI sobre el build local                                     |
| `pnpm tokens`                                | Regenera `src/styles/tokens.css`                                       |
| `pnpm screenshots`                           | Capturas 2x de los proyectos publicados                                |

## Variables de entorno

Las de [`.env.example`](.env.example). `CONTACT_TRANSPORT=mock` no envía nada y está prohibido en producción; allí se usa `resend`, con el remitente `formulario@terryq.com` y el destino `contacto@terryq.com`.

## Despliegue

Vercel despliega `main` en producción y crea un preview por cada pull request. `main` está protegida: el CI (formato, tipos, lint, tests, build, tamaño de JS, e2e y Lighthouse) es obligatorio para hacer merge.

## Documentación

- Especificación técnica: [`docs/spec.md`](docs/spec.md)
- Tareas, en orden y con sus criterios de aceptación: [`docs/tasks.md`](docs/tasks.md)
- Decisiones de arquitectura: [`docs/adr/`](docs/adr/)
- QA de idioma y prueba manual: [`docs/qa/`](docs/qa/)
- Reglas de trabajo con Claude Code: [`CLAUDE.md`](CLAUDE.md)

## Licencia

El código se publica bajo licencia [MIT](LICENSE). Los textos, imágenes, capturas, el logo TQ y el resto de contenido de marca son © Terry Quiñonez y no están cubiertos por la licencia MIT. Las fuentes de las imágenes Open Graph (`src/assets/og-fonts/`) llevan su propia licencia OFL.
