# WorkRow

Fila compacta de la tabla de `/trabajos`, en rejilla de 12 columnas: año 1 · miniatura 2 · proyecto 4 · tipo 3 · estado 2.

**El consumidor aporta:** año, miniatura, nombre, descripción corta, tipo, estado y enlace.

**Comportamiento:** hover cambia el fondo a `paper` y, en escritorio, muestra una miniatura flotante que sigue al cursor (`shadow-md`, `radius-lg`, 250ms). Filtros encima: chips Todo · Web · Marca (`tq-btn--secondary`, `aria-pressed`).

**Reglas:** la tabla va dentro de `tq-table` (scroll horizontal propio en pantallas estrechas; la página nunca se desplaza de lado). Años con `tabular-nums`.
