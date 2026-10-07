# TextField

Campo de formulario con etiqueta visible, ayuda opcional y mensaje de error.

**El consumidor aporta:** `id` estable, etiqueta, tipo de input, ayuda y validación. Errores con `aria-invalid` y `aria-describedby`.

**Reglas:** etiqueta siempre visible (nunca solo placeholder); borde `line-strong`, foco `accent`; error en `danger` con texto que explica cómo corregirlo. Campos obligatorios marcados con "*" y explicado al inicio del formulario.
