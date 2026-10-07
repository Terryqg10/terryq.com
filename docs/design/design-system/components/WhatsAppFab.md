# WhatsAppFab

Botón flotante de 56px, abajo a la derecha, que abre WhatsApp con el mensaje "Hola Terry, vengo de tu web…".

**El consumidor aporta:** el enlace `wa.me` con el texto codificado y el `aria-label` en el idioma activo.

**Reglas:** `position: fixed; right: 24px; bottom: calc(24px + env(safe-area-inset-bottom))`; fondo `inverse-bg`, `shadow-float`. Es el único elemento flotante. No tapa el pie: deja margen inferior en el footer.
