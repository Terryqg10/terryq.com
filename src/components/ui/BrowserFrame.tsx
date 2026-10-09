import { getLocale } from 'next-intl/server';
import Image from 'next/image';
import type { FrameImage } from './frame-image';

export type BrowserFrameProps = {
  url: string;
  image: FrameImage;
  priority?: boolean;
  sizes: string;
};

/** Ventana de navegador: barra con tres puntos y la URL en mono, y la captura debajo. */
export async function BrowserFrame({ url, image, priority = false, sizes }: BrowserFrameProps) {
  const locale = await getLocale();

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-md">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </span>
        <span className="min-w-0 flex-1 truncate text-center text-meta text-ink-muted">{url}</span>
        <span aria-hidden="true" className="w-10.5" />
      </div>
      <Image
        src={image.src}
        alt={image.alt[locale]}
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        className="block aspect-[16/10] w-full bg-surface-sunken object-cover object-top"
      />
    </div>
  );
}
