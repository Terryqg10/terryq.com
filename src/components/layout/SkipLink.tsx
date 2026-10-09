import { getTranslations } from 'next-intl/server';

/** Primer elemento enfocable: lleva al `<main id="contenido">`. Oculto hasta recibir el foco. */
export async function SkipLink() {
  const t = await getTranslations('common');

  return (
    <a
      href="#contenido"
      className="fixed top-[-120px] left-4 z-60 rounded-full bg-ink px-5 py-3 text-button text-paper focus:top-3"
    >
      {t('skipLink')}
    </a>
  );
}
