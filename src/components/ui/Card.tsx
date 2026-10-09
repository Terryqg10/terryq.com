import type { ReactNode } from 'react';
import { cardClasses } from './card-classes';

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
    <Tag aria-label={ariaLabel} className={cardClasses({ interactive, className })}>
      {children}
    </Tag>
  );
}
