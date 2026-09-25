export const LANDING_SECTION_IDS = {
  hero: "inicio",
  benefits: "beneficios",
  pricing: "membresias",
  testimonials: "testimonios",
  faq: "preguntas",
} as const;

export type LandingSectionId =
  (typeof LANDING_SECTION_IDS)[keyof typeof LANDING_SECTION_IDS];
