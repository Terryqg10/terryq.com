import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/navigation';
import { site, whatsappHref } from '@/lib/site';
import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Logo } from './Logo';

const linkClasses = 'tq-link py-[11px]';

function ExternalLink({
  href,
  externalLabel,
  children,
}: {
  href: string;
  externalLabel: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClasses}>
      {children}
      <span className="sr-only"> {externalLabel}</span>
    </a>
  );
}

/** Pie de página. Todos los enlaces tienen un área de 44px de alto (11 + 22 + 11, spec §7.2). */
export async function Footer() {
  const t = await getTranslations('common');
  const locale = await getLocale();
  const external = t('external');

  return (
    <footer className="border-t border-line">
      <Container className="flex flex-wrap justify-between gap-x-12 gap-y-8 pt-12 pb-14">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            aria-label={t('logo.homeLabel')}
            className="inline-flex min-h-11 w-fit items-center"
          >
            <Logo height={40} />
          </Link>
          <p className="text-small text-ink-muted">
            <strong className="font-semibold text-ink">{site.person.name}</strong> ·{' '}
            {t('footer.tagline')}
            <br />
            {t('footer.location')}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <nav
            aria-label={t('footer.navLabel')}
            className="grid grid-cols-2 gap-x-4 text-small font-semibold sm:flex sm:flex-wrap sm:gap-x-6"
          >
            <a href={`mailto:${site.email}`} className={linkClasses}>
              {site.email}
            </a>
            <ExternalLink href={whatsappHref(locale)} externalLabel={external}>
              {t('footer.whatsapp')}
            </ExternalLink>
            <ExternalLink href={site.linkedin} externalLabel={external}>
              {t('footer.linkedin')}
            </ExternalLink>
            <ExternalLink href={site.github} externalLabel={external}>
              {t('footer.github')}
            </ExternalLink>
          </nav>
          <div className="flex flex-wrap items-center gap-x-6 text-small text-ink-muted">
            <Link href="/legal-notice" className={linkClasses}>
              {t('footer.legalNotice')}
            </Link>
            <Link href="/privacy" className={linkClasses}>
              {t('footer.privacy')}
            </Link>
            <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
          </div>
        </div>
      </Container>

      <Container className="pb-10">
        <p className="border-t border-line pt-5 text-label font-normal tracking-normal text-ink-muted">
          {t.rich('footer.builtWith', {
            repo: (chunks) => (
              <a
                href={site.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="-my-3.5 inline-block tq-link py-3.5 text-ink"
              >
                {chunks}
                <span className="sr-only"> {external}</span>
              </a>
            ),
          })}
        </p>
      </Container>
    </footer>
  );
}
