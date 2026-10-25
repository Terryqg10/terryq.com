import type { WorkMeta, WorkSlug } from '../types';
import { meta as atelier } from './atelier-malva/meta';
import { meta as finanzas } from './finanzas-personales/meta';
import { meta as hb } from './hb-construcciones/meta';
import { meta as sabroso } from './sabroso-peru/meta';
import { meta as zonaF } from './zona-f/meta';

/** Orden de los trabajos: HB → Zona F → Finanzas → Sabroso Perú → Atelier Malva (spec §9.2). */
export const works: readonly WorkMeta[] = [hb, zonaF, finanzas, sabroso, atelier];

const indexOf = (slug: WorkSlug) => {
  const index = works.findIndex((work) => work.slug === slug);
  if (index === -1) throw new Error(`Trabajo desconocido: ${slug}`);
  return index;
};

export function getWork(slug: WorkSlug): WorkMeta {
  return works[indexOf(slug)] as WorkMeta;
}

/** El orden es circular: el siguiente del último es el primero. */
export function getNextWork(slug: WorkSlug): WorkMeta {
  return works[(indexOf(slug) + 1) % works.length] as WorkMeta;
}

/** «01 / 05» */
export function getPosition(slug: WorkSlug): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(indexOf(slug) + 1)} / ${pad(works.length)}`;
}
