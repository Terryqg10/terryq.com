# ADR-0008 · Render estático clásico, sin Cache Components

## Contexto
El sitio no tiene datos dinámicos: todas las páginas pueden generarse en el build para `es` y `en`. Next 16 ofrece Cache Components, pero `create-next-app` 16.4 lo añade a la configuración (spec §4.1).

## Decisión
- Render estático clásico: `generateStaticParams`, `dynamicParams = false` y `export const dynamic = 'error'` en el layout de `[locale]`. Si algo lee cookies o cabeceras en una página, el build falla, que es lo que se quiere.
- **Cache Components desactivado**: se borra el ajuste que añade `create-next-app` del `next.config.ts` (T00).
- Se revisa con Next 17, cuando sea el modelo por defecto.

## Alternativas
- Cache Components + `ensureStatic`: no aporta nada en un sitio sin datos dinámicos, y la integración con next-intl aún tiene problemas abiertos ([amannn/next-intl#1493](https://github.com/amannn/next-intl/issues/1493)).

## Consecuencias
- Cualquier uso accidental de APIs dinámicas rompe el build en vez de degradar el rendimiento sin avisar.
- Si Next 16.4 diera un problema que bloquea el build, se baja a 16.3.x y se anota aquí.
- La CSP mantiene `'unsafe-inline'` en scripts porque los nonces exigen render dinámico (spec §16). Si Next estabiliza la integridad de subrecursos (`experimental.sri`), se revisa en este ADR.

## Estado
Aceptado (2026-10-07)
