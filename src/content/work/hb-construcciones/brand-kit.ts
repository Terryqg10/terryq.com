import type { StaticImageData } from 'next/image';
import colorKit from './images/brand-kit/color.svg';
import iconKit from './images/brand-kit/icono.svg';
import monochromeKit from './images/brand-kit/monocromo.svg';
import reversedKit from './images/brand-kit/negativo.svg';

export type BrandKitTile = {
  readonly key: 'color' | 'reversed' | 'monochrome' | 'icon';
  readonly src: StaticImageData;
  /** Fondo del tile y color de su pie: son del cliente (spec §9.5), no del DS. */
  readonly background: string;
  readonly caption: string;
  /** Ancho del logo dentro del tile. */
  readonly logoWidth: string;
  readonly bordered: boolean;
};

/** Los 4 tiles del kit de logo de HB (spec §9.5). */
export const brandKitTiles: readonly BrandKitTile[] = [
  {
    key: 'color',
    src: colorKit,
    background: '#ffffff',
    caption: '#57534b',
    logoWidth: '62%',
    bordered: true,
  },
  {
    key: 'reversed',
    src: reversedKit,
    background: '#132a4f',
    caption: '#c9d2e0',
    logoWidth: '62%',
    bordered: false,
  },
  {
    key: 'monochrome',
    src: monochromeKit,
    background: '#ffffff',
    caption: '#57534b',
    logoWidth: '62%',
    bordered: true,
  },
  {
    key: 'icon',
    src: iconKit,
    background: '#ffffff',
    caption: '#57534b',
    logoWidth: '30%',
    bordered: true,
  },
];
