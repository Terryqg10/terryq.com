import { Container } from '@/components/ui/Container';
import { AiPanel } from '@/features/services/AiPanel';
import { AlsoBlock } from '@/features/services/AlsoBlock';
import { ExploreMore } from '@/features/services/ExploreMore';
import { Faq } from '@/features/services/Faq';
import { Process } from '@/features/services/Process';
import { ServicesHeader } from '@/features/services/ServicesHeader';
import { WebOffer } from '@/features/services/WebOffer';

export default function ServicesPage() {
  return (
    <main id="contenido">
      <Container>
        <ServicesHeader />
        <WebOffer />
        <AlsoBlock />
        <Faq />
        <Process />
        <AiPanel />
        <ExploreMore />
      </Container>
    </main>
  );
}
