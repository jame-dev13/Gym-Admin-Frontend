export const WELCOME_SECTION_IDS = {
  overview: "welcome-overview",
  benefits: "welcome-benefits",
  dashboard: "welcome-dashboard",
  howItWorks: "welcome-how-it-works",
  community: "welcome-community",
  faq: "welcome-faq",
  join: "welcome-join",
} as const;

export const WELCOME_NAV_SECTION_IDS = [
  WELCOME_SECTION_IDS.benefits,
  WELCOME_SECTION_IDS.dashboard,
  WELCOME_SECTION_IDS.howItWorks,
  WELCOME_SECTION_IDS.community,
  WELCOME_SECTION_IDS.faq,
] as const;

export type WelcomeSectionId =
  (typeof WELCOME_SECTION_IDS)[keyof typeof WELCOME_SECTION_IDS];
