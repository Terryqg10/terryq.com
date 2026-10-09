import type { ReactNode } from 'react';
import { cardClasses } from './card-classes';

type CardProps = {
  as?: 'div' | 'article' | 'section' | 'li' | 'aside';
  /** Con hover: `shadow-md` y borde `line-strong` (250ms). */
  interactive?: boolean;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
  /** Una tarjeta que se desplaza por dentro es una región enfocable (`region` + `tabIndex={0}`). */
  role?: 'region';
  tabIndex?: 0;
};

export function Card({
  as: Tag = 'div',
  interactive = false,
  children,
  className,
  'aria-label': ariaLabel,
  role,
  tabIndex,
}: CardProps) {
  return (
    <Tag
      aria-label={ariaLabel}
      role={role}
      tabIndex={tabIndex}
      className={cardClasses({ interactive, className })}
    >
      {children}
    </Tag>
  );
}
