import { BrowserFrame } from '@/components/ui/BrowserFrame';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { CodeHeadline } from '@/components/ui/CodeHeadline';
import { Container } from '@/components/ui/Container';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { RadioPills } from '@/components/ui/RadioPills';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Tag } from '@/components/ui/Tag';
import { TextArea } from '@/components/ui/TextArea';
import { TextField } from '@/components/ui/TextField';
import { TextLink } from '@/components/ui/TextLink';
import { getWork } from '@/content/work';
import { AboutHero } from '@/features/about/AboutHero';
import { ForCompanies } from '@/features/about/ForCompanies';
import { Reviews } from '@/features/home/Reviews';
import { reviewFixtures } from './review-fixtures';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

// Página de revisión de las primitivas (T11): solo para que Terry la vea en el preview.
// No se enlaza desde ningún sitio y no existe en producción.
export const metadata: Metadata = {
  title: 'Primitivas de UI · revisión',
  robots: { index: false, follow: false },
};

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section data-reveal aria-label={title} className="border-t border-line py-10">
      <h2 className="mb-6 type-section-sm">{title}</h2>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

const needs = [
  { value: 'new-website', label: 'Web nueva' },
  { value: 'redesign', label: 'Rediseño' },
  { value: 'brand', label: 'Marca' },
];

export default function UiReviewPage() {
  if (process.env.VERCEL_ENV === 'production') notFound();

  const hb = getWork('hb-construcciones');

  return (
    <main id="contenido">
      <Container className="py-16">
        <SectionLabel kind="route">ui</SectionLabel>
        <h1 className="mt-2 mb-10 type-page">Primitivas de UI</h1>

        <Block title="Botones">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" href="/work">
              Primario md
            </Button>
            <Button variant="primary" size="lg" href="/work">
              Primario lg
            </Button>
            <Button variant="secondary" href="/work">
              Secundario md
            </Button>
            <Button variant="secondary" size="lg" href="/work">
              Secundario lg
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="lg" href="https://github.com/Terryqg10" external>
              GitHub
            </Button>
            <Button variant="secondary" href="/cv/prueba.pdf" download="prueba.pdf">
              Descargar
            </Button>
            <Button variant="secondary" type="button">
              button
            </Button>
            <Button variant="secondary" type="submit" disabled>
              submit desactivado
            </Button>
          </div>
        </Block>

        <Block title="Enlaces de texto">
          <p>
            <TextLink href="/work">Enlace en reposo</TextLink> ·{' '}
            <TextLink href="https://github.com/Terryqg10" external>
              Enlace externo
            </TextLink>
          </p>
          <p className="max-w-text">
            Un enlace{' '}
            <TextLink href="/services" inline>
              dentro de un párrafo
            </TextLink>{' '}
            lleva siempre subrayado.
          </p>
        </Block>

        <Block title="Etiquetas y titulares">
          <SectionLabel kind="route">trabajos</SectionLabel>
          <SectionLabel kind="anchor">preguntas</SectionLabel>
          <CodeHeadline as="blockquote" lines={['Desarrollador', 'web']} />
          <CodeHeadline as="blockquote">Webs que cualquiera entiende</CodeHeadline>
        </Block>

        <Block title="Estado y etiquetas">
          <div className="flex flex-wrap items-center gap-4">
            <StatusBadge status="live" label="Online" />
            <StatusBadge status="demo" label="Demo" />
            <Tag>Web</Tag>
            <Tag>Propuesta de identidad</Tag>
          </div>
        </Block>

        <Block title="Tarjetas">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">Tarjeta en reposo</Card>
            <Card interactive className="p-6">
              Tarjeta interactiva
            </Card>
          </div>
        </Block>

        <Block title="Marcos">
          <div className="relative mb-12 max-w-3xl">
            <BrowserFrame
              url="hb-construcciones.vercel.app"
              image={hb.images.cover}
              sizes="(min-width: 768px) 768px, 100vw"
            />
            <div className="absolute bottom-0 left-0 w-1/4 -translate-x-1/6 translate-y-1/6">
              <PhoneFrame image={hb.images.mobile} sizes="200px" />
            </div>
          </div>
        </Block>

        <Block title="Campos">
          <div className="grid max-w-2xl gap-6">
            <TextField id="demo-name" name="name" label="Nombre" placeholder="Tu nombre" />
            <TextField
              id="demo-web"
              name="web"
              label="Tu web"
              optional="Opcional"
              placeholder="tuweb.com"
              describedById="demo-web-help"
            />
            <p id="demo-web-help" className="text-small text-ink-muted">
              Texto de ayuda enlazado con aria-describedby.
            </p>
            <TextField
              id="demo-error"
              name="contact"
              label="Email o teléfono"
              defaultValue="no-es-un-email"
              error="Revisa el formato: un email (tu@email.com) o un teléfono."
            />
            <TextArea
              id="demo-message"
              name="message"
              label="Mensaje"
              placeholder="Qué necesitas"
            />
            <TextArea
              id="demo-message-error"
              name="message-error"
              label="Mensaje con error"
              error="Cuéntame un poco de tu proyecto."
            />
          </div>
        </Block>

        <Block title="Pastillas y casilla">
          <div className="grid max-w-2xl gap-6">
            <RadioPills
              name="need"
              legend="Qué necesitas"
              options={needs}
              defaultValue="redesign"
            />
            <RadioPills
              name="need-error"
              legend="Con error"
              options={needs}
              error="Elige una opción."
            />
            <Checkbox
              id="demo-privacy"
              name="privacy"
              label={
                <>
                  He leído la{' '}
                  <TextLink href="/privacy" inline>
                    política de privacidad
                  </TextLink>
                  .
                </>
              }
            />
            <Checkbox
              id="demo-privacy-error"
              name="privacy-error"
              label="Casilla con error"
              error="Acepta la política de privacidad para poder enviarlo."
            />
          </div>
        </Block>
        <Reviews reviews={reviewFixtures} />

        {/* Fixtures de Sobre mí: un retrato y un CV de prueba (no existen todavía, spec §9.6). */}
        <div data-fixture="about">
          <AboutHero portrait={hb.images.cover.src} />
          <ForCompanies cv="/cv/prueba.pdf" />
        </div>
      </Container>
    </main>
  );
}
