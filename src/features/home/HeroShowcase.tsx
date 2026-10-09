'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** Máxima inclinación añadida al estado de reposo, en grados (spec §6.6). */
const MAX_TILT = 4;
/** Suavizado por fotograma: llega a ~95% en ~150ms a 60fps. */
const EASE = 0.18;

/**
 * Inclinación 3D que sigue al ratón (spec §6.6). Solo con `(hover: hover) and (pointer: fine)` y
 * desde `lg`, que es donde la captura se inclina; el estado de reposo y el aplanado con el scroll
 * son CSS (`.tq-showcase` en `globals.css`). Esta isla solo añade un giro extra, por eso va en un
 * elemento interior: no se pisa con la animación del scroll.
 */
export function HeroShowcase({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = outer.current;
    const layer = tilt.current;
    if (!host || !layer) return;
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    if (!media.matches) return;

    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let frame = 0;

    const render = () => {
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      layer.style.transform = `perspective(1200px) rotateY(${current.y.toFixed(3)}deg) rotateX(${current.x.toFixed(3)}deg)`;
      const settled =
        Math.abs(target.x - current.x) < 0.01 && Math.abs(target.y - current.y) < 0.01;
      frame = settled ? 0 : requestAnimationFrame(render);
    };
    const kick = () => {
      if (frame === 0) frame = requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      const { left, top, width, height } = host.getBoundingClientRect();
      const nx = ((event.clientX - left) / width - 0.5) * 2; // -1 … 1
      const ny = ((event.clientY - top) / height - 0.5) * 2;
      target.y = Math.max(-1, Math.min(1, nx)) * MAX_TILT;
      target.x = -Math.max(-1, Math.min(1, ny)) * MAX_TILT;
      kick();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      kick();
    };

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    return () => {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={outer} className="tq-showcase">
      <div ref={tilt} className="tq-showcase-tilt">
        {children}
      </div>
    </div>
  );
}
