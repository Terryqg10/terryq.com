/** Slugs de los casos: iguales en los dos idiomas porque son nombres propios (spec §5.2). */
export const workSlugs = ['hb-construcciones', 'zona-f', 'finanzas-personales'] as const;

export type WorkSlug = (typeof workSlugs)[number];
