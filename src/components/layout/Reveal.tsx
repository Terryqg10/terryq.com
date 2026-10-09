'use client';

import { usePathname } from '@/i18n/navigation';
import { useEffect } from 'react';

/**
 * Apariciones de las secciones al hacer scroll (spec §6.6). Un único `IntersectionObserver`
 * para toda la página.
 *
 * **Cómo marcar una sección:** añade el atributo `data-reveal` a su elemento raíz
 * (`<section data-reveal>`). No hace falta nada más. Excepciones (CA-G9): el hero y las
 * cabeceras de página no se marcan.
 *
 * - Sin JavaScript, o con `prefers-reduced-motion: reduce`, todo es visible y no se mueve.
 * - Lo que ya está en pantalla al cargar no se anima.
 * - Lo que está más abajo recibe `data-reveal="pending"` (invisible, 12px más abajo) y pasa a
 *   `data-reveal="done"` al entrar en pantalla. Se anima una sola vez.
 * - Los estilos están en `globals.css` (450ms `ease-tq`; 300ms por debajo de `md`).
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = document.querySelectorAll<HTMLElement>('[data-reveal=""],[data-reveal="true"]');
    const pending: HTMLElement[] = [];
    for (const element of targets) {
      const { top, bottom } = element.getBoundingClientRect();
      const onScreen = top < window.innerHeight && bottom > 0;
      if (onScreen) continue; // ya visible al cargar: no se anima
      element.dataset.reveal = 'pending';
      pending.push(element);
    }
    if (pending.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          element.dataset.reveal = 'done';
          observer.unobserve(element); // una sola vez
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    for (const element of pending) observer.observe(element);

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
