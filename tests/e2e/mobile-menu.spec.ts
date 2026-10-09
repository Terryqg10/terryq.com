import { expect, test, type Page } from '@playwright/test';

// El menú móvil solo existe por debajo de `lg`.
test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1024, 'solo por debajo de lg');

const openButton = (page: Page) => page.getByRole('button', { name: 'Abrir menú' });
const dialog = (page: Page) => page.locator('dialog#menu-movil');
const insideDialog = (page: Page) =>
  page.evaluate(() =>
    document.querySelector('dialog#menu-movil')?.contains(document.activeElement),
  );
/** El foco nunca cae en el fondo: o está en el diálogo o salió a la interfaz del navegador (body). */
const focusNotBehind = (page: Page) =>
  page.evaluate(() => {
    const active = document.activeElement;
    return (
      active === document.body ||
      Boolean(document.querySelector('dialog#menu-movil')?.contains(active))
    );
  });

test('el botón de menú tiene 44px y declara su estado y su diálogo', async ({ page }) => {
  await page.goto('/');
  const button = openButton(page);
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toHaveAttribute('aria-controls', 'menu-movil');
  const box = await button.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await expect(dialog(page)).toBeHidden();
});

test('abrir: diálogo modal con nombre, enlaces con su ruta y foco dentro', async ({ page }) => {
  await page.goto('/');
  await openButton(page).click();

  const menu = dialog(page);
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute('aria-label', 'Menú principal');
  await expect(openButton(page)).toHaveAttribute('aria-expanded', 'true');
  expect(await insideDialog(page)).toBe(true);

  for (const [label, path] of [
    ['Trabajos', '/trabajos'],
    ['Servicios', '/servicios'],
    ['Sobre mí', '/sobre-mi'],
  ] as const) {
    const link = menu.getByRole('link', { name: new RegExp(label) });
    await expect(link).toContainText(path);
  }
  await expect(menu.getByRole('link', { name: /GitHub/ })).toHaveAttribute('target', '_blank');
  await expect(menu.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('target', '_blank');
  await expect(menu.getByRole('link', { name: 'Contacto' })).toBeVisible();
  await expect(menu.getByRole('button', { name: 'Cerrar menú' })).toBeVisible();
});

test('el foco queda atrapado en el diálogo', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'WebKit no enfoca enlaces con Tab por defecto');
  await page.goto('/');
  await openButton(page).click();
  for (let presses = 0; presses < 14; presses++) {
    await page.keyboard.press('Tab');
    expect(await focusNotBehind(page), `Tab ${presses + 1}`).toBe(true);
  }
  for (let presses = 0; presses < 14; presses++) {
    await page.keyboard.press('Shift+Tab');
    expect(await focusNotBehind(page), `Shift+Tab ${presses + 1}`).toBe(true);
  }
});

test('Esc cierra el menú y el foco vuelve al botón', async ({ page }) => {
  await page.goto('/');
  await openButton(page).click();
  await page.keyboard.press('Escape');
  await expect(dialog(page)).toBeHidden();
  await expect(openButton(page)).toBeFocused();
  await expect(openButton(page)).toHaveAttribute('aria-expanded', 'false');
});

test('el botón de cerrar cierra el menú y devuelve el foco al botón', async ({ page }) => {
  await page.goto('/');
  await openButton(page).click();
  await dialog(page).getByRole('button', { name: 'Cerrar menú' }).click();
  await expect(dialog(page)).toBeHidden();
  await expect(openButton(page)).toBeFocused();
});

test('pulsar un enlace cierra el menú y navega', async ({ page }) => {
  await page.goto('/');
  await openButton(page).click();
  await dialog(page)
    .getByRole('link', { name: /Servicios/ })
    .click();
  await expect(page).toHaveURL(/\/servicios$/);
  await expect(dialog(page)).toBeHidden();
});

test('marca la página actual con aria-current', async ({ page }) => {
  await page.goto('/servicios');
  await openButton(page).click();
  await expect(dialog(page).getByRole('link', { name: /Servicios/ })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(dialog(page).getByRole('link', { name: /Trabajos/ })).not.toHaveAttribute(
    'aria-current',
  );
});

test('bloquea el scroll del fondo mientras está abierto', async ({ page }) => {
  await page.goto('/');
  const overflow = () => page.evaluate(() => getComputedStyle(document.documentElement).overflow);
  expect(await overflow()).not.toBe('hidden');
  await openButton(page).click();
  expect(await overflow()).toBe('hidden');
  await page.keyboard.press('Escape');
  expect(await overflow()).not.toBe('hidden');
});

test('el fondo queda inerte: no se puede pulsar lo que hay detrás', async ({ page }) => {
  await page.goto('/');
  await openButton(page).click();
  const behind = await page.evaluate(() => {
    const el = document.elementFromPoint(5, 5);
    return Boolean(el?.closest('dialog#menu-movil'));
  });
  expect(behind).toBe(true);
});

test('se cierra al pasar a escritorio', async ({ page }) => {
  await page.goto('/');
  await openButton(page).click();
  await expect(dialog(page)).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(dialog(page)).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Principal' })).toBeVisible();
});

test('en inglés los nombres están en inglés y las rutas en inglés', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.locator('dialog#menu-movil');
  await expect(menu).toHaveAttribute('aria-label', 'Main menu');
  await expect(menu.getByRole('link', { name: /Work/ })).toContainText('/work');
  await expect(menu.getByRole('button', { name: 'Close menu' })).toBeVisible();
});

test('cambiar de idioma desde el menú lleva a la ruta equivalente', async ({ page }) => {
  await page.goto('/servicios');
  await openButton(page).click();
  await dialog(page).locator('a[hreflang]').click();
  await expect(page).toHaveURL(/\/en\/services$/);
});
