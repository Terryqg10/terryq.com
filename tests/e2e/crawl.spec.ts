import { expect, test, type APIRequestContext } from '@playwright/test';
import { allRoutes, routes } from './utils';

// No depende del navegador: solo hace peticiones HTTP, así que basta con un proyecto.
test.beforeEach(({ browserName }, testInfo) => {
  test.skip(
    browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium',
    'no depende del navegador',
  );
});

/** Textos que no pueden publicarse (spec §9.6). */
const forbidden = [
  /\bEjemplo\b/,
  /\bPendiente\b/,
  /\[Nombre/,
  /\[Name/,
  /CV en PDF · pendiente de subir/,
];

const decode = (value: string) => value.replaceAll('&amp;', '&');

const anchors = (html: string) =>
  [...html.matchAll(/<a\s[^>]*?href="([^"]*)"/g)].map(([, href]) => decode(href ?? ''));

type Page = { path: string; html: string };

/** Recorre el sitio desde las portadas siguiendo los enlaces internos. */
async function crawl(request: APIRequestContext) {
  const pages = new Map<string, Page>();
  const links = new Set<string>();
  const queue = ['/', '/en'];

  while (queue.length > 0) {
    const path = queue.shift() as string;
    if (pages.has(path)) continue;

    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), `GET ${path}`).toBe(200);
    expect(response.headers()['set-cookie'], `Set-Cookie en ${path}`).toBeUndefined();
    const html = await response.text();
    pages.set(path, { path, html });

    for (const href of anchors(html)) {
      links.add(href);
      if (href.startsWith('/') && !href.startsWith('//')) {
        const target = href.split('#')[0] || path;
        if (!pages.has(target)) queue.push(target);
      }
    }
  }
  return { pages, links };
}

/**
 * Casos de estudio que todavía no enlaza ninguna página (los enlazan Inicio y Trabajos en T18 y
 * T19). Cuando alguien los enlace, el test falla y hay que quitarlos de aquí: así el rastreo
 * acaba cubriendo todas las rutas.
 */
const notLinkedYet = routes.es
  .concat(routes.en)
  .filter((route) => /[/](trabajos|work)[/][^/]+$/.test(route));

test('todos los enlaces internos dan 200 y no hay Set-Cookie', async ({ request }) => {
  const { pages } = await crawl(request);

  // Cada página nueva queda cubierta automáticamente: el rastreo debe llegar a todas las rutas.
  for (const route of allRoutes.filter((route) => !notLinkedYet.includes(route))) {
    expect(pages.has(route), `el rastreo no llega a ${route}`).toBe(true);
  }
  for (const route of notLinkedYet) {
    expect(pages.has(route), `${route} ya está enlazada: quítala de notLinkedYet`).toBe(false);
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status(), route).toBe(200);
    expect(response.headers()['set-cookie'], route).toBeUndefined();
  }
});

test('los mailto:, wa.me y los enlaces externos tienen un formato válido', async ({ request }) => {
  const { links } = await crawl(request);

  for (const href of links) {
    if (href.startsWith('mailto:')) {
      expect(href, href).toMatch(/^mailto:[^\s@?]+@[^\s@?]+\.[^\s@?]+$/);
    } else if (href.startsWith('https://wa.me/')) {
      expect(href, href).toMatch(/^https:\/\/wa\.me\/\d{8,15}(\?text=[A-Za-z0-9%._~-]*)?$/);
    } else if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
      const url = new URL(href);
      expect(url.protocol, href).toBe('https:');
      expect(url.hostname, href).toContain('.');
    } else {
      expect(href, href).toMatch(/^(\/|#)/);
    }
  }
});

test('hay enlaces de contacto en el rastreo (mailto, wa.me, LinkedIn y GitHub)', async ({
  request,
}) => {
  const { links } = await crawl(request);
  const all = [...links];
  expect(all.some((href) => href.startsWith('mailto:contacto@terryq.com'))).toBe(true);
  expect(all.some((href) => href.startsWith('https://wa.me/34614312673?text='))).toBe(true);
  expect(all.some((href) => href.startsWith('https://www.linkedin.com/'))).toBe(true);
  expect(all.some((href) => href === 'https://github.com/Terryqg10')).toBe(true);
});

test('no aparecen los textos prohibidos de §9.6', async ({ request }) => {
  const { pages } = await crawl(request);
  for (const { path, html } of pages.values()) {
    for (const pattern of forbidden) {
      expect(html, `${pattern} en ${path}`).not.toMatch(pattern);
    }
  }
});
