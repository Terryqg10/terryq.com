import { cn } from '@/lib/cn';
import { AlertCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

/** Props comunes de `TextField` y `TextArea` (spec §7.1). */
export type FieldBaseProps = {
  id: string;
  label: string;
  name: string;
  optional?: boolean;
  /** Mensaje de error ya traducido. Con error: `aria-invalid`, borde `danger` e icono. */
  error?: string;
  /** `id` de otro texto de ayuda que también describe el campo. */
  describedById?: string;
};

export const errorId = (id: string) => `${id}-error`;

/** `aria-describedby` con la ayuda y el error, si los hay. */
export function describedBy(id: string, error?: string, describedById?: string) {
  return [describedById, error ? errorId(id) : undefined].filter(Boolean).join(' ') || undefined;
}

export const controlClasses = (hasError: boolean) =>
  cn(
    'text-body block min-h-12 w-full rounded-xl border bg-surface px-3.5 py-3 text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-ink-muted focus:outline-none focus:ring-3',
    hasError
      ? 'border-danger focus:border-danger focus:ring-danger/15'
      : 'border-line-strong hover:border-ink focus:border-accent focus:ring-accent-soft',
  );

export function ErrorMessage({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-small text-danger">
      <AlertCircle aria-hidden="true" size={20} strokeWidth={1.75} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/** Etiqueta visible con «Opcional» / «Optional» si el campo no es obligatorio. */
export async function FieldLabel({
  htmlFor,
  optional,
  children,
}: {
  htmlFor: string;
  optional?: boolean;
  children: ReactNode;
}) {
  const t = await getTranslations('contact');
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline gap-2 text-button">
      {children}
      {optional ? (
        <span className="text-small font-normal text-ink-muted">{t('optional')}</span>
      ) : null}
    </label>
  );
}
