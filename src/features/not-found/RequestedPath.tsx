'use client';

import { useSyncExternalStore } from 'react';

const maxLength = 60;

const subscribe = () => () => {};
const readPath = () => window.location.pathname;
/** En el servidor la ruta pedida no se conoce (la página es estática): no se pinta. */
const readServerPath = () => '';

/** La ruta tal como la escribió el visitante, sin `%xx`, recortada a 60 caracteres. */
function display(path: string): string {
  let text = path;
  try {
    text = decodeURIComponent(path);
  } catch {
    // Una secuencia `%` mal formada: se deja la ruta tal cual.
  }
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

/**
 * Línea mono `/<ruta pedida> → 404` (spec §8.7, UI36). La ruta se lee en el cliente; React escapa
 * el texto. Sin JavaScript solo queda el `404`.
 */
export function RequestedPath() {
  const path = useSyncExternalStore(subscribe, readPath, readServerPath);

  return (
    <p className="inline-flex items-center gap-3 text-meta text-ink-muted">
      {path ? (
        <>
          <span className="min-w-0 break-all">
            <span className="text-accent">/</span>
            {display(path).slice(1)}
          </span>
          <span aria-hidden="true">→</span>
        </>
      ) : null}
      <span className="text-danger">404</span>
    </p>
  );
}
