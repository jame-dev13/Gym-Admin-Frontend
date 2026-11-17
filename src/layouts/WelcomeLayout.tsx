import { WelcomeBenefits } from "@/components/welcome/WelcomeBenefits";
import { WelcomeCommunity } from "@/components/welcome/WelcomeCommunity";
import { WelcomeCta } from "@/components/welcome/WelcomeCta";
import { WelcomeDashboard } from "@/components/welcome/WelcomeDashboard";
import { WelcomeFaq } from "@/components/welcome/WelcomeFaq";
import { WelcomeFooter } from "@/components/welcome/WelcomeFooter";
import { WelcomeHero } from "@/components/welcome/WelcomeHero";
import { WelcomeNavbar } from "@/components/welcome/WelcomeNavbar";
import { WelcomeSteps } from "@/components/welcome/WelcomeSteps";
import { useWelcomeSeo } from "@/components/welcome/useWelcomeSeo";
import { ModalHost } from "@/components/modal/ModalHost";
import { ModalProvider } from "@/context/ModalProvider";

export const WelcomeLayout = () => {
  useWelcomeSeo();

  return (
    <ModalProvider>
      <div className="flex min-h-screen flex-col bg-surface font-sans text-text-primary selection:bg-accent/30">
        <a
          href="#welcome-main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-surface focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface focus:outline-none"
        >
          Skip to main content
        </a>

        <WelcomeNavbar />

        <main id="welcome-main" tabIndex={-1} className="flex-1 outline-none">
          <WelcomeHero />
          <WelcomeBenefits />
          <WelcomeDashboard />
          <WelcomeSteps />
          <WelcomeCommunity />
          <WelcomeFaq />
          <WelcomeCta />
        </main>

        <WelcomeFooter />
      </div>

      <ModalHost />
    </ModalProvider>
  );
};

export default WelcomeLayout;
