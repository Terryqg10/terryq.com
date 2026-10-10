import { expect, test, type Page } from '@playwright/test';
import { axeCheck } from './utils';

const summary = (page: Page) => page.getByRole('alert').filter({ hasText: 'Faltan datos' });
const failure = (page: Page) =>
  page.getByRole('alert').filter({ hasText: 'No se ha podido enviar' });

/** El formulario no se envía hasta pasados 3 s (antispam): se «envejece» el reloj en vez de esperar. */
async function ageForm(page: Page) {
  await page.locator('input[name="startedAt"]').evaluate((input: HTMLInputElement) => {
    input.defaultValue = String(Date.now() - 10_000);
    input.value = input.defaultValue;
  });
}

async function fillValid(page: Page, overrides: { message?: string } = {}) {
  await page.getByLabel('Nombre', { exact: true }).fill('Ana García');
  await page.getByLabel('Email o teléfono').fill('ana@ejemplo.com');
  await page.locator('label', { hasText: 'Rediseñar mi web' }).click();
  await page
    .getByLabel('Cuéntame tu proyecto')
    .fill(overrides.message ?? 'Tengo un taller y quiero una web.');
  await page.getByRole('checkbox', { name: /política de privacidad/ }).check();
}

test.describe('página', () => {
  test('ES: cabecera, canales y tarjeta del formulario', async ({ page }) => {
    await page.goto('/contacto');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Hablemos de tu proyecto' }),
    ).toBeVisible();
    await expect(page.locator('main p', { hasText: /^\/contacto$/ })).toBeVisible();
    await expect(
      page.getByText('Cuéntame qué tienes en mente y te respondo en 24 h laborables.'),
    ).toBeVisible();

    const whatsapp = page
      .getByRole('link', { name: /WhatsApp/ })
      .filter({ hasText: '+34 614 312 673' });
    await expect(whatsapp).toHaveAttribute('href', /^https:\/\/wa\.me\/34614312673\?text=/);
    await expect(
      page.getByRole('link', { name: /Email/ }).filter({ hasText: 'contacto@terryq.com' }),
    ).toHaveAttribute('href', 'mailto:contacto@terryq.com');
    await expect(
      page.getByRole('link', { name: /LinkedIn/ }).filter({ hasText: 'Terry Quiñonez' }),
    ).toHaveAttribute('href', /linkedin\.com/);
    await expect(
      page.getByText('Respondo en 24 h laborables', { exact: true }).first(),
    ).toBeVisible();
    await expect(page.getByText('Quijorna, Madrid · Remoto en toda España')).toBeVisible();

    const card = page.getByRole('region', { name: 'Formulario de contacto' });
    await expect(card.getByRole('heading', { level: 2 })).toHaveText(/Escríbeme|O escríbeme aquí/);
    await expect(
      card.getByText('Todos los campos son obligatorios salvo el opcional.'),
    ).toBeVisible();
    await expect(card.getByText('Opcional', { exact: true })).toBeVisible();
    await expect(card.getByText('Llega a contacto@terryq.com')).toBeVisible();
    await expect(card.getByRole('button', { name: 'Enviar mensaje' })).toBeVisible();
    await expect(card.locator('form')).toHaveAttribute('novalidate', '');
    for (const need of [
      'Web nueva',
      'Rediseñar mi web',
      'Logo e identidad',
      'Propuesta de trabajo',
      'Otra cosa',
    ]) {
      await expect(card.getByText(need, { exact: true })).toBeVisible();
    }
  });

  test('EN: textos en inglés', async ({ page }) => {
    await page.goto('/en/contact');
    await expect(
      page.getByRole('heading', { level: 1, name: "Let's talk about your project" }),
    ).toBeVisible();
    const card = page.getByRole('region', { name: 'Contact form' });
    await expect(card.getByRole('heading', { level: 2 })).toHaveText(
      /Write to me|Or write to me here/,
    );
    await expect(card.getByLabel('Current website, if any')).toBeVisible();
    await expect(card.getByText('Job opportunity')).toBeVisible();
    await expect(card.getByText('Goes to contacto@terryq.com')).toBeVisible();
    await expect(page.getByText('I reply within 24 working hours')).toBeVisible();
    await expect(card.getByRole('link', { name: 'privacy policy' })).toHaveAttribute(
      'href',
      '/en/privacy',
    );
  });

  test('el orden depende del ancho: en móvil WhatsApp va antes del formulario; en escritorio, a su izquierda', async ({
    page,
  }) => {
    await page.goto('/contacto');
    const whatsapp = await page
      .getByRole('link', { name: /WhatsApp/ })
      .filter({ hasText: '+34 614 312 673' })
      .boundingBox();
    const card = await page.getByRole('region', { name: 'Formulario de contacto' }).boundingBox();
    const email = await page
      .getByRole('link', { name: /Email/ })
      .filter({ hasText: 'contacto@terryq.com' })
      .boundingBox();
    if (!whatsapp || !card || !email) throw new Error('faltan elementos');
    if ((page.viewportSize()?.width ?? 0) >= 1024) {
      expect(whatsapp.x + whatsapp.width).toBeLessThan(card.x);
      expect(email.x + email.width).toBeLessThan(card.x);
    } else {
      expect(whatsapp.y).toBeLessThan(card.y);
      expect(email.y).toBeGreaterThan(card.y + card.height);
    }
    // Sin desbordamiento horizontal.
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });

  test('el campo trampa no se ve, no se enfoca y está oculto a lectores', async ({ page }) => {
    await page.goto('/contacto');
    const trap = page.locator('input[name="company"]');
    await expect(trap).toHaveAttribute('tabindex', '-1');
    await expect(trap).toHaveAttribute('autocomplete', 'off');
    await expect(trap.locator('xpath=..')).toHaveAttribute('aria-hidden', 'true');
    // El contenedor está recortado a 1px: no ocupa ni se ve.
    expect((await trap.locator('xpath=..').boundingBox())?.width ?? 0).toBeLessThanOrEqual(1);
  });

  for (const path of ['/contacto', '/en/contact']) {
    test(`sin infracciones de accesibilidad en ${path}`, async ({ page }) => {
      await page.goto(path);
      await axeCheck(page);
    });
  }
});

test.describe('validación', () => {
  test('enviar vacío: resumen con foco, mensajes y aria-invalid', async ({ page }) => {
    await page.goto('/contacto');
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();

    await expect(summary(page)).toHaveText(
      'Faltan datos para poder enviarlo. Revisa los 5 campos marcados abajo.',
    );
    await expect(summary(page)).toBeFocused();

    const name = page.getByLabel('Nombre', { exact: true });
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(name).toHaveAccessibleDescription('Escribe tu nombre.');
    await expect(page.getByLabel('Email o teléfono')).toHaveAccessibleDescription(
      'Necesito un email o un teléfono para responderte.',
    );
    await expect(page.getByLabel('Cuéntame tu proyecto')).toHaveAccessibleDescription(
      'Cuéntame un poco de tu proyecto.',
    );
    await expect(
      page.getByRole('checkbox', { name: /política de privacidad/ }),
    ).toHaveAccessibleDescription('Acepta la política de privacidad para poder enviarlo.');
    await expect(page.getByRole('group', { name: '¿Qué necesitas?' })).toHaveAccessibleDescription(
      'Elige una opción.',
    );
    await expect(page.getByLabel(/Web actual/)).not.toHaveAttribute('aria-invalid', 'true');
    await axeCheck(page);
  });

  test('tras el primer intento, cada campo se revalida al salir de él', async ({ page }) => {
    await page.goto('/contacto');
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();

    const name = page.getByLabel('Nombre', { exact: true });
    await name.fill('Ana');
    await page.getByLabel('Email o teléfono').focus(); // blur del nombre
    await expect(name).not.toHaveAttribute('aria-invalid', 'true');
    await expect(summary(page)).toContainText('Revisa los 4 campos marcados abajo.');

    const contact = page.getByLabel('Email o teléfono');
    await contact.fill('ana@');
    await name.focus();
    await expect(contact).toHaveAccessibleDescription(
      'Revisa el formato: un email (tu@email.com) o un teléfono.',
    );
  });

  test('con un solo error el resumen va en singular y la web se valida', async ({ page }) => {
    await page.goto('/contacto');
    await fillValid(page);
    await page.getByLabel(/Web actual/).fill('hola mundo');
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(summary(page)).toHaveText(
      'Faltan datos para poder enviarlo. Revisa el campo marcado abajo.',
    );
    await expect(page.getByLabel(/Web actual/)).toHaveAccessibleDescription(
      'Revisa la dirección de tu web.',
    );
    // Los datos escritos siguen ahí.
    await expect(page.getByLabel('Nombre', { exact: true })).toHaveValue('Ana García');
  });

  test('en inglés, los mismos mensajes traducidos', async ({ page }) => {
    await page.goto('/en/contact');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(
      page.getByRole('alert').filter({ hasText: 'Some details are missing.' }),
    ).toHaveText('Some details are missing. Check the 5 fields marked below.');
    await expect(page.getByLabel('Name', { exact: true })).toHaveAccessibleDescription(
      'Please enter your name.',
    );
  });
});

test.describe('envío', () => {
  test('correcto: «¡Recibido!» con foco, sustituye al formulario y «Enviar otro mensaje» lo reinicia', async ({
    page,
  }) => {
    await page.goto('/contacto');
    await fillValid(page);
    await ageForm(page);
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();

    const heading = page.getByRole('heading', { name: '¡Recibido!' });
    await expect(heading).toBeFocused();
    const status = page.getByRole('status');
    await expect(status).toContainText('Mensaje enviado');
    await expect(status).toContainText(
      'Te escribo en menos de 24 h. Si es urgente, escríbeme por WhatsApp.',
    );
    await expect(page.locator('form')).toHaveCount(0);
    await expect(status.getByRole('link', { name: /Escribir por WhatsApp/ })).toHaveAttribute(
      'href',
      /wa\.me/,
    );
    await expect(status.getByRole('link', { name: /puedes ver mis trabajos/ })).toHaveAttribute(
      'href',
      '/trabajos',
    );
    await axeCheck(page);

    await status.getByRole('link', { name: 'Enviar otro mensaje' }).click();
    await expect(page.getByLabel('Nombre', { exact: true })).toBeFocused();
    await expect(page.getByLabel('Nombre', { exact: true })).toHaveValue('');
    await expect(page.getByLabel('Cuéntame tu proyecto')).toHaveValue('');
    await expect(page.getByRole('checkbox', { name: /política de privacidad/ })).not.toBeChecked();
  });

  test('con error del servidor: aviso, datos conservados y se puede reintentar', async ({
    page,
  }) => {
    await page.goto('/contacto');
    await fillValid(page, { message: 'Hola [[fail]]' });
    await page.getByLabel(/Web actual/).fill('hb.es');
    await ageForm(page);
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();

    await expect(failure(page)).toBeVisible();
    await expect(failure(page)).toContainText(
      'Inténtalo de nuevo o escríbeme a contacto@terryq.com.',
    );
    await expect(failure(page).getByRole('link', { name: 'contacto@terryq.com' })).toHaveAttribute(
      'href',
      'mailto:contacto@terryq.com',
    );
    await expect(page.getByLabel('Nombre', { exact: true })).toHaveValue('Ana García');
    await expect(page.getByLabel('Email o teléfono')).toHaveValue('ana@ejemplo.com');
    await expect(page.getByLabel('Cuéntame tu proyecto')).toHaveValue('Hola [[fail]]');
    await expect(page.getByLabel(/Web actual/)).toHaveValue('hb.es');
    await expect(page.getByRole('checkbox', { name: /política de privacidad/ })).toBeChecked();
    await expect(page.getByRole('radio', { name: 'Rediseñar mi web' })).toBeChecked();
    await expect(page.getByRole('button', { name: 'Enviar mensaje' })).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );

    await page.getByLabel('Cuéntame tu proyecto').fill('Ahora sí.');
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(page.getByRole('heading', { name: '¡Recibido!' })).toBeFocused();
  });

  test('campo trampa relleno: éxito falso', async ({ page }) => {
    await page.goto('/contacto');
    await fillValid(page);
    await page
      .locator('input[name="company"]')
      .evaluate((input: HTMLInputElement) => (input.value = 'Spam S.L.'));
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(page.getByRole('heading', { name: '¡Recibido!' })).toBeFocused();
  });

  test('en inglés el éxito sale en inglés', async ({ page }) => {
    await page.goto('/en/contact');
    await page.getByLabel('Name', { exact: true }).fill('Ana');
    await page.getByLabel('Email or phone').fill('+34 600 000 000');
    await page.locator('label', { hasText: 'Job opportunity' }).click();
    await page.getByLabel('Tell me about your project').fill('Hello');
    await page.getByRole('checkbox', { name: /privacy policy/ }).check();
    await ageForm(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByRole('heading', { name: 'Got it!' })).toBeFocused();
    await expect(
      page.getByRole('status').getByRole('link', { name: /Message me on WhatsApp/ }),
    ).toBeVisible();
  });
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('el envío funciona y la página vuelve con el mensaje de éxito', async ({ page }) => {
    await page.goto('/contacto');
    await fillValid(page);
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(page.getByRole('heading', { name: '¡Recibido!' })).toBeVisible();
    await expect(page.getByRole('status')).toContainText('Mensaje enviado');
    // «Enviar otro mensaje» es un enlace a la página: lleva a un formulario nuevo.
    await page.getByRole('link', { name: 'Enviar otro mensaje' }).click();
    await expect(page.getByLabel('Nombre', { exact: true })).toHaveValue('');
  });

  test('un envío inválido vuelve con el resumen, los mensajes y los datos escritos', async ({
    page,
  }) => {
    await page.goto('/contacto');
    await page.getByLabel('Nombre', { exact: true }).fill('Ana');
    await page.getByLabel('Email o teléfono').fill('ana@');
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();

    await expect(summary(page)).toContainText('Revisa los 4 campos marcados abajo.');
    await expect(page.getByLabel('Nombre', { exact: true })).toHaveValue('Ana');
    await expect(page.getByLabel('Email o teléfono')).toHaveValue('ana@');
    await expect(page.getByLabel('Email o teléfono')).toHaveAccessibleDescription(
      'Revisa el formato: un email (tu@email.com) o un teléfono.',
    );
  });

  test('un error del servidor vuelve con el aviso y los datos', async ({ page }) => {
    await page.goto('/contacto');
    await fillValid(page, { message: '[[fail]]' });
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(failure(page)).toBeVisible();
    await expect(page.getByLabel('Cuéntame tu proyecto')).toHaveValue('[[fail]]');
  });
});
