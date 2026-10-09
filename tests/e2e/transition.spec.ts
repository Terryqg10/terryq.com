import { expect, test, type Page } from '@playwright/test';

// `<ViewTransition>` usa la View Transitions API: se comprueba en Chromium. En el resto de
// navegadores sin soporte la navegación funciona igual, solo que sin el efecto.
test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'View Transitions API: Chromium');
});

type Recorder = { started: number; animations: number };

/**
 * Cuenta las transiciones de vista que arranca la página y cuántas animaciones crean las
 * imágenes compartidas (`::view-transition-*(work-<slug>)`). Las del raíz son internas del
 * navegador y no se ven.
 */
async function record(page: Page) {
  await page.addInitScript(() => {
    const recorder: Recorder = { started: 0, animations: 0 };
    (window as unknown as { __vt: Recorder }).__vt = recorder;
    const original = document.startViewTransition?.bind(document);
    if (!original) return;
    document.startViewTransition = ((callback?: () => void) => {
      recorder.started += 1;
      const transition = original(callback);
      transition.ready
        .then(() => {
          recorder.animations += document
            .getAnimations()
            .filter((animation) =>
              String((animation.effect as KeyframeEffect | null)?.pseudoElement ?? '').includes(
                '(work-',
              ),
            ).length;
        })
        .catch(() => {});
      return transition;
    }) as typeof document.startViewTransition;
  });
}

const read = (page: Page) => page.evaluate(() => (window as unknown as { __vt: Recorder }).__vt);

test('abrir un caso desde la fila de /trabajos lanza la transición compartida', async ({
  page,
}) => {
  await record(page);
  await page.goto('/trabajos');
  await page.locator('[data-row] a').first().click();
  await expect(page).toHaveURL(/\/trabajos\/hb-construcciones$/);
  await expect.poll(async () => (await read(page)).started).toBeGreaterThan(0);
  await expect.poll(async () => (await read(page)).animations).toBeGreaterThan(0);
});

test('abrir un caso desde la tarjeta de Inicio lanza la transición compartida', async ({
  page,
}) => {
  await record(page);
  await page.goto('/');
  await page.locator('section[aria-labelledby="work-t"] ul a').nth(1).click();
  await expect(page).toHaveURL(/\/trabajos\/zona-f$/);
  await expect.poll(async () => (await read(page)).started).toBeGreaterThan(0);
  await expect.poll(async () => (await read(page)).animations).toBeGreaterThan(0);
});

test('con movimiento reducido no hay animación', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await record(page);
  await page.goto('/trabajos');
  await page.locator('[data-row] a').first().click();
  await expect(page).toHaveURL(/\/trabajos\/hb-construcciones$/);
  // Si React llega a arrancar la transición, el CSS deja sus animaciones en `none`.
  await page.waitForTimeout(800);
  expect((await read(page)).animations).toBe(0);
  await context.close();
});

test('el caso se ve completo tras la transición y sin errores de consola', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text());
  });
  await page.goto('/trabajos');
  await page.locator('[data-row] a').nth(2).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Mis finanzas, mes a mes, sin hojas de cálculo',
  );
  await expect(page.locator('main figure img').first()).toBeVisible();
  expect(errors).toEqual([]);
});
