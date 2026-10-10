import { BrowserFrame } from '@/components/ui/BrowserFrame';
import { Button } from '@/components/ui/Button';
import { CodeHeadline } from '@/components/ui/CodeHeadline';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TextLink } from '@/components/ui/TextLink';
import { getWork } from '@/content/work';
import { site } from '@/lib/site';
import { ArrowRight, Code } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image, { type StaticImageData } from 'next/image';
import { HeroShowcase } from './HeroShowcase';

/** Hero de Inicio (spec §8.1, fila 1). No lleva `data-reveal` (CA-G9). */
export async function Hero() {
  const t = await getTranslations('home.hero');
  const hb = getWork('hb-construcciones');
  const avatar: StaticImageData | null = site.avatar;

  return (
    <section
      aria-labelledby="hero-t"
      className="flex flex-col gap-14 py-12 lg:flex-row lg:items-center lg:py-26"
    >
      <div className="flex min-w-0 flex-col gap-6 lg:flex-[7] lg:gap-7">
        {/* Sin avatar solo queda la línea de texto, sin hueco (spec §9.6). */}
        <div className="flex items-center gap-3">
          {avatar ? (
            <Image src={avatar} alt="" width={52} height={52} className="size-13 rounded-full" />
          ) : null}
          <p className="text-meta text-ink-muted">
            {t.rich('intro', { name: (chunks) => <span className="text-ink">{chunks}</span> })}
          </p>
        </div>

        <CodeHeadline as="h1" id="hero-t" lines={[t('line1'), t('line2')]} />

        <p className="max-w-150 text-[17px]/7 text-ink-muted lg:text-body-l">{t('subtitle')}</p>

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:pt-1">
          <Button variant="primary" size="lg" href="/work" className="w-full lg:w-auto">
            {t('ctaWork')}
            <ArrowRight aria-hidden="true" size={20} strokeWidth={1.75} />
          </Button>
          <div className="grid grid-cols-2 gap-3 lg:flex">
            <Button variant="secondary" size="lg" href={site.github} external>
              <Code aria-hidden="true" size={20} strokeWidth={1.75} />
              {t('ctaGithub')}
            </Button>
            <Button variant="secondary" size="lg" href={site.linkedin} external>
              {t('ctaLinkedin')}
            </Button>
          </div>
        </div>

        <ul className="mt-0 flex flex-col gap-1.5 border-t border-line pt-4 text-meta text-ink-muted lg:mt-3 lg:flex-row lg:flex-wrap lg:gap-x-7 lg:gap-y-2 lg:pt-5">
          <li>
            <StatusBadge status="live" label={t('proofLive')} muted />
          </li>
          <li>{t('proofStack')}</li>
          <li>{t('proofLocation')}</li>
        </ul>
      </div>

      <figure className="flex min-w-0 flex-col gap-3 lg:flex-[5] lg:gap-4">
        <HeroShowcase>
          <div className="relative lg:pb-9 lg:pl-9">
            <BrowserFrame
              url={new URL(hb.siteUrl).hostname}
              image={hb.images.cover}
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <div className="absolute bottom-0 left-0 hidden w-[26%] lg:block">
              <PhoneFrame image={hb.images.mobile} sizes="160px" />
            </div>
          </div>
        </HeroShowcase>
        <figcaption className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-meta text-ink-muted lg:pl-9">
          <StatusBadge status="live" label={t('caption')} muted />
          <TextLink href={hb.siteUrl} external className="tq-hit font-medium text-ink">
            {t('openSite')}
          </TextLink>
        </figcaption>
      </figure>
    </section>
  );
}
