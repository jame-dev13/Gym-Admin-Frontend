import type { FaqItem } from "@/features/landing-page/types/LandingTypes";

export const getFaqConfig = (): FaqItem[] => faqConfig;

const faqConfig: FaqItem[] = [
  {
    question: "Do I need prior experience to join?",
    answer:
      "No. Your membership includes an initial assessment and a personalized routine for your level, from beginner to advanced.",
  },
  {
    question: "Can I switch memberships later?",
    answer:
      "Yes, you can upgrade or downgrade at any time. The adjustment applies to your next billing period, with no penalties.",
  },
  {
    question: "What are the gym's hours?",
    answer:
      "We're open Monday to Friday from 5:00 to 23:00, Saturdays from 7:00 to 20:00, and Sundays from 8:00 to 14:00.",
  },
  {
    question: "Do group classes cost extra?",
    answer:
      "On the Monthly, Quarterly, and Annual plans, group classes are unlimited at no additional cost.",
  },
  {
    question: "How do I sign up?",
    answer:
      "Create your free account with the Join now button and pick your membership. You can pay at the front desk or online.",
  },
];
