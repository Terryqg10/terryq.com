import type { StaticImageData } from 'next/image';
import type { WorkSlug } from './work/slugs';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export type Localized<T> = Readonly<Record<Locale, T>>;

export type { WorkSlug };
export type WorkCategory = 'web' | 'brand';
export type WorkStatus = 'live' | 'demo';

export interface WorkImage {
  readonly src: StaticImageData; // import estático: ancho, alto y blur automáticos
  readonly alt: Localized<string>; // obligatorio en los dos idiomas; '' prohibido
}

export interface CaseFact {
  readonly label: Localized<string>; // «Cliente», «Ubicación», «Tipo», «Servicios»
  readonly value: Localized<string>;
}

export interface Testimonial {
  readonly quote: string; // en su idioma original, sin traducir
  readonly quoteLang: Locale;
  readonly translation?: Partial<Localized<string>>; // se marca «(traducido)» / «(translated)»
  readonly author: string;
  readonly role: Localized<string>;
}

export interface WorkMeta {
  readonly slug: WorkSlug;
  readonly name: string; // nombre propio, igual en los dos idiomas
  readonly year: number;
  readonly yearNote?: Localized<string>; // Zona F: «diseñada y construida en 2 semanas»
  readonly status: WorkStatus;
  readonly categories: readonly WorkCategory[];
  readonly siteUrl: string; // https://…
  readonly demoUrl: string | null; // botón «Probar la demo»; null hasta que exista
  readonly title: Localized<string>; // titular-beneficio del caso
  readonly summary: Localized<string>; // línea de la tarjeta de Inicio
  readonly rowSummary: Localized<string>; // línea corta de /trabajos
  readonly tags: Localized<readonly string[]>; // etiquetas de la tarjeta
  readonly typeLabel: Localized<string>; // columna «Tipo» de /trabajos
  readonly sector: Localized<string>; // fila de metadatos de la cabecera del caso
  readonly cardStack: readonly string[]; // ['Next.js', 'Tailwind', 'Vercel'] → mayúsculas por CSS
  readonly facts: readonly CaseFact[]; // filas propias de la ficha (antes de Mi papel · Año · Estado)
  readonly notice: Localized<string> | null; // aviso de Zona F
  readonly testimonial: Testimonial | null;
  readonly images: {
    readonly cover: WorkImage; // escritorio, ≥1600px de ancho, 16:10
    readonly mobile: WorkImage; // móvil, 2x
    readonly thumb: WorkImage; // miniatura de /trabajos (se recorta 96×60, arriba)
    readonly preview: WorkImage; // vista previa flotante de /trabajos
    readonly pieces: readonly WorkImage[]; // piezas de la sección Solución
  };
}

export interface Review {
  readonly id: string;
  readonly project: WorkSlug | null;
  readonly source: 'google' | 'direct';
  readonly rating: 1 | 2 | 3 | 4 | 5 | null;
  readonly quote: string;
  readonly quoteLang: Locale;
  readonly translation?: Partial<Localized<string>>;
  readonly author: string;
  readonly role: Localized<string>;
  readonly url: string | null; // enlace a la reseña en Google, si existe
}
