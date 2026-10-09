import { cn } from '@/lib/cn';

/** Clases de una tarjeta. También las usa el enlace que es, él mismo, la tarjeta entera. */
export function cardClasses({
  interactive = false,
  className,
}: { interactive?: boolean; className?: string } = {}) {
  return cn(
    'rounded-2xl border border-line bg-surface shadow-sm',
    interactive &&
      'transition-[box-shadow,border-color] duration-250 hover:border-line-strong hover:shadow-md',
    className,
  );
}
