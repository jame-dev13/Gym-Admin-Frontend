import type { Membership } from "../types/LandingTypes";

export const getMembershipsConfig = (): Membership[] => membershipsConfig;

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export const formatMembershipPrice = (membership: Membership): string =>
  priceFormatter.format(membership.priceMXN);

const membershipsConfig: Membership[] = [
  {
    id: "biweekly",
    name: "Biweekly",
    priceMXN: 150,
    periodLabel: "/2 weeks",
    tagline: "Perfect for trying us out commitment-free.",
    perks: [
      "Full access to weights and cardio areas",
      "1 group class per week",
      "Daily-use locker",
    ],
  },
  {
    id: "monthly",
    name: "Monthly",
    priceMXN: 300,
    periodLabel: "/month",
    tagline: "The favorite for building the habit.",
    perks: [
      "Full access to weights and cardio areas",
      "Unlimited group classes",
      "Starter personalized routine",
      "Daily-use locker",
    ],
    featured: true,
  },
  {
    id: "quarterly",
    name: "Quarterly",
    priceMXN: 900,
    periodLabel: "/3 months",
    tagline: "A quarterly commitment with visible results.",
    perks: [
      "Everything in the Monthly plan",
      "Monthly fitness assessment",
      "Base meal plan",
      "Access to gym events",
    ],
  },
  {
    id: "annual",
    name: "Annual",
    priceMXN: 3600,
    periodLabel: "/year",
    tagline: "A full year for your best self.",
    perks: [
      "Everything in the Quarterly plan",
      "Personal trainer guidance",
      "Bring a friend every month",
      "Free official t-shirt",
    ],
  },
];
