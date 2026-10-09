import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

export const locales = ['es', 'en'] as const;
export type TestLocale = (typeof locales)[number];

const workSlugs = ['hb-construcciones', 'zona-f', 'finanzas-personales'] as const;

/** Rutas públicas por idioma (spec §5.2). ES sin prefijo, EN con `/en`. */
export const routes: Readonly<Record<TestLocale, readonly string[]>> = {
  es: [
    '/',
    '/trabajos',
    ...workSlugs.map((slug) => `/trabajos/${slug}`),
    '/servicios',
    '/sobre-mi',
    '/contacto',
    '/aviso-legal',
    '/privacidad',
  ],
  en: [
    '/en',
    '/en/work',
    ...workSlugs.map((slug) => `/en/work/${slug}`),
    '/en/services',
    '/en/about',
    '/en/contact',
    '/en/legal-notice',
    '/en/privacy',
  ],
};

export const allRoutes: readonly string[] = [...routes.es, ...routes.en];

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** Falla si axe encuentra infracciones WCAG 2.2 AA en la página actual. */
export async function axeCheck(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}
