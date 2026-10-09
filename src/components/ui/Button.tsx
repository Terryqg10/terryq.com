import { cn } from '@/lib/cn';
import type { ComponentProps, ReactNode } from 'react';
import { ActionLink, type LinkTarget } from './action-link';

type ButtonBase = {
  variant: 'primary' | 'secondary';
  /** `md` mide 44px y `lg` 52px (spec §7.1). */
  size?: 'md' | 'lg';
  children: ReactNode;
  className?: string;
};

/** Con `href`: un enlace. No admite `type` ni `onClick`. */
type ButtonAsLink = ButtonBase & LinkTarget & { type?: never; onClick?: never; disabled?: never };

/** Con `type`: un `<button>`. No admite `href`, `external` ni `download`. */
type ButtonAsButton = ButtonBase & {
  href?: never;
  external?: never;
  download?: never;
  type: 'button' | 'submit';
} & Pick<ComponentProps<'button'>, 'onClick' | 'disabled' | 'aria-busy' | 'aria-label' | 'id'>;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

const variants = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border border-line-strong text-ink hover:border-ink',
} as const;

const sizes = {
  md: 'min-h-11 px-5',
  lg: 'min-h-13 px-6',
} as const;

/** Máximo un `primary` por pantalla (DS · Color). */
export function Button(props: ButtonProps) {
  const { variant, size = 'md', className, children } = props;
  const classes = cn(
    'text-button inline-flex items-center justify-center gap-2.5 rounded-full transition-colors duration-150 disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  );

  if (props.type === undefined) {
    return (
      <ActionLink target={props} className={classes}>
        {children}
      </ActionLink>
    );
  }

  return (
    <button
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-busy={props['aria-busy']}
      aria-label={props['aria-label']}
      id={props.id}
      className={classes}
    >
      {children}
    </button>
  );
}
