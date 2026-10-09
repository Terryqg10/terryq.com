import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('legal');
  return (
    <main id="contenido">
      <h1>{t('noticeTitle')}</h1>
    </main>
  );
}
