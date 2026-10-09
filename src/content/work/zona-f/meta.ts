import type { WorkMeta } from '../../types';
import cover from './images/zonaf-escritorio.webp';
import mobile from './images/zonaf-movil.webp';

const coverImage = {
  src: cover,
  alt: {
    es: 'Zona F en escritorio: partidos en vivo con cuotas 1X2, listado de ligas, barra lateral y boleto de apuestas con la ganancia potencial',
    en: 'Zona F on desktop: live matches with 1X2 odds, a list of leagues, a sidebar and a bet slip showing the potential winnings',
  },
};

export const meta = {
  slug: 'zona-f',
  name: 'Zona F',
  year: 2026,
  yearNote: {
    es: 'diseñada y construida en 2 semanas',
    en: 'designed and built in 2 weeks',
  },
  status: 'demo',
  categories: ['web'],
  siteUrl: 'https://zona-f.vercel.app/',
  demoUrl: null,
  title: {
    es: 'Cómo sería una casa de apuestas pensada para el usuario',
    en: 'What a betting site designed around the user could look like',
  },
  summary: {
    es: 'Prototipo de casa de apuestas deportivas con boleto, combinadas y cuotas en vivo.',
    en: 'A sports betting platform prototype with a bet slip, accumulators and live odds.',
  },
  rowSummary: {
    es: 'Prototipo de casa de apuestas deportivas con boleto, combinadas y cuotas en vivo.',
    en: 'A sports betting platform prototype with a bet slip, accumulators and live odds.',
  },
  tags: {
    es: ['Producto web', 'Demo'],
    en: ['Web product', 'Demo'],
  },
  typeLabel: { es: 'Producto propio · Demo', en: 'Own product · Demo' },
  sector: {
    es: 'Producto propio · Prototipo funcional',
    en: 'Own product · Working prototype',
  },
  cardStack: ['Next.js', 'Supabase', 'Zustand'],
  facts: [
    {
      label: { es: 'Tipo', en: 'Type' },
      value: { es: 'Producto propio · Prototipo funcional', en: 'Own product · Working prototype' },
    },
    {
      label: { es: 'Servicios', en: 'Services' },
      value: {
        es: 'Diseño de producto · Desarrollo web',
        en: 'Product design · Web development',
      },
    },
  ],
  notice: {
    es: 'Proyecto de demostración. No es una casa de apuestas real ni acepta dinero',
    en: 'Demo project. Not a real betting site; it does not accept money',
  },
  testimonial: null,
  images: {
    cover: coverImage,
    mobile: {
      src: mobile,
      alt: {
        es: 'Zona F en el móvil: partidos en vivo con cuotas, cabecera con filtros y un botón flotante del boleto',
        en: 'Zona F on a phone: live matches with odds, a header with filters and a floating bet slip button',
      },
    },
    thumb: coverImage,
    preview: coverImage,
    pieces: [],
  },
} as const satisfies WorkMeta;
