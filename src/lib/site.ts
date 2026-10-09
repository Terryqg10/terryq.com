import type { Locale } from 'next-intl';
import type { StaticImageData } from 'next/image';

type Localized<T> = Readonly<Record<Locale, T>>;

export interface SiteConfig {
  readonly url: string;
  readonly person: {
    readonly name: string;
    readonly legalName: string;
    readonly locality: string;
    readonly region: string;
    readonly postalCode: string;
    readonly country: string;
  };
  readonly email: string;
  readonly whatsapp: {
    readonly number: string;
    readonly display: string;
    readonly text: Localized<string>;
  };
  readonly github: string;
  readonly linkedin: string;
  readonly repoUrl: string;
  /** Flag: si es `null`, no aparece «Ver todas en Google» (spec §9.6). */
  readonly googleReviewsUrl: string | null;
  /** Flag: ruta pública del PDF, p. ej. `/cv/terry-quinonez-cv-es.pdf`. */
  readonly cv: Localized<string | null>;
  /** Flag: ilustración del avatar. */
  readonly avatar: StaticImageData | null;
  /** Flag: retrato 4:5 de /sobre-mi. */
  readonly portrait: StaticImageData | null;
  /** Si se rellena, el aviso legal lo muestra (spec §15.1). */
  readonly legal: { readonly nif: string | null };
}

export const site = {
  url: 'https://terryq.com',
  person: {
    name: 'Terry Quiñonez',
    legalName: 'Terry Quiñonez Garcia',
    locality: 'Quijorna',
    region: 'Madrid',
    postalCode: '28693',
    country: 'ES',
  },
  email: 'contacto@terryq.com',
  whatsapp: {
    number: '34614312673',
    display: '+34 614 312 673',
    text: {
      es: 'Hola Terry, vengo de tu web y quería hablarte de ', // F1 v2.2 (P1)
      en: "Hi Terry, I found your website and I'd like to talk about ", // 01b · UI43
    },
  },
  github: 'https://github.com/Terryqg10',
  linkedin: 'https://www.linkedin.com/in/terry-qui%C3%B1onez-601337195/',
  repoUrl: 'https://github.com/Terryqg10/terryq.com',
  googleReviewsUrl: null,
  cv: { es: null, en: null },
  avatar: null,
  portrait: null,
  legal: { nif: null },
} as const satisfies SiteConfig;

/** Enlace de WhatsApp con el mensaje inicial del idioma (spec §9.3). */
export function whatsappHref(locale: Locale): string {
  const { number, text } = site.whatsapp;
  // `encodeURIComponent` deja el apóstrofo sin codificar; F1/01b lo escriben como %27.
  const query = encodeURIComponent(text[locale]).replaceAll("'", '%27');
  return `https://wa.me/${number}?text=${query}`;
}
