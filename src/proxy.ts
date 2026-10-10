import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { workSlugs } from './content/work/slugs';
import { pathnames, routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

/** Ruta interna de la 404 (`app/[locale]/not-found-page`). */
const notFoundRoute = 'not-found-page';

type RoutedLocale = (typeof routing.locales)[number];

/** Idioma de la URL (`/en/...` → `en`) y la ruta sin su prefijo. ES no lleva prefijo. */
function splitLocale(pathname: string): { locale: RoutedLocale; path: string } {
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) continue;
    if (pathname === `/${locale}`) return { locale, path: '/' };
    if (pathname.startsWith(`/${locale}/`))
      return { locale, path: pathname.slice(locale.length + 1) };
  }
  return { locale: routing.defaultLocale, path: pathname };
}

/** Todas las rutas públicas de un idioma, con los slugs de los casos ya sustituidos. */
function publicPaths(locale: RoutedLocale): ReadonlySet<string> {
  const paths = new Set<string>(['/ui']); // página de desarrollo del sistema de diseño
  for (const [internal, external] of Object.entries(pathnames)) {
    const template = typeof external === 'string' ? external : external[locale];
    if (internal === '/work/[slug]') {
      for (const slug of workSlugs) paths.add(template.replace('[slug]', slug));
    } else {
      paths.add(template);
    }
  }
  return paths;
}

const knownPaths = Object.fromEntries(
  routing.locales.map((locale) => [locale, publicPaths(locale)]),
) as Record<RoutedLocale, ReadonlySet<string>>;

function isKnown(pathname: string): boolean {
  const { locale, path } = splitLocale(pathname);
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  return knownPaths[locale].has(normalized);
}

/** Una secuencia `%` mal formada haría fallar a next-intl con un 500: es una ruta que no existe. */
function isMalformed(pathname: string): boolean {
  try {
    decodeURIComponent(pathname);
    return false;
  } catch {
    return true;
  }
}

function notFound(request: NextRequest, pathname: string) {
  const { locale } = splitLocale(pathname);
  return NextResponse.rewrite(new URL(`/${locale}/${notFoundRoute}`, request.url), { status: 404 });
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isMalformed(pathname)) return notFound(request, pathname);

  const response = handleI18nRouting(request);

  // next-intl redirige con 307; las redirecciones de idioma (`/es/...` → `/...`) son permanentes (308).
  if (response.status === 307) {
    return new NextResponse(null, { status: 308, headers: response.headers });
  }
  if (response.headers.has('location')) return response;

  // Rutas que no existen (también un slug de caso desconocido): la 404 traducida, con estado 404.
  // La propia ruta interna de la 404 no se sirve directamente.
  if (!isKnown(pathname)) return notFound(request, pathname);
  return response;
}

export const config = {
  // Todo menos `/api`, `/trpc`, `/_next`, `/_vercel`, las imágenes Open Graph y los archivos con extensión.
  matcher: '/((?!api|trpc|_next|_vercel|.*opengraph-image|.*[.].*).*)',
};
