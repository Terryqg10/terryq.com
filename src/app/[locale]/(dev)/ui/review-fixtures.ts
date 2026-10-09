import type { Review } from '@/content/types';

/** Reseñas inventadas, solo para revisar el diseño de `Reviews` en `/ui`. Nunca llegan a producción. */
export const reviewFixtures: readonly Review[] = [
  {
    id: 'fixture-1',
    project: 'hb-construcciones',
    source: 'google',
    rating: 5,
    quote: 'Texto de prueba de una opinión con puntuación.',
    quoteLang: 'es',
    translation: { en: 'Test text of a rated review.' },
    author: 'Autor de prueba',
    role: { es: 'Cargo de prueba', en: 'Test role' },
    url: null,
  },
  {
    id: 'fixture-2',
    project: 'zona-f',
    source: 'direct',
    rating: null,
    quote: 'Texto de prueba de una valoración directa.',
    quoteLang: 'es',
    author: 'Otra persona de prueba',
    role: { es: 'Empresa de prueba', en: 'Test company' },
    url: null,
  },
  {
    id: 'fixture-3',
    project: null,
    source: 'google',
    rating: 4,
    quote: 'Test text of a review in English.',
    quoteLang: 'en',
    author: 'Third test author',
    role: { es: 'Rol de prueba', en: 'Test role' },
    url: null,
  },
];
