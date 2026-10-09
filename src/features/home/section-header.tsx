import { SectionLabel } from '@/components/ui/SectionLabel';
import type { ReactNode } from 'react';

/** Cabecera de una sección de Inicio: etiqueta mono, h2, entradilla opcional y un enlace a la derecha. */
export function SectionHeader({
  label,
  id,
  title,
  intro,
  action,
}: {
  /** Etiqueta con la barra: `route` = ruta pública sin la barra inicial. */
  label: string;
  id: string;
  title: string;
  intro?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-12">
      <div className="flex max-w-160 flex-col gap-3">
        <SectionLabel kind="route">{label}</SectionLabel>
        <h2 id={id} className="type-section">
          {title}
        </h2>
        {intro ? <p className="text-[17px]/7 text-ink-muted">{intro}</p> : null}
      </div>
      {action}
    </div>
  );
}
