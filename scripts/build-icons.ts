import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import pngToIco from 'png-to-ico';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const brand = (file: string) => new URL(`src/assets/brand/${file}`, root);
const app = (file: string) => new URL(`src/app/${file}`, root);

/** Tamaños del `favicon.ico` (spec §6.7). */
export const icoSizes = [16, 32, 48] as const;

/** Rasteriza el SVG (con la tinta clara por defecto) a un PNG por tamaño y los junta en un `.ico`. */
export async function buildIco(svg: Buffer): Promise<Buffer> {
  const pngs = await Promise.all(
    icoSizes.map((size) =>
      sharp(svg, { density: 384 })
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer(),
    ),
  );
  return pngToIco(pngs);
}

async function main() {
  // `icon.svg` y `apple-icon.png` son copias exactas de los archivos de marca del kit.
  copyFileSync(brand('favicon.svg'), app('icon.svg'));
  copyFileSync(brand('apple-touch-icon.png'), app('apple-icon.png'));
  writeFileSync(app('favicon.ico'), await buildIco(readFileSync(brand('favicon.svg'))));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
