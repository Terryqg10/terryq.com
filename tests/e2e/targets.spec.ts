import { expect, test, type Page } from '@playwright/test';
import { allRoutes } from './utils';

/**
 * Spec §13 A6: en móvil (390px) todos los controles miden ≥44×44. Quedan fuera los enlaces dentro
 * de un texto corrido (excepción «en línea» de WCAG 2.5.8) y lo que no se ve.
 */
type Small = { control: string; width: number; height: number };

async function smallControls(page: Page): Promise<Small[]> {
  return page.evaluate(() => {
    const selector =
      'a[href], button, summary, input:not([type="hidden"]), textarea, select, [role="button"], [role="tab"]';
    const found: { control: string; width: number; height: number }[] = [];

    for (const element of document.querySelectorAll<HTMLElement>(selector)) {
      const style = getComputedStyle(element);
      if (style.visibility === 'hidden' || style.display === 'none') continue;
      if (element.closest('[aria-hidden="true"], [hidden], [inert]')) continue;

      // Los radios y la casilla se manejan con su etiqueta (que es la que se toca).
      const target =
        element instanceof HTMLInputElement && ['radio', 'checkbox'].includes(element.type)
          ? (element.labels?.[0] ?? element)
          : element;
      const rect = target.getBoundingClientRect();
      if (rect.width <= 1 || rect.height <= 1) continue; // sr-only
      // Enlace dentro de una frase (hay más texto alrededor): exento por la excepción «en línea».
      if (
        element instanceof HTMLAnchorElement &&
        (element.parentElement?.textContent ?? '').trim().length >
          (element.textContent ?? '').trim().length + 2
      ) {
        continue;
      }
      if (rect.width < 43.5 || rect.height < 43.5) {
        found.push({
          control: `${element.tagName.toLowerCase()} «${(element.textContent ?? '').trim().slice(0, 40)}» ${element.getAttribute('href') ?? element.getAttribute('name') ?? ''}`,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    }
    return found;
  });
}

test.describe('en 390px todos los controles miden al menos 44×44', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) > 400, 'Solo en los proyectos móviles');

  for (const path of [...allRoutes, '/loquesea']) {
    test(path, async ({ page }) => {
      await page.goto(path);
      expect(await smallControls(page)).toEqual([]);
    });
  }

  test('el menú móvil abierto', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await expect(page.getByRole('dialog', { name: 'Menú principal' })).toBeVisible();
    expect(await smallControls(page)).toEqual([]);
  });
});

test.describe('en escritorio los controles miden al menos 24×24 y el pie 44 de alto', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1000, 'Solo en escritorio');

  test('objetivos mínimos de WCAG 2.5.8', async ({ page }) => {
    for (const path of ['/', '/trabajos', '/servicios', '/contacto']) {
      await page.goto(path);
      const tooSmall = (await smallControls(page)).filter(
        (item) => item.width < 24 || item.height < 24,
      );
      expect(tooSmall, path).toEqual([]);
    }
    const footerLinks = page.getByRole('contentinfo').getByRole('link');
    for (const link of await footerLinks.all()) {
      expect((await link.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });
});
