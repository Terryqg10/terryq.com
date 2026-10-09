import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type CardProps = {
  as?: 'div' | 'article' | 'section' | 'li' | 'aside';
  /** Con hover: `shadow-md` y borde `line-strong` (250ms). */
  interactive?: boolean;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
};

export function Card({
  as: Tag = 'div',
  interactive = false,
  children,
  className,
  'aria-label': ariaLabel,
}: CardProps) {
  return (
    <Tag
      aria-label={ariaLabel}
      className={cn(
        'rounded-2xl border border-line bg-surface shadow-sm',
        interactive &&
          'transition-[box-shadow,border-color] duration-250 hover:border-line-strong hover:shadow-md',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
