import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type CodeHeadlineProps = {
  as: 'h1' | 'blockquote';
  id?: string;
  /** Texto en una sola línea. Si se pasa `lines`, se ignora. */
  children?: ReactNode;
  /**
   * Dos líneas, cada una dentro de su máscara: suben desde abajo con 60ms de desfase y los `< >`
   * aparecen al final (spec §6.6). El texto nunca parte de `opacity: 0`, para que cuente para el
   * LCP desde el primer fotograma.
   */
  lines?: readonly [string, string];
  className?: string;
};

const sizes = { h1: 'type-hero', blockquote: 'type-quote' } as const;

const bracket = 'font-mono font-normal text-ink-subtle tracking-[-0.08em]';

/** Titular con los signos `< >` decorativos: el nombre accesible es solo el texto. */
export function CodeHeadline({ as: Tag, id, children, lines, className }: CodeHeadlineProps) {
  return (
    <Tag id={id} className={cn(sizes[Tag], 'text-ink', className)}>
      {lines ? (
        <>
          <span className="block overflow-clip">
            <span className="block tq-rise">
              <span aria-hidden="true" className={cn(bracket, 'tq-fade-in [--tq-delay:660ms]')}>
                &lt;
              </span>
              {lines[0]}
            </span>
          </span>
          {/* El espacio mantiene «Desarrollador web» como nombre accesible. */}{' '}
          <span className="block overflow-clip">
            <span className="block tq-rise [--tq-delay:60ms]">
              {lines[1]}
              <span aria-hidden="true" className={cn(bracket, 'tq-fade-in [--tq-delay:660ms]')}>
                &gt;
              </span>
            </span>
          </span>
        </>
      ) : (
        <>
          <span aria-hidden="true" className={bracket}>
            &lt;
          </span>
          {children}
          <span aria-hidden="true" className={bracket}>
            &gt;
          </span>
        </>
      )}
    </Tag>
  );
}
