import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('work');
  return (
    <main id="contenido">
      <h1>{t('title')}</h1>
    </main>
  );
}
