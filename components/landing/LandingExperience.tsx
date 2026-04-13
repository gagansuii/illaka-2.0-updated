import { HeroSection } from '@/sections/HeroSection';
import { InteractiveMapSection } from '@/sections/InteractiveMapSection';

export function LandingExperience() {
  return (
    <main className="relative pb-10 sm:pb-16">
      <HeroSection />
      <InteractiveMapSection />
    </main>
  );
}
