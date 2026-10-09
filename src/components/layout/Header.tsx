import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/navigation';
import { pathnames } from '@/i18n/routing';
import { getLocale, getTranslations } from 'next-intl/server';
import { LanguageSwitch } from './LanguageSwitch';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { NavLinks } from './NavLinks';

/** Cabecera fija. Desde `lg` lleva el menú completo; por debajo, logo y selector de idioma. */
export async function Header() {
  const t = await getTranslations('common');
  const locale = await getLocale();
  const switchLabel = t('language.switchLabel');

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper py-3.5">
      <Container className="flex items-center justify-between gap-6">
        <Link href="/" aria-label={t('logo.homeLabel')} className="inline-flex h-10 items-center">
          <Logo height={40} />
        </Link>

        <nav aria-label={t('nav.label')} className="hidden items-center gap-7 lg:flex">
          <NavLinks
            labels={{
              work: t('nav.work'),
              services: t('nav.services'),
              about: t('nav.about'),
              github: t('nav.github'),
              contact: t('nav.contact'),
              external: t('external'),
            }}
          />
          <LanguageSwitch ariaLabel={t('language.switchLabel')} />
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitch ariaLabel={switchLabel} />
          <MobileMenu
            items={[
              { route: '/work', label: t('nav.work'), path: pathnames['/work'][locale] },
              {
                route: '/services',
                label: t('nav.services'),
                path: pathnames['/services'][locale],
              },
              { route: '/about', label: t('nav.about'), path: pathnames['/about'][locale] },
            ]}
            labels={{
              open: t('menu.open'),
              close: t('menu.close'),
              dialog: t('menu.dialogLabel'),
              nav: t('nav.label'),
              home: t('logo.homeLabel'),
              github: t('nav.github'),
              contact: t('nav.contact'),
              linkedin: t('nav.linkedin'),
              external: t('external'),
            }}
            languageSwitch={<LanguageSwitch ariaLabel={switchLabel} />}
            logo={<Logo height={40} />}
          />
        </div>
      </Container>
    </header>
  );
}
