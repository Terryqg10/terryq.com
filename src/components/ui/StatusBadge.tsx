import { cn } from '@/lib/cn';

export type StatusBadgeProps = {
  status: 'live' | 'demo';
  /** Siempre acompañado de la palabra: el punto por sí solo no basta. */
  label: string;
  /** Texto en `ink-muted` (filas de prueba y pies de captura) en vez de `ink`. */
  muted?: boolean;
};

export function StatusBadge({ status, label, muted = false }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-meta',
        muted ? 'text-ink-muted' : 'text-ink',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-2 rounded-full',
          status === 'live' ? 'bg-live' : 'border border-ink-muted',
        )}
      />
      {label}
    </span>
  );
}
