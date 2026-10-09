import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
// Sin frontmatter ni plugins: los metadatos van en `meta.ts` (ADR-0002).
const withMDX = createMDX();

const nextConfig: NextConfig = {};

export default withNextIntl(withMDX(nextConfig));
