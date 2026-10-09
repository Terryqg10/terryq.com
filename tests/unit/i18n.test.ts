import { describe, expect, it } from 'vitest';
import { workSlugs } from '@/content/work/slugs';
import { pathnames, routing } from '@/i18n/routing';
import en from '../../messages/en.json';
import es from '../../messages/es.json';
import { routes } from '../e2e/utils';

type Tree = { readonly [key: string]: string | Tree };

/** Aplana un árbol de mensajes a pares `ruta.de.clave → valor`. */
const flatten = (tree: Tree, prefix = ''): [string, string][] =>
  Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'string' ? [[`${prefix}${key}`, value]] : flatten(value, `${prefix}${key}.`),
  );

describe('messages', () => {
  const spanish = flatten(es);
  const english = flatten(en);

  it('es.json y en.json tienen exactamente las mismas claves', () => {
    expect(english.map(([key]) => key).sort()).toEqual(spanish.map(([key]) => key).sort());
  });

  it('ningún valor está vacío', () => {
    for (const [key, value] of [...spanish, ...english]) {
      expect(value.trim(), key).not.toBe('');
    }
  });

  it('el espacio common existe en los dos idiomas', () => {
    expect(es.common).toBeDefined();
    expect(en.common).toBeDefined();
  });

  it('hay un título de caso por cada slug', () => {
    expect(Object.keys(es.case.titles).sort()).toEqual([...workSlugs].sort());
  });
});

describe('routing', () => {
  it('ES sin prefijo, EN con /en, sin detección de idioma y sin cookie', () => {
    expect(routing.locales).toEqual(['es', 'en']);
    expect(routing.defaultLocale).toBe('es');
    expect(routing.localePrefix).toBe('as-needed');
    expect(routing.localeDetection).toBe(false);
    expect(routing.localeCookie).toBe(false);
  });

  it('cada ruta interna tiene versión en español y en inglés', () => {
    for (const [internal, publicPath] of Object.entries(pathnames)) {
      if (typeof publicPath === 'string') continue; // la portada es igual en los dos idiomas
      expect(publicPath.es, internal).toMatch(/^\//);
      expect(publicPath.en, internal).toMatch(/^\//);
    }
  });

  it('las rutas públicas coinciden con la lista de rutas de los e2e', () => {
    const publicRoutes = (locale: 'es' | 'en') =>
      Object.values(pathnames).flatMap((publicPath) => {
        const path = typeof publicPath === 'string' ? publicPath : publicPath[locale];
        const paths = path.includes('[slug]')
          ? workSlugs.map((slug) => path.replace('[slug]', slug))
          : [path];
        return paths.map((p) => (locale === 'en' ? `/en${p === '/' ? '' : p}` : p));
      });
    expect(publicRoutes('es').sort()).toEqual([...routes.es].sort());
    expect(publicRoutes('en').sort()).toEqual([...routes.en].sort());
  });
});
