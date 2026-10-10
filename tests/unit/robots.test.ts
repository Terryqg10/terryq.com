import { afterEach, describe, expect, it, vi } from 'vitest';
import robots from '../../src/app/robots';

afterEach(() => vi.unstubAllEnvs());

describe('robots', () => {
  it('en producción permite todo y apunta al sitemap', () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://terryq.com');
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://terryq.com/sitemap.xml',
    });
  });

  it.each(['preview', 'development', ''])('con VERCEL_ENV=%j no deja indexar', (value) => {
    vi.stubEnv('VERCEL_ENV', value);
    expect(robots()).toEqual({ rules: { userAgent: '*', disallow: '/' } });
  });
});
