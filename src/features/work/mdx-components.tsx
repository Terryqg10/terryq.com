import type { WorkMeta, WorkSlug } from '@/content/types';
import { brandKitTiles } from '@/content/work/hb-construcciones/brand-kit';
import { cn } from '@/lib/cn';
import { ChevronDown } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import type { ComponentProps, ReactNode } from 'react';
import { CaseTestimonial } from './CaseTestimonial';
import { sectionIds, type CaseSectionKind } from './sections';

/**

/** Pies de las piezas de «La solución» por caso (claves de `messages.case.pieces`). */
const pieceCaptions = {
  'hb-construcciones': ['hb0', 'hb1'],
} as const satisfies Partial<Record<WorkSlug, readonly string[]>>;

export async function CaseSection({
  kind,
  number: sectionNumber,
  testimonial,
  children,
}: {
  kind: CaseSectionKind;
  /** 01, 02… según el orden de las secciones presentes (lo calcula la página en el build). */
  number?: string;
  testimonial?: ReactNode;
  children: ReactNode;
}) {
  const locale = await getLocale();
  const t = await getTranslations('case.sections');
  const id = sectionIds[kind][locale];
  const headingId = `${id}-titulo`;
  const number = (
    <span aria-hidden="true" className="text-meta text-accent">
      {sectionNumber}
    </span>
  );

  if (kind === 'developers') {
    return (
      <section id={id} aria-labelledby={headingId} data-reveal className="scroll-mt-24">
        <details className="group rounded-2xl border border-line bg-surface shadow-sm">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-4 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-4">
              {number}
              <h2 id={headingId} className="type-section-sm">
                {t(kind)}
              </h2>
            </span>
            <ChevronDown
              aria-hidden="true"
              size={20}
              strokeWidth={1.75}
              className="shrink-0 transition-transform duration-250 group-open:rotate-180"
            />
          </summary>
          <dl className="border-t border-line px-6">{children}</dl>
        </details>
      </section>
    );
  }

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-reveal
      className="flex scroll-mt-24 flex-col gap-4"
    >
      {number}
      <h2 id={headingId} className="type-section-sm">
        {t(kind)}
      </h2>
      {kind === 'solution' ? <div className="flex flex-col">{children}</div> : children}
      {kind === 'outcome' ? testimonial : null}
    </section>
  );
}

/** Idea en negrita (`title`, 4 columnas) + explicación (`children`, 8 columnas). */
export function SolutionItem({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-1 border-b border-line py-4.5 first:border-t">
      <h3 className="col-span-12 text-base/6.5 font-semibold md:col-span-4">{title}</h3>
      {children ? (
        <div className="col-span-12 md:col-span-8 [&>p]:text-base/6.5">{children}</div>
      ) : null}
    </div>
  );
}

/** Fila del `<dl>` de «Para desarrolladores». */
export function DevItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-1 border-b border-line py-4 last:border-b-0">
      <dt className="col-span-12 text-meta text-ink-muted sm:col-span-3">{label}</dt>
      <dd className="col-span-12 sm:col-span-9 [&>p]:text-[15px]/6 [&>p]:text-ink">{children}</dd>
    </div>
  );
}

/** Los 4 tiles del kit de logo de HB (spec §9.5): SVG sin optimizar sobre su fondo propio. */
export async function BrandKit() {
  const t = await getTranslations('case.brandKit');
  const alt = await getTranslations('case.brandKitAlt');

  return (
    <ul className="mt-2 grid grid-cols-2 gap-3">
      {brandKitTiles.map(({ key, src, background, caption, logoWidth, bordered }) => (
        <li key={key}>
          <figure
            style={{ backgroundColor: background }}
            className={cn(
              'relative m-0 grid aspect-[16/10] place-items-center rounded-xl',
              bordered && 'border border-line',
            )}
          >
            <Image
              src={src}
              alt={alt(key)}
              unoptimized
              style={{ width: logoWidth, height: 'auto' }}
            />
            <figcaption
              style={{ color: caption }}
              className="absolute bottom-2.5 left-3.5 font-mono text-[11px]/4"
            >
              {t(key)}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

/**
 * Componentes de un caso concreto. `SolutionMedia` necesita sus imágenes (`meta.images.pieces`) y
 * `CaseSection`, su testimonio, así que se crean a partir del `meta` del caso.
 */
export function createWorkMdxComponents(
  meta: WorkMeta,
  numbers: Partial<Record<CaseSectionKind, string>>,
) {
  const captions: readonly string[] =
    meta.slug in pieceCaptions ? pieceCaptions[meta.slug as keyof typeof pieceCaptions] : [];

  async function SolutionMedia({ pieces }: { pieces: readonly number[] }) {
    const locale = await getLocale();
    const t = await getTranslations('case.pieces');

    return (
      <div className="mt-4 grid grid-cols-12 gap-4">
        {pieces.map((index) => {
          const piece = meta.images.pieces[index];
          if (!piece) throw new Error(`${meta.slug}: no hay pieza ${index} en meta.images.pieces`);
          const caption = captions[index];
          const isPhone = piece.src === meta.images.mobile.src;

          return (
            <figure
              key={index}
              className={cn(
                'm-0 flex flex-col gap-2.5',
                isPhone ? 'col-span-12 sm:col-span-4' : 'col-span-12 sm:col-span-8',
              )}
            >
              {isPhone ? (
                <div className="flex flex-1 items-end justify-center overflow-hidden rounded-xl bg-surface-sunken px-5 pt-5">
                  <Image
                    src={piece.src}
                    alt={piece.alt[locale]}
                    sizes="(min-width: 640px) 20vw, 60vw"
                    className="block aspect-[9/15] w-[78%] rounded-t-2xl object-cover object-top shadow-md"
                  />
                </div>
              ) : (
                <Image
                  src={piece.src}
                  alt={piece.alt[locale]}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="block aspect-[16/10] w-full rounded-xl border border-line bg-surface-sunken object-cover object-top"
                />
              )}
              {caption ? (
                <figcaption className="font-mono text-xs/4.5 text-ink-muted">
                  {t(caption as 'hb0' | 'hb1')}
                </figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>
    );
  }

  const testimonial = meta.testimonial ? <CaseTestimonial testimonial={meta.testimonial} /> : null;

  return {
    CaseSection: (props: Omit<ComponentProps<typeof CaseSection>, 'testimonial' | 'number'>) => (
      <CaseSection {...props} number={numbers[props.kind]} testimonial={testimonial} />
    ),
    SolutionItem,
    DevItem,
    BrandKit,
    SolutionMedia,
    // Texto corrido del MDX: en `ink-muted`, y las negritas en `ink` sin engordar (artboards).
    p: (props: ComponentProps<'p'>) => (
      <p {...props} className="max-w-170 text-[18px]/[30px] text-ink-muted" />
    ),
    strong: (props: ComponentProps<'strong'>) => (
      <strong {...props} className="font-normal text-ink" />
    ),
    code: (props: ComponentProps<'code'>) => (
      <code
        {...props}
        className="rounded bg-surface-sunken px-1 py-0.5 font-mono text-[0.9em] text-ink"
      />
    ),
  };
}
