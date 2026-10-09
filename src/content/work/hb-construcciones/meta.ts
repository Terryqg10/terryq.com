import type { WorkMeta } from '../../types';
import cover from './images/hb-portada-escritorio.webp';
import gallery from './images/hb-trabajos-escritorio.webp';
import mobile from './images/hb-movil.webp';

const coverImage = {
  src: cover,
  alt: {
    es: 'Portada de la web de HB Construcciones en escritorio, con el titular, los botones de WhatsApp y una reseña de clientes',
    en: 'Home page of the HB Construcciones website on desktop, with the headline, the WhatsApp buttons and a customer review',
  },
};

const galleryImage = {
  src: gallery,
  alt: {
    es: 'Galería de obras de HB Construcciones en escritorio: una cocina montada, una escalera de piedra y una fachada de ladrillo en obra',
    en: 'HB Construcciones work gallery on desktop: a fitted kitchen, a stone staircase and a brick facade under construction',
  },
};

export const meta = {
  slug: 'hb-construcciones',
  name: 'HB Construcciones',
  year: 2026,
  status: 'live',
  categories: ['web', 'brand'],
  siteUrl: 'https://hb-construcciones.vercel.app/',
  demoUrl: null,
  title: {
    es: 'Una web para que pedir presupuesto sea tan fácil como mandar un WhatsApp',
    en: 'A website that makes asking for a quote as easy as sending a WhatsApp',
  },
  summary: {
    es: 'Web para una empresa de reformas y piscinas, pensada para recibir presupuestos por WhatsApp.',
    en: 'A website for a renovation and pool-building company, designed to bring in quote requests via WhatsApp.',
  },
  rowSummary: {
    es: 'Web para una empresa de reformas y piscinas, pensada para recibir presupuestos por WhatsApp.',
    en: 'A website for a renovation and pool-building company, designed to bring in quote requests via WhatsApp.',
  },
  tags: {
    es: ['Web', 'Propuesta de identidad'],
    en: ['Website', 'Brand identity proposal'],
  },
  typeLabel: {
    es: 'Web para cliente · Propuesta de identidad',
    en: 'Client website · Brand identity proposal',
  },
  sector: {
    es: 'Reformas integrales y piscinas',
    en: 'Full home renovations and swimming pools',
  },
  cardStack: ['Next.js', 'Tailwind', 'Vercel'],
  facts: [
    {
      label: { es: 'Cliente', en: 'Client' },
      value: {
        es: 'HB Construcciones · Reformas integrales y piscinas',
        en: 'HB Construcciones · Full home renovations and swimming pools',
      },
    },
    {
      label: { es: 'Ubicación', en: 'Location' },
      value: {
        es: 'Villanueva de la Cañada (Madrid)',
        en: 'Villanueva de la Cañada (Madrid, Spain)',
      },
    },
    {
      label: { es: 'Servicios', en: 'Services' },
      value: {
        es: 'Diseño y desarrollo web · Propuesta de identidad',
        en: 'Web design and development · Brand identity proposal',
      },
    },
  ],
  notice: null,
  testimonial: null,
  images: {
    cover: coverImage,
    mobile: {
      src: mobile,
      alt: {
        es: 'La web de HB Construcciones en el móvil: foto de un operario pintando, titular, botón de WhatsApp y barra fija con Llamar y WhatsApp',
        en: 'The HB Construcciones website on a phone: photo of a worker painting, headline, WhatsApp button and a sticky bar with Call and WhatsApp',
      },
    },
    thumb: coverImage,
    // La tarjeta de Inicio usa la galería de obras, como en los artboards (F4 · UI11).
    preview: galleryImage,
    pieces: [
      galleryImage,
      {
        src: mobile,
        alt: {
          es: 'Barra fija de la web de HB en el móvil, con los botones Llamar y WhatsApp siempre visibles',
          en: 'The sticky bar on the HB website on mobile, with the Call and WhatsApp buttons always visible',
        },
      },
    ],
  },
} as const satisfies WorkMeta;
