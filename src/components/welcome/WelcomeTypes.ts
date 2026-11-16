import type { LucideIcon } from "lucide-react";

export type WelcomeNavItem = {
  href: string;
  label: string;
};

export type WelcomeBenefit = {
  Icon: LucideIcon;
  title: string;
  description: string;
  points: readonly string[];
};

export type WelcomeDashboardFeature = {
  Icon: LucideIcon;
  title: string;
  description: string;
};

export type WelcomeStep = {
  Icon: LucideIcon;
  title: string;
  description: string;
};

export type WelcomeTestimonial = {
  quote: string;
  name: string;
  detail: string;
  rating: number;
};

export type WelcomeFaqItem = {
  question: string;
  answer: string;
};

export type WelcomeMembershipActionProps = {
  onRequestMembership: () => void;
};

export type WelcomeMembershipDialogProps = {
  open: boolean;
  onClose: () => void;
};

export type WelcomeSectionHeaderProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};
