import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildIco, icoSizes } from '../../scripts/build-icons';
import tokens from '../../design/tokens.json';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url));

describe('iconos', () => {
  it('icon.svg y apple-icon.png son copias de los archivos de marca', () => {
    expect(read('src/app/icon.svg').equals(read('src/assets/brand/favicon.svg'))).toBe(true);
    expect(
      read('src/app/apple-icon.png').equals(read('src/assets/brand/apple-touch-icon.png')),
    ).toBe(true);
  });

  it('el favicon.ico del repo coincide con lo que genera el script', async () => {
    expect(
      (await buildIco(read('src/assets/brand/favicon.svg'))).equals(read('src/app/favicon.ico')),
    ).toBe(true);
  });

  it('el favicon.ico trae 16, 32 y 48 px y no está en blanco', async () => {
    const ico = read('src/app/favicon.ico');
    const count = ico.readUInt16LE(4);
    expect(count).toBe(icoSizes.length);
    for (let i = 0; i < count; i++) {
      const entry = 6 + i * 16;
      expect(ico[entry]).toBe(icoSizes[i]);
      // png-to-ico guarda cada tamaño como bitmap (DIB): 40 bytes de cabecera y después los píxeles.
      const start = ico.readUInt32LE(entry + 12);
      const pixels = ico.subarray(start + 40, start + ico.readUInt32LE(entry + 8));
      expect(pixels.some((byte) => byte !== 0)).toBe(true);
    }
  });

  it('el favicon.svg cambia de tinta con el tema', () => {
    const svg = read('src/app/icon.svg').toString();
    expect(svg).toContain('fill:#141414');
    expect(svg).toMatch(/prefers-color-scheme:dark\)\{path\{fill:#F2F0EB/i);
  });
});

describe('theme-color', () => {
  it('el layout usa el paper light y dark de tokens.json', () => {
    const paper = tokens.color.tokens.find((token) => token.name === 'paper');
    const layout = read('src/app/[locale]/layout.tsx').toString();
    expect(layout).toContain(`color: '${paper?.value.light}'`);
    expect(layout).toContain(`color: '${paper?.value.dark}'`);
  });
});
