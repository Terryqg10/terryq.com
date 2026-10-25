import type { WorkMeta } from '../../types';
import cover from './images/atelier-escritorio.webp';
import mobile from './images/atelier-movil.webp';

const coverImage = {
  src: cover,
  alt: {
    es: 'Portada de Atelier Malva en escritorio: cabecera con el nombre del salón y el botón Reservar, titular «Tu cabello, en las mejores manos» junto a la fotografía de una mujer sonriendo con una pinza en el pelo, y una franja que invita a probar el panel de administración',
    en: 'Atelier Malva home page on desktop: a header with the salon name and a Reservar button, the headline «Tu cabello, en las mejores manos» next to a photo of a smiling woman with a hair clip, and a banner inviting visitors to try the admin panel',
  },
};

export const meta = {
  slug: 'atelier-malva',
  name: 'Atelier Malva',
  year: 2026,
  status: 'demo',
  categories: ['web'],
  siteUrl: 'https://estudio-peluqueria.vercel.app/',
  demoUrl: null,
  title: {
    es: 'Una peluquería con reserva en tiempo real y un panel que puedes probar',
    en: 'A hair salon with real-time booking and an admin panel you can try',
  },
  summary: {
    es: 'Web de reservas de una peluquería con disponibilidad en tiempo real y panel de administración.',
    en: 'Booking website for a hair salon with real-time availability and an admin panel.',
  },
  rowSummary: {
    es: 'Web de reservas de una peluquería con disponibilidad en tiempo real y panel de administración.',
    en: 'Booking website for a hair salon with real-time availability and an admin panel.',
  },
  tags: {
    es: ['Web de reservas', 'Demo'],
    en: ['Booking website', 'Demo'],
  },
  typeLabel: { es: 'Proyecto propio · Demo', en: 'Own project · Demo' },
  sector: {
    es: 'Belleza · Proyecto de demostración',
    en: 'Beauty · Demo project',
  },
  cardStack: ['Next.js', 'Supabase', 'TypeScript'],
  facts: [
    {
      label: { es: 'Tipo', en: 'Type' },
      value: { es: 'Proyecto propio · Demostración', en: 'Own project · Demonstration' },
    },
    {
      label: { es: 'Servicios', en: 'Services' },
      value: {
        es: 'Especificación · Diseño · Desarrollo web',
        en: 'Specification · Design · Web development',
      },
    },
  ],
  notice: {
    es: 'Proyecto de demostración. El salón, los datos y las citas son ficticios',
    en: 'Demo project. The salon, the data and the appointments are fictional',
  },
  testimonial: null,
  images: {
    cover: coverImage,
    mobile: {
      src: mobile,
      alt: {
        es: 'Atelier Malva en el móvil: cabecera con el nombre del salón, el botón Reservar y un menú, la fotografía de una mujer sonriendo con una pinza en el pelo, el titular «Tu cabello, en las mejores manos» y el botón Ver servicios',
        en: 'Atelier Malva on a phone: a header with the salon name, a Reservar button and a menu, a photo of a smiling woman with a hair clip, the headline «Tu cabello, en las mejores manos» and a Ver servicios button',
      },
    },
    thumb: coverImage,
    preview: coverImage,
    pieces: [],
  },
} as const satisfies WorkMeta;
