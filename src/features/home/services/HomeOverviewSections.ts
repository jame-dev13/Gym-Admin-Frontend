import type { NavbarProps } from "@/components/navbar/NavbarTypes";
import type { NavbarLink } from "@/types/SharedTypes";
import { CreditCard, ReceiptText, Wallet } from "lucide-react";

export const HOME_OVERVIEW_SECTION_IDS = {
  lastPayment: "home-overview-last-payment",
  payments: "home-overview-payments",
  subscription: "home-overview-subscription",
} as const;

const LINKS: NavbarLink[] = [
  {
    href: `#${HOME_OVERVIEW_SECTION_IDS.lastPayment}`,
    label: "Last payment",
    Icon: ReceiptText,
  },
  {
    href: `#${HOME_OVERVIEW_SECTION_IDS.payments}`,
    label: "My payments",
    Icon: Wallet,
  },
  {
    href: `#${HOME_OVERVIEW_SECTION_IDS.subscription}`,
    label: "Current subscription",
    Icon: CreditCard,
  },
];

const NAVBAR_SECTIONS: NavbarProps = {
  links: LINKS,
  brand: "Overview",
  position: "sticky",
  "aria-label": "Home overview sections",
};

export const getHomeOverviewNavbarConfig = () => NAVBAR_SECTIONS;
