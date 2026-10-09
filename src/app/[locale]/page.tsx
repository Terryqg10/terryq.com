import { Container } from '@/components/ui/Container';
import { reviews } from '@/content/reviews';
import { AboutTeaser } from '@/features/home/AboutTeaser';
import { Closing } from '@/features/home/Closing';
import { FeaturedProjects } from '@/features/home/FeaturedProjects';
import { Hero } from '@/features/home/Hero';
import { Reviews } from '@/features/home/Reviews';
import { ServicesSummary } from '@/features/home/ServicesSummary';

export default function HomePage() {
  return (
    <main id="contenido">
      <Container>
        <Hero />
        <FeaturedProjects />
        <Reviews reviews={reviews} />
        <ServicesSummary />
        <AboutTeaser />
        <Closing />
      </Container>
    </main>
  );
}
