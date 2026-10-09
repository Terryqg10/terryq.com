import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  // next-intl redirige con 307; las redirecciones de idioma (`/es/...` → `/...`) son permanentes (308).
  if (response.status === 307) {
    return new NextResponse(null, { status: 308, headers: response.headers });
  }
  return response;
}

export const config = {
  // Todo menos `/api`, `/trpc`, `/_next`, `/_vercel` y los archivos con extensión.
  matcher: '/((?!api|trpc|_next|_vercel|.*[.].*).*)',
};
