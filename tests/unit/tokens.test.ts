import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildTokensCss, type DesignTokens } from '../../scripts/build-tokens';
import tokens from '../../design/tokens.json';

const designTokens: DesignTokens = tokens;
const css = buildTokensCss(designTokens);

/** Separa el CSS en el bloque `:root` (light) y el bloque dark. */
const [lightBlock = '', darkBlock = ''] = css.split('@media (prefers-color-scheme: dark)');

const declarations = (block: string) =>
  new Map([...block.matchAll(/--tq-([a-z-]+): ([^;]+);/g)].map(([, name, value]) => [name, value]));

describe('build-tokens', () => {
  it('empieza con la cabecera de archivo generado', () => {
    expect(css.startsWith('/* GENERADO por scripts/build-tokens.ts — no editar */')).toBe(true);
  });

  it('declara color-scheme: light dark en :root', () => {
    expect(lightBlock).toContain('color-scheme: light dark;');
  });

  it('incluye los 16 colores con su valor light y dark de tokens.json', () => {
    expect(designTokens.color.tokens).toHaveLength(16);
    const light = declarations(lightBlock);
    const dark = declarations(darkBlock);
    for (const { name, value } of designTokens.color.tokens) {
      expect(light.get(name), `${name} light`).toBe(value.light);
      expect(dark.get(name), `${name} dark`).toBe(value.dark);
    }
  });

  it('incluye las 3 sombras en light y en dark', () => {
    expect(designTokens.shadow.tokens.map((token) => token.name)).toEqual([
      'shadow-sm',
      'shadow-md',
      'shadow-float',
    ]);
    const light = declarations(lightBlock);
    const dark = declarations(darkBlock);
    for (const { name, value } of designTokens.shadow.tokens) {
      expect(light.get(name), `${name} light`).toBe(value.light);
      expect(dark.get(name), `${name} dark`).toBe(value.dark);
    }
  });

  it('las medidas de layout solo están en :root', () => {
    const light = declarations(lightBlock);
    const dark = declarations(darkBlock);
    for (const { name, value } of designTokens.layout.tokens) {
      expect(light.get(name), name).toBe(value);
      expect(dark.has(name), name).toBe(false);
    }
  });

  it('el bloque dark solo contiene lo que cambia con el tema', () => {
    const themed = [...designTokens.color.tokens, ...designTokens.shadow.tokens];
    expect([...declarations(darkBlock).keys()]).toEqual(themed.map((token) => token.name));
  });
});

describe('globals.css', () => {
  const globals = readFileSync(new URL('../../src/app/globals.css', import.meta.url), 'utf8');

  it('borra la paleta de Tailwind', () => {
    expect(globals).toMatch(/--color-\*:\s*initial;/);
  });

  it('mapea cada color del DS a su variable --tq-*', () => {
    for (const { name } of designTokens.color.tokens) {
      expect(globals, name).toContain(`--color-${name}: var(--tq-${name});`);
    }
  });

  it('define las 13 utilidades type-* y los estilos de texto del DS', () => {
    expect([...globals.matchAll(/@utility (type-[a-z-]+)/g)]).toHaveLength(13);
    for (const name of ['body-l', 'body', 'body-strong', 'small', 'button', 'meta', 'label']) {
      expect(globals, name).toContain(`@utility text-${name} {`);
    }
  });

  it('respeta prefers-reduced-motion y define el foco global', () => {
    expect(globals).toContain('@media (prefers-reduced-motion: reduce)');
    expect(globals).toMatch(/:focus-visible\s*{\s*outline: 2px solid var\(--color-accent\)/);
  });
});
