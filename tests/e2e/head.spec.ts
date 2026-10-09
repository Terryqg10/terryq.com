import { expect, test } from '@playwright/test';

test('no hay peticiones a Google Fonts y las 3 familias se cargan desde el propio sitio', async ({
  page,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    const { hostname } = new URL(request.url());
    if (/(^|\.)(googleapis|gstatic)\.com$/.test(hostname)) external.push(request.url());
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(external).toEqual([]);

  for (const variable of ['--font-bricolage', '--font-instrument', '--font-jetbrains']) {
    const value = await page.evaluate(
      (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim(),
      variable,
    );
    expect(value, variable).not.toBe('');
  }
});

test('theme-color tiene un valor para claro y otro para oscuro', async ({ page }) => {
  await page.goto('/');
  const metas = await page
    .locator('meta[name="theme-color"]')
    .evaluateAll((nodes) =>
      nodes.map((node) => [node.getAttribute('media'), node.getAttribute('content')]),
    );
  expect(metas).toEqual([
    ['(prefers-color-scheme: light)', '#f2f0eb'],
    ['(prefers-color-scheme: dark)', '#111110'],
  ]);
});

test('el head enlaza el favicon SVG, el .ico y el apple-touch-icon, y todos responden', async ({
  page,
  request,
}) => {
  await page.goto('/en');
  const links = await page
    .locator('link[rel~="icon"], link[rel="apple-touch-icon"]')
    .evaluateAll((nodes) =>
      nodes.map((node) => ({
        rel: node.getAttribute('rel'),
        href: node.getAttribute('href') ?? '',
        type: node.getAttribute('type'),
      })),
    );
  const hrefs = links.map((link) => link.href.split('?')[0] ?? '');
  expect(hrefs).toEqual(expect.arrayContaining(['/favicon.ico', '/icon.svg', '/apple-icon.png']));

  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
  }
  const svg = await (await request.get('/icon.svg')).text();
  expect(svg).toContain('prefers-color-scheme');
});
