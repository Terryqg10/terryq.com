import { siteOrigin } from '@/lib/seo';
import type { MetadataRoute } from 'next';

/**
 * Solo la producción se indexa (spec §11.4): en preview y en local, `disallow: '/'`. Se decide con
 * `VERCEL_ENV`, que Vercel pone a `production`, `preview` o `development`.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteOrigin().origin}/sitemap.xml`,
  };
}
