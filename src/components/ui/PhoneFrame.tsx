import { getLocale } from 'next-intl/server';
import Image from 'next/image';
import type { FrameImage } from './frame-image';

export type PhoneFrameProps = {
  image: FrameImage;
  sizes: string;
};

/** Marco de teléfono: bisel de 6px en `inverse-bg` y proporción 9/19 (artboards). */
export async function PhoneFrame({ image, sizes }: PhoneFrameProps) {
  const locale = await getLocale();

  return (
    <div className="aspect-[9/19] rounded-[22px] bg-inverse-bg p-1.5 shadow-md">
      <Image
        src={image.src}
        alt={image.alt[locale]}
        sizes={sizes}
        className="block size-full rounded-2xl bg-surface-sunken object-cover object-top"
      />
    </div>
  );
}
