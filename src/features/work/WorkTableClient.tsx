'use client';

import { cn } from '@/lib/cn';
import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

export type WorkFilter = 'all' | 'web' | 'brand';

export type WorkTableClientProps = {
  labels: {
    group: string;
    all: string;
    web: string;
    brand: string;
    /** Texto del anuncio `aria-live`, ya traducido para cada contador. */
    live: Record<WorkFilter, string>;
  };
  counts: Record<WorkFilter, number>;
  /** Imagen de la vista previa de cada caso, por slug. */
  previews: Record<string, StaticImageData>;
  /** La tabla de proyectos, renderizada en el servidor. */
  children: ReactNode;
};

const PREVIEW_WIDTH = 340;
const OFFSET = 24;
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

/**
 * Filtros y vista previa flotante de /trabajos (spec §8.2, §6.6). Las filas llegan ya pintadas
 * desde el servidor: filtrar es poner `data-filter` aquí y un par de reglas CSS ocultan las que no
 * encajan, así que sin JavaScript se ven todas y los filtros no se muestran.
 */
export function WorkTableClient({ labels, counts, previews, children }: WorkTableClientProps) {
  const [filter, setFilter] = useState<WorkFilter>('all');
  // false en el servidor y en la hidratación, true después: los filtros solo existen con JS.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [slug, setSlug] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const sideX = useRef<HTMLDivElement>(null);
  const sideY = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current;
    const x = sideX.current;
    const y = sideY.current;
    if (!host || !x || !y) return;
    const media = window.matchMedia(FINE_POINTER);
    if (!media.matches) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const rowOf = (target: EventTarget | null) =>
      target instanceof Element ? target.closest<HTMLElement>('[data-row]') : null;

    const place = (row: HTMLElement, pointerX: number | null) => {
      const rect = row.getBoundingClientRect();
      const bounds = host.getBoundingClientRect();
      // Con movimiento reducido aparece fija, junto al borde de la tabla, sin desplazarse.
      const left =
        reduced.matches || pointerX === null
          ? bounds.right - PREVIEW_WIDTH - OFFSET
          : Math.min(pointerX + OFFSET, window.innerWidth - PREVIEW_WIDTH - OFFSET);
      x.style.transform = `translateX(${left}px)`;
      y.style.transform = `translateY(${rect.top + rect.height / 2}px)`;
    };

    const show = (row: HTMLElement, pointerX: number | null) => {
      setSlug(row.dataset.slug ?? null);
      place(row, pointerX);
    };
    const hide = () => setSlug(null);

    const onMove = (event: PointerEvent) => {
      const row = rowOf(event.target);
      if (row) show(row, event.clientX);
      else hide();
    };
    const onFocus = (event: FocusEvent) => {
      const row = rowOf(event.target);
      if (row) show(row, null);
    };

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', hide);
    host.addEventListener('focusin', onFocus);
    host.addEventListener('focusout', hide);
    return () => {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', hide);
      host.removeEventListener('focusin', onFocus);
      host.removeEventListener('focusout', hide);
    };
  }, []);

  const options: { value: WorkFilter; label: string }[] = [
    { value: 'all', label: labels.all },
    { value: 'web', label: labels.web },
    { value: 'brand', label: labels.brand },
  ];
  const preview = slug ? previews[slug] : undefined;

  return (
    <div ref={root} data-filter={filter}>
      <div
        role="group"
        aria-label={labels.group}
        hidden={!mounted}
        className="mb-6 flex flex-wrap gap-2"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={filter === option.value}
            onClick={() => setFilter(option.value)}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-button transition-colors duration-150',
              filter === option.value
                ? 'border-ink bg-ink text-paper'
                : 'border-line-strong text-ink hover:border-ink',
            )}
          >
            {option.label}
            <span className="text-meta">{counts[option.value]}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {mounted ? labels.live[filter] : ''}
      </p>

      {children}

      {/* Vista previa: decorativa (`aria-hidden`), solo con puntero fino. */}
      <div
        ref={sideX}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-30 hidden [@media(hover:hover)_and_(pointer:fine)]:block"
      >
        <div ref={sideY} className="transition-transform duration-250 ease-tq">
          <div
            className={cn(
              'w-85 -translate-y-1/2 -rotate-2 rounded-xl border border-line bg-surface p-1.5 shadow-md transition-[opacity,scale] duration-250 ease-tq',
              preview ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
            )}
          >
            {preview ? (
              <Image
                src={preview}
                alt=""
                sizes="340px"
                className="block aspect-[16/10] w-full rounded-lg bg-surface-sunken object-cover object-top"
              />
            ) : (
              <div className="aspect-[16/10] w-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
