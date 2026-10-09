'use client';

import { buttonClasses } from '@/components/ui/button-classes';
import { Link, usePathname } from '@/i18n/navigation';
import { site } from '@/lib/site';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export type MobileMenuItem = {
  route: '/work' | '/services' | '/about';
  label: string;
  /** Ruta pública en este idioma, en mono bajo el enlace (p. ej. `/trabajos`). */
  path: string;
};

export type MobileMenuProps = {
  items: readonly MobileMenuItem[];
  labels: {
    open: string;
    close: string;
    dialog: string;
    nav: string;
    home: string;
    github: string;
    contact: string;
    linkedin: string;
    external: string;
  };
  /** Selector de idioma ya construido en el servidor (es otra isla). */
  languageSwitch: ReactNode;
  /** Logo del diálogo, construido en el servidor. */
  logo: ReactNode;
};

const DESKTOP = '(min-width: 1024px)';

/**
 * Menú móvil (spec §7.2, UI37). Usa un `<dialog>` nativo con `showModal()`: el fondo queda inerte,
 * el foco queda atrapado y `Esc` lo cierra sin código extra. El bloqueo del scroll del fondo es CSS
 * (`html:has(dialog[open])`, en `globals.css`).
 */
export function MobileMenu({ items, labels, languageSwitch, logo }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // `close` llega por Esc, por el botón, por un enlace o por el cambio a escritorio.
    const onClose = () => {
      setOpen(false);
      buttonRef.current?.focus();
    };
    const media = window.matchMedia(DESKTOP);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) dialog.close();
    };

    dialog.addEventListener('close', onClose);
    media.addEventListener('change', onChange);
    return () => {
      dialog.removeEventListener('close', onClose);
      media.removeEventListener('change', onChange);
    };
  }, []);

  const show = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const close = () => dialogRef.current?.close();

  const current = (route: MobileMenuItem['route']) =>
    pathname === route ? 'page' : pathname.startsWith(`${route}/`) ? 'true' : undefined;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={labels.open}
        aria-expanded={open}
        aria-controls="menu-movil"
        onClick={show}
        className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-ink hover:border-ink lg:hidden"
      >
        <Menu aria-hidden="true" size={20} strokeWidth={1.75} />
      </button>

      <dialog
        id="menu-movil"
        ref={dialogRef}
        aria-label={labels.dialog}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-paper p-0 text-ink lg:hidden"
      >
        <div className="flex min-h-full flex-col px-4 py-3.5">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              aria-label={labels.home}
              onClick={close}
              className="inline-flex h-10 items-center"
            >
              {logo}
            </Link>
            <button
              type="button"
              aria-label={labels.close}
              onClick={close}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong hover:border-ink"
            >
              <X aria-hidden="true" size={20} strokeWidth={1.75} />
            </button>
          </div>

          <nav aria-label={labels.nav} className="mt-8">
            <ul className="divide-y divide-line border-y border-line">
              {items.map((item) => (
                <li key={item.route}>
                  <Link
                    href={item.route}
                    onClick={close}
                    aria-current={current(item.route)}
                    className="flex flex-col gap-1 py-4 aria-[current]:text-accent"
                  >
                    <span className="type-section-sm">{item.label}</span>
                    <span className="text-meta text-ink-muted">{item.path}</span>
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex flex-col gap-1 py-4"
                >
                  <span className="type-section-sm">
                    {labels.github}
                    <span className="sr-only"> {labels.external}</span>
                  </span>
                  <span className="text-meta text-ink-muted">github.com/Terryqg10</span>
                </a>
              </li>
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-4 pt-8">
            <Link
              href="/contact"
              onClick={close}
              aria-current={pathname === '/contact' ? 'page' : undefined}
              className={buttonClasses({ variant: 'primary', size: 'lg', className: 'w-full' })}
            >
              {labels.contact}
            </Link>
            <div className="flex items-center justify-between">
              {/* Cambiar de idioma también cierra el menú. */}
              <div onClick={close}>{languageSwitch}</div>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="inline-flex min-h-11 items-center tq-link text-button"
              >
                {labels.linkedin}
                <span className="sr-only"> {labels.external}</span>
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
