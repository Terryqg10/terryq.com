import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

/**
 * Tamaño del JS de primera carga por ruta (spec §12.1): suma el gzip de los `<script src>` del HTML
 * que `next build` deja prerrenderizado. Bloquea el CI en Inicio (≤170 KB) y Contacto (≤200 KB, ADR-0011) y avisa por encima del objetivo de §12.1 (110/130 KB);
 * el resto se muestra para vigilarlo. Se lanza con `pnpm size` después de `pnpm build`.
 */
const root = new URL('../', import.meta.url);
const appDir = join(fileURLToPath(root), '.next', 'server', 'app');
const staticDir = join(appDir, '..', '..');

const kb = (bytes: number) => bytes / 1024;

/** Presupuestos de §12.1 (ADR-0011): `limit` bloquea; `target` es el objetivo original y solo avisa. Por ruta pública (sin extensión: `es`, `en`, `es/contact`…). */
const budgets: Record<string, { limit: number; target: number }> = {
  es: { limit: 170, target: 110 },
  en: { limit: 170, target: 110 },
  'es/contact': { limit: 200, target: 130 },
  'en/contact': { limit: 200, target: 130 },
};

/** Páginas que no son del sitio público (herramientas internas y páginas de error). */
const skipped = /(^|\/)(ui|_global-error|_not-found)$/;

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

const gzipCache = new Map<string, number>();
function gzipSize(src: string): number {
  const cached = gzipCache.get(src);
  if (cached !== undefined) return cached;
  const file = join(
    staticDir,
    src
      .replace(/^\/_next\//, '')
      .split('/')
      .join(sep),
  );
  const size = existsSync(file) ? gzipSync(readFileSync(file)).length : 0;
  gzipCache.set(src, size);
  return size;
}

if (!existsSync(appDir)) throw new Error('No hay build: ejecuta `pnpm build` antes.');

const rows = htmlFiles(appDir)
  .map((file) => {
    const route = relative(appDir, file)
      .split(sep)
      .join('/')
      .replace(/\.html$/, '');
    const html = readFileSync(file, 'utf8');
    // Los `noModule` (polyfills para navegadores sin módulos ES) no los descarga ningún navegador actual.
    const scripts = new Set(
      [...html.matchAll(/<script\b([^>]*)>/g)].flatMap((match) => {
        const attributes = match[1] ?? '';
        if (/\bnoModule\b/i.test(attributes)) return [];
        const src = /\bsrc="(\/_next\/static\/[^"?]+)/.exec(attributes)?.[1];
        return src ? [src] : [];
      }),
    );
    const bytes = [...scripts].reduce((sum, src) => sum + gzipSize(src), 0);
    return { route, kb: kb(bytes), budget: budgets[route] };
  })
  .filter((row) => !skipped.test(row.route))
  .sort((a, b) => a.route.localeCompare(b.route));

let failed = 0;
for (const row of rows) {
  const over = row.budget !== undefined && row.kb > row.budget.limit;
  const warn = !over && row.budget !== undefined && row.kb > row.budget.target;
  if (over) failed += 1;
  const note = row.budget
    ? ` (límite ${row.budget.limit} KB, objetivo ${row.budget.target} KB)`
    : '';
  const mark = over ? 'FALLA' : warn ? 'aviso' : 'ok   ';
  console.log(`${mark} ${row.route.padEnd(36)} ${row.kb.toFixed(1)} KB${note}`);
}
const missing = Object.keys(budgets).filter((route) => !rows.some((row) => row.route === route));
if (missing.length)
  throw new Error(`No encuentro las rutas con presupuesto: ${missing.join(', ')}`);
process.exit(failed ? 1 : 0);
