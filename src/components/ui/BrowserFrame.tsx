import { getLocale } from 'next-intl/server';
import Image from 'next/image';
import { ViewTransition } from 'react';
import type { FrameImage } from './frame-image';

export type BrowserFrameProps = {
  url: string;
  image: FrameImage;
  priority?: boolean;
  sizes: string;
  /** Nombre de la transición compartida de la imagen (spec §6.6): p. ej. `work-<slug>`. */
  transitionName?: string;
};

/** Ventana de navegador: tres puntos, la URL en una pastilla y la captura debajo (artboards). */
export async function BrowserFrame({
  url,
  image,
  priority = false,
  sizes,
  transitionName,
}: BrowserFrameProps) {
  const locale = await getLocale();
  const picture = (
    <Image
      src={image.src}
      alt={image.alt[locale]}
      sizes={sizes}
      priority={priority}
      fetchPriority={priority ? 'high' : undefined}
      className="block aspect-[16/10] w-full rounded-xl bg-surface-sunken object-cover object-top lg:rounded-[14px]"
    />
  );

  return (
    <div className="rounded-[20px] border border-line bg-surface p-2 shadow-md lg:rounded-3xl lg:p-2.5">
      <div className="flex items-center gap-2 px-1 pt-0.5 pb-2 lg:gap-3 lg:px-1.5 lg:pt-1 lg:pb-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2 rounded-full bg-line lg:size-2.5" />
          <span className="size-2 rounded-full bg-line lg:size-2.5" />
          <span className="size-2 rounded-full bg-line lg:size-2.5" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-full bg-paper text-center font-mono text-[11px]/[22px] text-ink-muted lg:text-xs/6">
          {url}
        </span>
        <span aria-hidden="true" className="hidden w-10.5 lg:block" />
      </div>
      {transitionName ? (
        <ViewTransition name={transitionName} share="morph" default="none">
          {picture}
        </ViewTransition>
      ) : (
        picture
      )}
    </div>
  );
}
