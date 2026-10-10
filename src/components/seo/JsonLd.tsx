import { serializeJsonLd } from '@/lib/json-ld';
import type { ComponentProps } from 'react';

type JsonLdProps = { data: Parameters<typeof serializeJsonLd>[0] };

/** `<script type="application/ld+json">` generado en el servidor (spec §11.2). */
export function JsonLd({ data }: JsonLdProps) {
  const html: ComponentProps<'script'>['dangerouslySetInnerHTML'] = {
    __html: serializeJsonLd(data),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={html} />;
}
