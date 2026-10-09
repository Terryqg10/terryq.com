import type { MDXComponents } from 'mdx/types';

/** Lo pide @next/mdx. Los componentes de los casos se pasan desde `features/work` (spec §9.2). */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return components;
}
