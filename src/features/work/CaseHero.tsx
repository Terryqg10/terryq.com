import { BrowserFrame } from '@/components/ui/BrowserFrame';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import type { WorkMeta } from '@/content/types';

/**
 * Imagen principal del caso (spec §8.3, fila 2): navegador con la captura de escritorio sobre
 * `surface-sunken`, y el teléfono sobresaliendo por la esquina inferior derecha desde `md`.
 */
export function CaseHero({ meta }: { meta: WorkMeta }) {
  return (
    <figure className="relative m-0 mb-14 rounded-3xl bg-surface-sunken p-4 pb-4 md:mb-24 md:p-10 md:pb-10 lg:mb-24">
      <BrowserFrame
        url={new URL(meta.siteUrl).hostname}
        image={meta.images.cover}
        priority
        sizes="(min-width: 1280px) 1200px, 100vw"
      />
      <div className="absolute right-[72px] -bottom-10 hidden w-50 md:block">
        <PhoneFrame image={meta.images.mobile} sizes="200px" />
      </div>
    </figure>
  );
}
