import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';
import { ActionLink, type LinkTarget } from './action-link';

export type TextLinkProps = LinkTarget & {
  children: ReactNode;
  /** Dentro de un párrafo: subrayado siempre visible (WCAG 1.4.1, spec §6.5). */
  inline?: boolean;
  className?: string;
};

export function TextLink({ children, inline = false, className, ...target }: TextLinkProps) {
  return (
    <ActionLink
      target={target}
      className={cn(inline ? 'underline underline-offset-4' : 'tq-link', className)}
    >
      {children}
    </ActionLink>
  );
}
