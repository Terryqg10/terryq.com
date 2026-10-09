import { describe, expect, it } from 'vitest';
import { allRoutes, routes } from '../e2e/utils';

describe('lista de rutas de test', () => {
  it('tiene las mismas rutas en español e inglés', () => {
    expect(routes.es).toHaveLength(routes.en.length);
  });

  it('el español no lleva prefijo y el inglés sí', () => {
    expect(routes.es.every((route) => !route.startsWith('/en'))).toBe(true);
    expect(routes.en.every((route) => route === '/en' || route.startsWith('/en/'))).toBe(true);
  });

  it('no repite rutas', () => {
    expect(new Set(allRoutes).size).toBe(allRoutes.length);
  });
});
