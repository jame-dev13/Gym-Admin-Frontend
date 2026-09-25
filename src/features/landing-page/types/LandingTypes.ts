import type { LucideIcon } from "lucide-react";

export type BillingPeriod = "biweekly" | "monthly" | "quarterly" | "annual";

export type Membership = {
  id: BillingPeriod;
  name: string;
  priceMXN: number;
  periodLabel: string;
  tagline: string;
  perks: string[];
  featured?: boolean;
};

export type Benefit = {
  Icon: LucideIcon;
  title: string;
  text: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  detail: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};
