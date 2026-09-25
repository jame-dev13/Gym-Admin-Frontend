import { useEffect } from "react";
import "@/features/landing-page/landing.css";
import { BenefitsSection } from "@/features/landing-page/components/BenefitsSection";
import { CtaSection, LandingFooter } from "@/features/landing-page/components/CtaSection";
import { FaqSection } from "@/features/landing-page/components/FaqSection";
import { HeroSection } from "@/features/landing-page/components/HeroSection";
import { LandingNavbar } from "@/features/landing-page/components/LandingNavbar";
import { PricingSection } from "@/features/landing-page/components/PricingSection";
import { TestimonialsSection } from "@/features/landing-page/components/TestimonialsSection";

const LandingPage = () => {
  useEffect(() => {
    document.title = "Gym Admin | Transform your body";
  }, []);

  return (
    <>
      <LandingNavbar />
      <main>
        <HeroSection />
        <BenefitsSection />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </>
  );
};

export default LandingPage;
