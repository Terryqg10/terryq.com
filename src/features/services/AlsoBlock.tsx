import { Card } from '@/components/ui/Card';
import { TextLink } from '@/components/ui/TextLink';
import { brandKitTiles } from '@/content/work/hb-construcciones/brand-kit';
import { sectionIds } from '@/content/work/sections';
import { cn } from '@/lib/cn';
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';

const maintenance = ['hosting', 'backups', 'changes', 'support'] as const;

/** «Marca» y «Mantenimiento y hosting»: dos tarjetas 6/6 (spec §8.4, fila 3). */
export async function AlsoBlock() {
  const t = await getTranslations('services');
  const kit = await getTranslations('case.brandKitAlt');
  const locale = await getLocale();

  return (
    <section
      id={t('anchors.brand')}
      aria-label={t('also.ariaLabel')}
      data-reveal
      className="grid scroll-mt-24 grid-cols-12 gap-6 pb-16 lg:pb-24"
    >
      <Card as="article" className="col-span-12 flex flex-col gap-4 p-6 md:p-10 lg:col-span-6">
        <span className="text-label text-ink-muted uppercase">{t('also.label')}</span>
        <h2 className="type-section-sm">{t('also.brandTitle')}</h2>
        <p className="text-base/6.5 text-ink-muted">{t('also.brandText')}</p>
        <div className="mt-auto flex flex-col gap-3 pt-4">
          <ul className="grid grid-cols-4 gap-2">
            {brandKitTiles.map((tile) => (
              <li key={tile.key}>
                <div
                  style={{ backgroundColor: tile.background }}
                  className={cn(
                    'grid aspect-square place-items-center rounded-lg',
                    tile.bordered && 'border border-line',
                  )}
                >
                  <Image
                    src={tile.src}
                    alt={kit(tile.key)}
                    unoptimized
                    style={{ width: tile.key === 'icon' ? '40%' : '76%', height: 'auto' }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <TextLink
            href={{
              pathname: '/work/[slug]',
              params: { slug: 'hb-construcciones' },
              hash: sectionIds.identity[locale],
            }}
            className="self-start text-meta text-accent"
          >
            {t('also.brandLink')}
          </TextLink>
        </div>
      </Card>

      <Card as="article" className="col-span-12 flex flex-col gap-4 p-6 md:p-10 lg:col-span-6">
        <span className="text-label text-ink-muted uppercase">{t('also.afterDelivery')}</span>
        <h2 className="type-section-sm">{t('also.maintenanceTitle')}</h2>
        <p className="text-base/6.5 text-ink-muted">{t('also.maintenanceText')}</p>
        <ul className="mt-auto grid gap-x-6 pt-4 sm:grid-cols-2">
          {maintenance.map((key) => (
            <li
              key={key}
              className="border-t border-line py-3 sm:[&:nth-last-child(-n+2)]:border-b"
            >
              {t(`also.maintenanceItems.${key}`)}
            </li>
          ))}
        </ul>
        <p className="text-meta text-ink-muted">{t('also.maintenanceNote')}</p>
      </Card>
    </section>
  );
}
