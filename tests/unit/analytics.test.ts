import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx|mdx)$/.test(entry.name) ? [path] : [];
  });

const files = sourceFiles(join(__dirname, '../../src'));

describe('analítica (spec §14)', () => {
  it('no hay llamadas a track() ni se importa de @vercel/analytics más que <Analytics />', () => {
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      expect(source, file).not.toMatch(/\btrack\s*\(/);
      for (const [, imported] of source.matchAll(
        /import\s*\{([^}]*)\}\s*from\s*'@vercel\/analytics[^']*'/g,
      )) {
        expect(imported?.trim(), file).toBe('Analytics');
      }
    }
  });

  it('el layout monta Analytics y SpeedInsights', () => {
    const layout = readFileSync(join(__dirname, '../../src/app/[locale]/layout.tsx'), 'utf8');
    expect(layout).toContain('<Analytics />');
    expect(layout).toContain('<SpeedInsights />');
  });
});
