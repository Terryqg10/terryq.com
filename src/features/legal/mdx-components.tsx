import { site } from '@/lib/site';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';

/** Email de contacto, siempre el de `site.ts`. */
function Email() {
  return (
    <a href={`mailto:${site.email}`} className="underline underline-offset-4">
      {site.email}
    </a>
  );
}

/** Solo aparece si `site.legal.nif` tiene valor (spec §15.1). */
function Nif() {
  return site.legal.nif ? (
    <p>
      <strong>NIF:</strong> {site.legal.nif}
    </p>
  ) : null;
}

/** Estilos de prosa del sistema de diseño para el MDX legal (spec §8.8). */
export const legalMdxComponents: MDXComponents = {
  h2: (props: ComponentProps<'h2'>) => <h2 className="mt-8 type-section-sm" {...props} />,
  p: (props: ComponentProps<'p'>) => <p className="text-body" {...props} />,
  ul: (props: ComponentProps<'ul'>) => (
    <ul className="flex list-disc flex-col gap-2 pl-6 text-body" {...props} />
  ),
  a: ({ href = '', ...props }: ComponentProps<'a'>) => (
    <a
      href={href}
      className="underline underline-offset-4"
      {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  ),
  strong: (props: ComponentProps<'strong'>) => <strong className="font-semibold" {...props} />,
  Email,
  Nif,
};
