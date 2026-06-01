import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/features/landing/HeroSection';
import { FeaturesSection } from '@/components/features/landing/FeaturesSection';
import { WorkflowSection } from '@/components/features/landing/WorkflowSection';
import { BenefitsSection } from '@/components/features/landing/BenefitsSection';
import { DashboardPreviewSection } from '@/components/features/landing/DashboardPreviewSection';
import { TestimonialsSection } from '@/components/features/landing/TestimonialsSection';
import { PricingSection } from '@/components/features/landing/PricingSection';
import { FAQSection } from '@/components/features/landing/FAQSection';
import { CTABannerSection } from '@/components/features/landing/CTABannerSection';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { useScrollTop } from '@/hooks/useScrollTop';

export default function Index() {
  useScrollTop();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <BenefitsSection />
        <DashboardPreviewSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTABannerSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
