import type { WorkMeta } from '../../types';
import cover from './images/sabroso-escritorio.webp';
import mobile from './images/sabroso-movil.webp';

const coverImage = {
  src: cover,
  alt: {
    es: 'Portada de Sabroso Perú en escritorio: titular «Perú en la mesa», botones para reservar mesa y ver la carta, y los horarios, sobre un fondo oscuro con acento ámbar',
    en: 'Sabroso Perú home page on desktop: the headline «Perú en la mesa», buttons to book a table and see the menu, and the opening hours, on a dark background with an amber accent',
  },
};

export const meta = {
  slug: 'sabroso-peru',
  name: 'Sabroso Perú',
  year: 2026,
  status: 'demo',
  categories: ['web'],
  siteUrl: 'https://sabroso-peru.vercel.app/',
  demoUrl: null,
  title: {
    es: 'Reservar mesa en un minuto, desde el móvil y sin crear una cuenta',
    en: 'Booking a table in a minute, from your phone and without creating an account',
  },
  summary: {
    es: 'Web de un restaurante peruano con carta interactiva y reserva por WhatsApp.',
    en: 'A Peruvian restaurant website with an interactive menu and WhatsApp booking.',
  },
  rowSummary: {
    es: 'Web de un restaurante peruano con carta interactiva y reserva por WhatsApp.',
    en: 'A Peruvian restaurant website with an interactive menu and WhatsApp booking.',
  },
  tags: {
    es: ['Web de restaurante', 'Demo'],
    en: ['Restaurant website', 'Demo'],
  },
  typeLabel: { es: 'Proyecto propio · Demo', en: 'Own project · Demo' },
  sector: {
    es: 'Restauración · Proyecto de demostración',
    en: 'Restaurants · Demo project',
  },
  cardStack: ['Next.js', 'Tailwind', 'Zod'],
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
    es: 'Proyecto de demostración. El restaurante, los datos y los textos son ficticios',
    en: 'Demo project. The restaurant, the data and the texts are fictional',
  },
  testimonial: null,
  images: {
    cover: coverImage,
    mobile: {
      src: mobile,
      alt: {
        es: 'Sabroso Perú en el móvil: cabecera con el botón Reservas y un menú desplegable, titular «Perú en la mesa» y botones para reservar mesa, ver la carta y cómo llegar',
        en: 'Sabroso Perú on a phone: a header with a Reservas button and a drop-down menu, the headline «Perú en la mesa» and buttons to book a table, see the menu and get directions',
      },
    },
    thumb: coverImage,
    preview: coverImage,
    pieces: [],
  },
} as const satisfies WorkMeta;
