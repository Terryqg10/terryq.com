/** Tema elegido a mano por el visitante (ADR-0012). Sin elección, manda `prefers-color-scheme`. */
export type Theme = 'light' | 'dark';

export const themeStorageKey = 'tq-theme';

export const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

/**
 * Script en línea del `<head>`: aplica la elección guardada a `<html data-theme>` antes del primer
 * pintado, para que no haya parpadeo. Si no hay elección o el navegador bloquea el almacenamiento,
 * no hace nada y el tema sigue al sistema.
 */
export const themeInitScript = `try{var t=localStorage.getItem('${themeStorageKey}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;
