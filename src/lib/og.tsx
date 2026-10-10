import { getWork } from '@/content/work';
import type { Locale, WorkSlug } from '@/content/types';
import { asLocale, pagePath, type SeoPage } from '@/lib/seo';
import { site } from '@/lib/site';
import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

/** Tamaño y tipo de las imágenes Open Graph (spec §11.3). */
export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = 'image/png';

// Valores de `tokens.css` (tema claro). `next/og` no lee CSS, así que se repiten aquí.
const colors = { paper: '#f2f0eb', ink: '#141414', muted: '#57534b', accent: '#1f5b44' };

const root = process.cwd();
const fontFile = (name: string) => readFile(join(root, 'src/assets/og-fonts', name));

/** Captura `cover` de cada caso, como archivo (WebP no lo lee `next/og`: se pasa a PNG). */
const coverFiles = {
  'hb-construcciones': 'hb-portada-escritorio.webp',
  'zona-f': 'zonaf-escritorio.webp',
  'finanzas-personales': 'finanzas-escritorio.webp',
} as const satisfies Record<WorkSlug, string>;

const coverBox = { width: 520, height: 360 } as const;

async function coverDataUri(slug: WorkSlug) {
  const png = await sharp(join(root, 'src/content/work', slug, 'images', coverFiles[slug]))
    .resize(coverBox.width * 2, coverBox.height * 2, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString('base64')}`;
}

async function monogramDataUri() {
  const svg = await readFile(join(root, 'src/assets/brand/tq-icono-cuadrado-negro.svg'));
  return `data:image/svg+xml;base64,${svg.toString('base64')}`;
}

type OgPage = Exclude<SeoPage, 'not-found' | 'legal-notice' | 'privacy'>;

/** Quita «· Terry Quiñonez» del título SEO: el nombre ya va en la imagen. */
function stripSiteName(title: string, siteName: string) {
  return title
    .split(' · ')
    .filter((part) => part !== siteName)
    .join(' · ');
}

/**
 * Imagen Open Graph de una página o de un caso. Fondo `paper`, monograma TQ, ruta en mono y título
 * en Bricolage Grotesque 700; los casos añaden la captura `cover` a la derecha.
 */
export async function renderOgImage({
  locale: rawLocale,
  page,
  slug,
}: {
  locale: string;
  page: OgPage;
  slug?: WorkSlug;
}) {
  const locale: Locale = asLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: 'seo' });
  const siteName = t('siteName');

  const work = page === 'case' && slug ? getWork(slug) : null;
  const route = pagePath(page, locale, slug);
  const title = work
    ? work.name
    : stripSiteName(t(`${page as Exclude<OgPage, 'case'>}.title`), siteName);
  const subtitle = work ? work.title[locale] : null;

  const [display, mono, monogram, cover] = await Promise.all([
    fontFile('BricolageGrotesque-Bold.ttf'),
    fontFile('JetBrainsMono-Regular.ttf'),
    monogramDataUri(),
    slug && work ? coverDataUri(slug) : Promise.resolve(null),
  ]);

  const host = new URL(site.url).host;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: colors.paper,
        color: colors.ink,
        padding: 72,
        fontFamily: 'Bricolage',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse no usa next/image */}
        <img src={monogram} width={72} height={72} alt="" style={{ borderRadius: 12 }} />
        <div style={{ display: 'flex', fontFamily: 'Mono', fontSize: 28, color: colors.muted }}>
          {route}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            maxWidth: cover ? 540 : 1000,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: cover ? (title.length > 12 ? 68 : 88) : title.length > 40 ? 68 : 84,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{ display: 'flex', fontSize: 30, lineHeight: 1.25, color: colors.muted }}>
              {subtitle}
            </div>
          ) : null}
        </div>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- ImageResponse no usa next/image
          <img
            src={cover}
            width={coverBox.width}
            height={coverBox.height}
            alt=""
            style={{
              borderRadius: 20,
              border: `2px solid ${colors.ink}`,
            }}
          />
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'Mono',
          fontSize: 24,
          color: colors.accent,
        }}
      >
        <div style={{ display: 'flex' }}>{site.person.name}</div>
        <div style={{ display: 'flex' }}>{host}</div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: 'Bricolage', data: display, weight: 700, style: 'normal' },
        { name: 'Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  );
}
