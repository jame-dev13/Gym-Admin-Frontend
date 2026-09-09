import { ArrowLeft } from "lucide-react";
import { LinkTo } from "@/components/links/LinkTo";

export const BackToLandingLink = () => (
  <div className="flex justify-center">
    <LinkTo
      label="Back to Landing Page"
      Icon={ArrowLeft}
      to="/"
      className="text-sm"
      aria-label="Back to landing page"
    />
  </div>
);