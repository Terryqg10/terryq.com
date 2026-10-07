# Button

Botón o enlace con forma de pastilla para las acciones de la página.

**Variantes**
- `tq-btn--primary`: relleno `accent`, texto `on-accent`. **Una sola por pantalla** (p. ej. "Ver trabajos" en el hero, "Enviar mensaje" en el formulario).
- `tq-btn--secondary`: borde `line-strong`, texto `ink`. Acciones de apoyo (GitHub, "Visitar la web ↗").
- `tq-btn--ghost`: sin borde; combinar con `tq-link` para el subrayado animado.

**El consumidor aporta:** el elemento correcto (`<a href>` si navega, `<button>` si ejecuta algo), el texto y, opcionalmente, un icono Lucide de 18px antes del texto.

**Reglas:** altura mínima 44px; `↗` para enlaces externos; nunca "Pide tu presupuesto"; foco con anillo `accent` 2px.
