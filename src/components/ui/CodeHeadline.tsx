import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type CodeHeadlineProps = {
  as: 'h1' | 'blockquote';
  /** Texto en una sola línea. Si se pasa `lines`, se ignora. */
  children?: ReactNode;
  /** Dos líneas, cada una dentro de su máscara para la animación del hero (spec §6.6). */
  lines?: readonly [string, string];
  className?: string;
};

const sizes = { h1: 'type-hero', blockquote: 'type-quote' } as const;

const bracket = 'font-mono font-normal text-ink-subtle tracking-[-0.08em]';

/** Titular con los signos `< >` decorativos: el nombre accesible es solo el texto. */
export function CodeHeadline({ as: Tag, children, lines, className }: CodeHeadlineProps) {
  return (
    <Tag className={cn(sizes[Tag], 'text-ink', className)}>
      {lines ? (
        <>
          <span className="block overflow-clip">
            <span className="block">
              <span aria-hidden="true" className={bracket}>
                &lt;
              </span>
              {lines[0]}
            </span>
          </span>
          <span className="block overflow-clip">
            <span className="block">
              {lines[1]}
              <span aria-hidden="true" className={bracket}>
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
