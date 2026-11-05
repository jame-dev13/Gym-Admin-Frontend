import { ReceiptText, UserPlus, Users } from "lucide-react";
import type { NavbarProps } from "@/components/navbar/NavbarTypes";
import type { NavbarLink } from "@/types/SharedTypes";

export const EVOLUTION_SECTION_IDS = {
  customers: "evolution-customers",
  subscribers: "evolution-subscribers",
  revenue: "evolution-revenue",
} as const;

const links: NavbarLink[] = [
  {
    href: `#${EVOLUTION_SECTION_IDS.customers}`,
    label: "Customers",
    Icon: Users,
  },
  {
    href: `#${EVOLUTION_SECTION_IDS.subscribers}`,
    label: "Subscribers",
    Icon: UserPlus,
  },
  {
    href: `#${EVOLUTION_SECTION_IDS.revenue}`,
    label: "Revenue",
    Icon: ReceiptText,
  },
];

const evolutionNavbarConfig: NavbarProps = {
  links,
  position: "sticky",
  "aria-label": "Evolution sections",
   brand: "Evolution Layout"
};

export const getEvolutionNavbarConfig = (): NavbarProps =>
  evolutionNavbarConfig;
