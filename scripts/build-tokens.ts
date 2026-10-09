import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

type Theme = 'light' | 'dark';
type Themed = Readonly<Record<Theme, string>>;
type Named<T> = { readonly name: string; readonly value: T };

/** Parte de `design/tokens.json` que usa el generador (spec §6.1). */
export type DesignTokens = {
  readonly color: { readonly tokens: readonly Named<Themed>[] };
  readonly shadow: { readonly tokens: readonly Named<Themed>[] };
  readonly layout: { readonly tokens: readonly Named<string>[] };
};

const HEADER = '/* GENERADO por scripts/build-tokens.ts — no editar */';

const declaration = (name: string, value: string) => `--tq-${name}: ${value};`;

const block = (indent: string, lines: readonly string[]) =>
  lines.map((line) => `${indent}${line}`).join('\n');

/** Genera `tokens.css`: valores light en `:root` y valores dark bajo `prefers-color-scheme`. */
export function buildTokensCss(tokens: DesignTokens): string {
  const themed = [...tokens.color.tokens, ...tokens.shadow.tokens];
  const light = [
    'color-scheme: light dark;',
    ...themed.map(({ name, value }) => declaration(name, value.light)),
    ...tokens.layout.tokens.map(({ name, value }) => declaration(name, value)),
  ];
  const dark = themed.map(({ name, value }) => declaration(name, value.dark));

  return [
    HEADER,
    ':root {',
    block('  ', light),
    '}',
    '',
    '@media (prefers-color-scheme: dark) {',
    '  :root {',
    block('    ', dark),
    '  }',
    '}',
    '',
  ].join('\n');
}

const root = new URL('../', import.meta.url);

function main() {
  const tokens = JSON.parse(
    readFileSync(new URL('design/tokens.json', root), 'utf8'),
  ) as DesignTokens;
  writeFileSync(new URL('src/styles/tokens.css', root), buildTokensCss(tokens));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
