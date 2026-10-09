import { defineConfig, devices } from '@playwright/test';

// Capturas de todas las páginas para la revisión visual con Terry (spec §17.3, T24).
// No forma parte de `pnpm e2e`: se lanza con `pnpm capture:pages`.
const PORT = 3101;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: false,
  workers: 1,
  timeout: 15 * 60_000,
  reporter: 'list',
  use: { baseURL, ...devices['Desktop Chrome'] },
  projects: [{ name: 'capturas' }],
  webServer: {
    command: `pnpm build && pnpm start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: {
      CONTACT_TRANSPORT: 'mock',
      CONTACT_TO_EMAIL: 'contacto@terryq.com',
      CONTACT_FROM_EMAIL: 'Web terryq.com <formulario@envios.terryq.com>',
      NEXT_PUBLIC_SITE_URL: baseURL,
    },
  },
});
