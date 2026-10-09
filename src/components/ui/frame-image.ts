import type { Locale } from 'next-intl';
import type { StaticImageData } from 'next/image';

/** Imagen de un marco. Es estructuralmente igual que `WorkImage`, sin importar de `content/` (spec §4.4). */
export type FrameImage = {
  readonly src: StaticImageData;
  readonly alt: Readonly<Record<Locale, string>>;
};
