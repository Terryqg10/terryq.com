import type { WorkMeta } from '@/content/types';
import colorKit from '@/content/work/hb-construcciones/images/brand-kit/color.svg';
import iconKit from '@/content/work/hb-construcciones/images/brand-kit/icono.svg';
import monochromeKit from '@/content/work/hb-construcciones/images/brand-kit/monocromo.svg';
import reversedKit from '@/content/work/hb-construcciones/images/brand-kit/negativo.svg';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { sectionIds, type CaseSectionKind } from './sections';

/**
 * Componentes del MDX de los casos (spec §9.2). Aquí solo está la semántica; el estilo se añade
 * en la tarea de la página de caso.
 */

export function CaseSection({ kind, children }: { kind: CaseSectionKind; children: ReactNode }) {
  const locale = useLocale();
  const t = useTranslations('case.sections');
  const id = sectionIds[kind][locale];
  const headingId = `${id}-titulo`;

  if (kind === 'developers') {
    return (
      <section id={id} aria-labelledby={headingId}>
        <details>
          <summary>
            <h2 id={headingId}>{t(kind)}</h2>
          </summary>
          <dl>{children}</dl>
        </details>
      </section>
    );
  }

  return (
    <section id={id} aria-labelledby={headingId}>
      <h2 id={headingId}>{t(kind)}</h2>
      {children}
    </section>
  );
}

/** Idea en negrita (`title`) + explicación (`children`). */
export function SolutionItem({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

/** Fila del `<dl>` de «Para desarrolladores». */
export function DevItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/** Los 4 tiles del kit de logo de HB (spec §9.5), con SVG sin optimizar. */
export function BrandKit() {
  const t = useTranslations('case.brandKit');
  const tiles = [
    { key: 'color', src: colorKit },
    { key: 'reversed', src: reversedKit },
    { key: 'monochrome', src: monochromeKit },
    { key: 'icon', src: iconKit },
  ] as const;

  return (
    <ul>
      {tiles.map(({ key, src }) => (
        <li key={key}>
          <figure>
            <Image src={src} alt="" unoptimized />
            <figcaption>{t(key)}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

/**
 * Componentes de un caso concreto. `SolutionMedia` necesita sus imágenes (`meta.images.pieces`),
 * así que se crea a partir del `meta` del caso.
 */
export function createWorkMdxComponents(meta: WorkMeta) {
  function SolutionMedia({ pieces }: { pieces: readonly number[] }) {
    const locale = useLocale();
    return (
      <>
        {pieces.map((index) => {
          const piece = meta.images.pieces[index];
          if (!piece) throw new Error(`${meta.slug}: no hay pieza ${index} en meta.images.pieces`);
          return (
            <figure key={index}>
              <Image src={piece.src} alt={piece.alt[locale]} />
            </figure>
          );
        })}
      </>
    );
  }

  return { CaseSection, SolutionItem, DevItem, BrandKit, SolutionMedia };
}
