import { describe, expect, it } from 'vitest';
import type { ButtonProps } from '@/components/ui/Button';

// Estas comprobaciones las hace `pnpm typecheck`: si un @ts-expect-error deja de ser un error, falla.
describe('tipo de Button', () => {
  it('admite href o type, pero no los dos a la vez', () => {
    const link: ButtonProps = { variant: 'primary', href: '/work', children: 'Ver' };
    const button: ButtonProps = { variant: 'secondary', type: 'submit', children: 'Enviar' };

    // @ts-expect-error href y type son excluyentes
    const both: ButtonProps = { variant: 'primary', href: '/work', type: 'button', children: 'x' };

    // @ts-expect-error un botón sin href ni type no tiene sentido
    const neither: ButtonProps = { variant: 'primary', children: 'x' };

    // @ts-expect-error un enlace no admite onClick
    const linkWithClick: ButtonProps = {
      variant: 'primary',
      href: '/work',
      onClick: () => {},
      children: 'x',
    };

    expect([link, button, both, neither, linkWithClick]).toHaveLength(5);
  });

  it('un enlace externo o de descarga pide una URL de texto', () => {
    const external: ButtonProps = {
      variant: 'primary',
      href: 'https://example.com',
      external: true,
      children: 'x',
    };
    const download: ButtonProps = {
      variant: 'primary',
      href: '/cv/a.pdf',
      download: 'a.pdf',
      children: 'x',
    };

    const wrong: ButtonProps = {
      variant: 'primary',
      // @ts-expect-error external exige una URL en texto, no una ruta tipada
      href: { pathname: '/work' },
      external: true,
      children: 'x',
    };

    expect([external, download, wrong]).toHaveLength(3);
  });
});
