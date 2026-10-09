import { cn } from '@/lib/cn';

export type StatusBadgeProps = {
  status: 'live' | 'demo';
  /** Siempre acompañado de la palabra: el punto por sí solo no basta. */
  label: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 text-meta text-ink">
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
