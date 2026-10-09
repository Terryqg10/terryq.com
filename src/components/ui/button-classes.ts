import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'md' | 'lg';

const variants = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border border-line-strong text-ink hover:border-ink',
} as const;

const sizes = {
  md: 'min-h-11 px-5',
  lg: 'min-h-13 px-6',
} as const;

/** Clases de un botón. También las usan los enlaces con aspecto de botón dentro de islas cliente. */
export function buttonClasses({
  variant,
  size = 'md',
  className,
}: {
  variant: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    'text-button inline-flex items-center justify-center gap-2.5 rounded-full transition-colors duration-150 disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  );
}
