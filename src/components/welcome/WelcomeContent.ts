import {
  Activity,
  Bell,
  CalendarCheck,
  HeartHandshake,
  MessageSquare,
  Receipt,
  UserRound,
} from "lucide-react";
import { WELCOME_SECTION_IDS } from "@/components/welcome/WelcomeSectionIds";
import type {
  WelcomeBenefit,
  WelcomeDashboardFeature,
  WelcomeFaqItem,
  WelcomeNavItem,
  WelcomeStep,
  WelcomeTestimonial,
} from "@/components/welcome/WelcomeTypes";

export const WELCOME_NAV_LINKS: WelcomeNavItem[] = [
  { href: `#${WELCOME_SECTION_IDS.benefits}`, label: "Benefits" },
  { href: `#${WELCOME_SECTION_IDS.dashboard}`, label: "Dashboard" },
  { href: `#${WELCOME_SECTION_IDS.howItWorks}`, label: "How it works" },
  { href: `#${WELCOME_SECTION_IDS.community}`, label: "Community" },
  { href: `#${WELCOME_SECTION_IDS.faq}`, label: "FAQ" },
];

export const WELCOME_HERO_TRUST_POINTS = [
  "No sign-up fees",
  "Cancel anytime",
  "Your data stays private",
] as const;

export const WELCOME_BENEFITS: WelcomeBenefit[] = [
  {
    Icon: CalendarCheck,
    title: "Clarity about your plan",
    description:
      "Know your subscription status, renewal date, and what comes next without asking anyone.",
    points: ["Live membership status", "Renewal reminders"],
  },
  {
    Icon: Receipt,
    title: "Payments in order",
    description:
      "Every charge and receipt lives in one timeline, ready whenever you need to check or download it.",
    points: ["Full payment history", "Receipts on demand"],
  },
  {
    Icon: Activity,
    title: "Progress you can see",
    description:
      "Check-ins, movements, and your personal log turn everyday effort into a story you can follow.",
    points: ["Personal activity log", "Trends over time"],
  },
  {
    Icon: HeartHandshake,
    title: "A community around you",
    description:
      "Share your experience, rate your journey, and read what other members think about theirs.",
    points: ["Comments and ratings", "Member feedback"],
  },
];

export const WELCOME_DASHBOARD_FEATURES: WelcomeDashboardFeature[] = [
  {
    Icon: UserRound,
    title: "Your profile, always current",
    description:
      "Keep your contact details and preferences up to date in a single place.",
  },
  {
    Icon: CalendarCheck,
    title: "Subscription status at a glance",
    description:
      "See your plan, its status, and your next renewal date as soon as you sign in.",
  },
  {
    Icon: Receipt,
    title: "Payments and receipts",
    description:
      "Review every charge and keep your receipts one click away.",
  },
  {
    Icon: Activity,
    title: "Movements and personal logs",
    description:
      "Follow your check-ins and activity history with a log only you and staff can see.",
  },
  {
    Icon: Bell,
    title: "Timely notifications",
    description:
      "Get a heads-up before your membership renews or comes to an end.",
  },
  {
    Icon: MessageSquare,
    title: "Your voice in the community",
    description:
      "Leave a comment or rating and see what other members are saying.",
  },
];

export const WELCOME_STEPS: WelcomeStep[] = [
  {
    Icon: UserRound,
    title: "You are already signed in",
    description:
      "Your account is active, so your profile and preferences are ready for you to review.",
  },
  {
    Icon: CalendarCheck,
    title: "Choose your membership",
    description:
      "Pick the plan that fits your pace. There are no sign-up fees or long commitments.",
  },
  {
    Icon: Activity,
    title: "Start tracking everything",
    description:
      "Your status, payments, activity, notifications, and community live in one dashboard.",
  },
];

export const WELCOME_TESTIMONIALS: WelcomeTestimonial[] = [
  {
    quote:
      "I can see my plan, payments, and check-ins in the same place. No more guessing or digging through messages.",
    name: "Mariana G.",
    detail: "Quarterly member",
    rating: 5,
  },
  {
    quote:
      "The reminder before my membership ends is a lifesaver. I renewed in a couple of minutes without leaving the page.",
    name: "Carlos R.",
    detail: "Monthly member",
    rating: 5,
  },
  {
    quote:
      "Reading what other members say makes the gym feel like a community, not just a place I go to train.",
    name: "Fernanda L.",
    detail: "Annual member",
    rating: 4,
  },
];

export const WELCOME_FAQS: WelcomeFaqItem[] = [
  {
    question: "Do I need a membership to use my account?",
    answer:
      "No. Your account is already active. You can explore everything here and activate a membership whenever you are ready.",
  },
  {
    question: "Where can I see my subscription status?",
    answer:
      "Once your membership is active, your dashboard shows your current plan, its status, and the next renewal date as soon as you sign in.",
  },
  {
    question: "How do payments and receipts work?",
    answer:
      "Every payment is recorded in your payment history. You can review the amount, date, and status, and download a receipt whenever you need one.",
  },
  {
    question: "Will I be notified before my membership ends?",
    answer:
      "Yes. You will receive timely notifications before your plan renews or expires, so there are no surprises and no missed benefits.",
  },
  {
    question: "Can I share my opinion with other members?",
    answer:
      "Yes. From your dashboard you can leave a comment or rating about your experience and read what other members have shared.",
  },
  {
    question: "Is my personal data private?",
    answer:
      "Your profile, payment history, and activity log are visible only to you and the authorized staff who support your membership.",
  },
];
