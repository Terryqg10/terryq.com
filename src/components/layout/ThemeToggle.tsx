'use client';

import { isTheme, themeStorageKey, type Theme } from '@/lib/theme';
import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';

const darkQuery = '(prefers-color-scheme: dark)';

/** Cambia cuando el visitante pulsa el botón (atributo de `<html>`) o cuando cambia el sistema. */
function subscribe(notify: () => void) {
  const media = window.matchMedia(darkQuery);
  media.addEventListener('change', notify);
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => {
    media.removeEventListener('change', notify);
    observer.disconnect();
  };
}

function currentTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (isTheme(chosen)) return chosen;
  return window.matchMedia(darkQuery).matches ? 'dark' : 'light';
}

/**
 * Botón de modo oscuro (ADR-0012, spec §6.4). Es un interruptor: `aria-pressed` indica si el modo
 * oscuro está activo. Guarda la elección en `localStorage` (sin cookies) y la aplica en
 * `<html data-theme>`. El icono lo decide el CSS (`tq-theme-sun` / `tq-theme-moon`), de modo que
 * es correcto desde el primer pintado, sin esperar a que se hidrate la página.
 */
export function ThemeToggle({ label }: { label: string }) {
  const theme = useSyncExternalStore(subscribe, currentTheme, (): Theme => 'light');

  function toggle() {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(themeStorageKey, next);
    } catch {
      // Almacenamiento bloqueado: el cambio vale para esta visita.
    }
  }

  return (
    <button
      type="button"
      aria-pressed={theme === 'dark'}
      aria-label={label}
      onClick={toggle}
      className="inline-flex size-11 items-center justify-center rounded-full text-ink-muted hover:text-ink"
    >
      <Moon aria-hidden="true" size={20} strokeWidth={1.75} className="tq-theme-moon" />
      <Sun aria-hidden="true" size={20} strokeWidth={1.75} className="tq-theme-sun" />
    </button>
  );
}
