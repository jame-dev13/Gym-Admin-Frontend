import { useState } from "react";
import { WelcomeBenefits } from "@/components/welcome/WelcomeBenefits";
import { WelcomeCommunity } from "@/components/welcome/WelcomeCommunity";
import { WelcomeCta } from "@/components/welcome/WelcomeCta";
import { WelcomeDashboard } from "@/components/welcome/WelcomeDashboard";
import { WelcomeFaq } from "@/components/welcome/WelcomeFaq";
import { WelcomeFooter } from "@/components/welcome/WelcomeFooter";
import { WelcomeHero } from "@/components/welcome/WelcomeHero";
import { WelcomeMembershipDialog } from "@/components/welcome/WelcomeMembershipDialog";
import { WelcomeNavbar } from "@/components/welcome/WelcomeNavbar";
import { WelcomeSteps } from "@/components/welcome/WelcomeSteps";
import { useWelcomeSeo } from "@/components/welcome/useWelcomeSeo";

export const WelcomeLayout = () => {
  useWelcomeSeo();

  const [membershipDialogOpen, setMembershipDialogOpen] = useState(false);
  const openMembershipDialog = () => setMembershipDialogOpen(true);
  const closeMembershipDialog = () => setMembershipDialogOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-surface font-sans text-text-primary selection:bg-accent/30">
      <a
        href="#welcome-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-surface focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface focus:outline-none"
      >
        Skip to main content
      </a>

      <WelcomeNavbar onRequestMembership={openMembershipDialog} />

      <main id="welcome-main" tabIndex={-1} className="flex-1 outline-none">
        <WelcomeHero onRequestMembership={openMembershipDialog} />
        <WelcomeBenefits />
        <WelcomeDashboard />
        <WelcomeSteps />
        <WelcomeCommunity onRequestMembership={openMembershipDialog} />
        <WelcomeFaq />
        <WelcomeCta onRequestMembership={openMembershipDialog} />
      </main>

      <WelcomeFooter onRequestMembership={openMembershipDialog} />

      <WelcomeMembershipDialog
        open={membershipDialogOpen}
        onClose={closeMembershipDialog}
      />
    </div>
  );
};

export default WelcomeLayout;
