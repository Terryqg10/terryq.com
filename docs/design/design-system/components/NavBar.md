# NavBar

Menú superior común a todas las páginas.

**Estructura:** logo TQ (siempre enlaza a `/`), enlaces Trabajos · Servicios · Proceso · Sobre mí · GitHub, botón secundario "Contacto" y selector `ES / EN`.

**El consumidor aporta:** la página activa (`aria-current="page"` en su enlace) y las rutas del idioma actual.

**Reglas:** en tema oscuro usar `tq-logo-blanco.svg`. En móvil (<768px) los enlaces pasan a un botón de menú de 44×44 con `aria-label="Abrir menú"` y un panel que siempre se puede cerrar (botón y tecla Esc). No es fijo al hacer scroll en móvil.
