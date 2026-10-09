import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type ContainerProps = {
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main' | 'article';
  children: ReactNode;
  className?: string;
};

/** Contenido centrado en `max-w-content`, con márgenes de 16/24/40px (spec §6.2). */
export function Container({ as: Tag = 'div', children, className }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full max-w-content px-4 md:px-6 lg:px-10', className)}>
      {children}
    </Tag>
  );
}
