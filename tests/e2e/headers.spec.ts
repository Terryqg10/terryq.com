import { expect, test } from '@playwright/test';
import { allRoutes } from './utils';

/** Spec §16.1: las cabeceras de seguridad. Estas pruebas corren contra `next start`. */
const expected: Record<string, string> = {
  'strict-transport-security': 'max-age=63072000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'x-frame-options': 'DENY',
  'cross-origin-opener-policy': 'same-origin',
};

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // `upgrade-insecure-requests` solo se añade en Vercel (WebKit no exime a localhost).
];

test('todas las páginas llevan las cabeceras de seguridad', async ({ request }) => {
  for (const path of [...allRoutes, '/loquesea', '/sitemap.xml', '/robots.txt']) {
    const headers = (await request.get(path)).headers();
    for (const [name, value] of Object.entries(expected)) {
      expect(headers[name], `${path} · ${name}`).toBe(value);
    }
    expect(headers['content-security-policy'], path).toBe(cspDirectives.join('; '));
  }
});

test('la CSP no permite orígenes externos ni eval', async ({ request }) => {
  const csp = (await request.get('/')).headers()['content-security-policy'] ?? '';
  expect(csp).not.toMatch(/https?:|\*|unsafe-eval/);
});

test('sin errores de CSP en la consola en ninguna página', async ({ page }) => {
  const violations: string[] = [];
  page.on('console', (message) => {
    if (/content security policy|refused to (load|execute|connect|apply)/i.test(message.text())) {
      violations.push(`${page.url()} · ${message.text()}`);
    }
  });
  // WebKit registra como error la precarga (`?_rsc=`) que se cancela al salir de la página; una
  // petición bloqueada por la CSP sale arriba, en la consola, como «Refused to connect…».
  page.on('pageerror', (error) => {
    if (!/access control checks/.test(error.message)) {
      violations.push(`${page.url()} · ${error.message}`);
    }
  });

  for (const path of allRoutes) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    // Recorre la página para cargar las imágenes diferidas.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
    });
  }
  expect(violations).toEqual([]);
});

test('la View Transition, el menú y el formulario funcionan con la CSP', async ({ page }) => {
  const violations: string[] = [];
  page.on('console', (message) => {
    if (/content security policy|refused to/i.test(message.text())) violations.push(message.text());
  });

  // Navegación entre Trabajos y un caso (View Transition) y de vuelta.
  await page.goto('/trabajos');
  await page
    .getByRole('link', { name: /HB Construcciones/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/trabajos\/hb-construcciones$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/trabajos$/);

  // El envío del formulario (Server Action, `form-action 'self'`).
  await page.goto('/contacto');
  await page.getByLabel('Nombre', { exact: true }).fill('Ana');
  await page.getByLabel('Email o teléfono').fill('ana@ejemplo.com');
  await page.locator('label', { hasText: 'Otra cosa' }).click();
  await page.getByLabel('Cuéntame tu proyecto').fill('Hola');
  await page.getByRole('checkbox', { name: /política de privacidad/ }).check();
  await page.locator('input[name="startedAt"]').evaluate((input: HTMLInputElement) => {
    input.defaultValue = String(Date.now() - 10_000);
    input.value = input.defaultValue;
  });
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByRole('heading', { name: '¡Recibido!' })).toBeFocused();

  expect(violations).toEqual([]);
});

test('la política no impide el JavaScript propio: la página se hidrata', async ({ page }) => {
  await page.goto('/trabajos');
  const filter = page.getByRole('button', { name: /^Web/ }).first();
  await filter.click();
  await expect(filter).toHaveAttribute('aria-pressed', 'true');
});
