# ADR-0011 · Presupuestos de rendimiento medidos, con los objetivos como aviso

## Contexto
El spec §12.1 fijaba como bloqueantes en CI: JS de primera carga ≤110 KB (Inicio) y ≤130 KB (Contacto), rendimiento ≥95, LCP ≤2,5 s, CLS ≤0,1 y TBT ≤200 ms. Medido con `pnpm size` y `pnpm lhci` (perfil móvil de Lighthouse, 3 ejecuciones por URL, servidor local; local y CI dan lo mismo):

- JS de primera carga (gzip, sin los `noModule`): Inicio 161,5 KB · Contacto 189,7 KB · resto 155–162 KB. React y Next suman ~135 KB; el código propio, ~25 KB en Inicio.
- Rendimiento 0,89–0,94 · LCP 2,7–3,8 s · TBT 19–43 ms · CLS ≤0,04.

Con React 19.3 y Next 16.4 el suelo de JS ya supera 110 KB, y en Lighthouse con throttling simulado el LCP cuenta todo lo que se descarga antes del primer pintado (JS, fuentes y CSS, ~350 KB a 1,6 Mbps). Los números del spec no se pueden cumplir sin cambiar de pila o recortar el diseño (fuentes, §6.3).

## Decisión
- Bloquean CI: JS de primera carga ≤170 KB en Inicio y ≤200 KB en Contacto · rendimiento ≥85 · LCP ≤4,0 s · CLS ≤0,1 · TBT ≤200 ms.
- Los objetivos originales (110/130 KB, rendimiento ≥95, LCP ≤2,0 s, CLS ≤0,05, TBT ≤150 ms) siguen en `lighthouserc.json` como **avisos** y se revisan en cada tarea que toque rendimiento.
- Lighthouse mide en CI el servidor local de producción (`pnpm start`). La medida real es Speed Insights en producción (INP ≤200 ms, se vigila).

## Alternativas
- Medir contra el preview de Vercel: más fiel (CDN real), pero necesita el bypass de la protección de previews y no se puede verificar antes de abrir el PR. Queda para el lanzamiento (F7: «Lighthouse en producción»).
- Recortar fuentes y diseño para acercarse al objetivo: descartada. Gana ~0,5 s de LCP, no llega a 2,5 s y cambia el diseño aprobado.

## Consecuencias
- El CI protege contra regresiones respecto a lo medido hoy (un salto de JS o de LCP falla el PR).
- Los objetivos del spec siguen visibles como avisos. Terry decidió esto el 2026-10-10.
- Hay que comprobar Lighthouse en producción en el lanzamiento y revisar estos umbrales con esos datos.

## Estado
Aceptado (2026-10-10)
