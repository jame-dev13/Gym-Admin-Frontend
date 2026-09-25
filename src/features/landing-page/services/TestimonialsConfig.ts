import type { Testimonial } from "@/features/landing-page/types/LandingTypes";

export const getTestimonialsConfig = (): Testimonial[] => testimonialsConfig;

const testimonialsConfig: Testimonial[] = [
  {
    quote:
      "I showed up never having touched a weight in my life, and six months later I'm down 12 kilos. The trainers truly guide you.",
    name: "Mariana G.",
    detail: "Monthly member since 2024",
  },
  {
    quote:
      "The HIIT classes are addictive and the atmosphere pushes you to give more. It's the best money I spend each month.",
    name: "Carlos R.",
    detail: "Quarterly member since 2023",
  },
  {
    quote:
      "With the annual plan I committed for real: routine, nutrition, and follow-ups. I've never been this consistent.",
    name: "Fernanda L.",
    detail: "Annual member since 2022",
  },
];
