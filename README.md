# terryq.com

Portfolio bilingüe (ES/EN) de Terry Quiñonez, desarrollador web. Se desarrolla con **desarrollo guiado por especificación**: la especificación y las tareas están en el repositorio.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript estricto · Tailwind CSS 4 · next-intl · MDX · desplegado en Vercel.

## Cómo arrancar

Requisitos: Node 24 y pnpm.

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # build de producción
```

## Despliegue

Vercel (plan Hobby) despliega `main` en producción y crea un preview por cada PR. Por ahora la producción está en <https://terryq-com.vercel.app> (sin dominio propio hasta T40). Las variables de entorno son las de [`.env.example`](.env.example); `CONTACT_TRANSPORT=mock` hasta T39.

## Documentación

- Especificación técnica: [`docs/spec.md`](docs/spec.md)
- Tareas: [`docs/tasks.md`](docs/tasks.md)
- Reglas de trabajo: [`CLAUDE.md`](CLAUDE.md)

## Licencia

El código se publica bajo licencia [MIT](LICENSE). Los textos, imágenes, capturas, el logo TQ y el resto de contenido de marca son © Terry Quiñonez y no están cubiertos por la licencia MIT.
