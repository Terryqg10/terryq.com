import { defineRouting } from 'next-intl/routing';

/** Rutas internas → ruta pública por idioma (spec §5.2). Las carpetas de `app/` usan la ruta interna. */
export const pathnames = {
  '/': '/',
  '/work': { es: '/trabajos', en: '/work' },
  '/work/[slug]': { es: '/trabajos/[slug]', en: '/work/[slug]' },
  '/services': { es: '/servicios', en: '/services' },
  '/about': { es: '/sobre-mi', en: '/about' },
  '/contact': { es: '/contacto', en: '/contact' },
  '/legal-notice': { es: '/aviso-legal', en: '/legal-notice' },
  '/privacy': { es: '/privacidad', en: '/privacy' },
} as const;

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  // Cada URL sirve siempre el mismo idioma y no se pone ninguna cookie (ADR-0001).
  localeDetection: false,
  localeCookie: false,
  pathnames,
});
