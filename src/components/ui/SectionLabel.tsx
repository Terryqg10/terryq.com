export type SectionLabelProps = {
  /** `route` lleva `/` delante y `anchor` lleva `#`. */
  kind: 'route' | 'anchor';
  children: string;
};

/** Etiqueta mono de sección. Es texto (un `<p>`), no un enlace. */
export function SectionLabel({ kind, children }: SectionLabelProps) {
  return (
    <p className="text-meta text-ink-muted">
      <span className="text-accent">{kind === 'route' ? '/' : '#'}</span>
      {children}
    </p>
  );
}
