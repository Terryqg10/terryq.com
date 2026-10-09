import { clsx, type ClassValue } from 'clsx';

/** Une clases condicionales. No se usa `tailwind-merge` (spec §3). */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
