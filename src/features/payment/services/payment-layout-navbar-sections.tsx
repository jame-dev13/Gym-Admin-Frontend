import type { NavbarProps } from "@/components/navbar/NavbarTypes";
import type { NavbarLink } from "@/types/SharedTypes";
import { AudioWaveform, Receipt, ReceiptText } from "lucide-react";

const BASE_PATH = "/administration/overview/billings";

const LINKS: NavbarLink[] = [
  {
    label: "Annual resume",
    href: `${BASE_PATH}#annual-resume`,
    Icon: ReceiptText,
  },
  {
    label: "Investment evolution",
    href: `${BASE_PATH}#investment-evolution`,
    Icon: AudioWaveform,
  },
  {
    label: "Payments",
    href: `${BASE_PATH}#payments`,
    Icon: Receipt,
  },
];

const NAVBAR_SECTIONS: NavbarProps = {
  links: LINKS,
  "aria-label": "Payment layout sections",
  brand: "Payment layout",
};

export const getNavbarHrefSections = (): string[] =>
  LINKS.map(({ href }) => href?.split("#")[1] ?? "");

export const getNavbarSections = (): NavbarProps => NAVBAR_SECTIONS;
