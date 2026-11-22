import type { NavbarProps } from "@/components/navbar/NavbarTypes";
import type { NavbarLink } from "@/types/SharedTypes";
import { AudioWaveform, Receipt, ReceiptText } from "lucide-react";

export const PAYMENT_CURRENT_SECTION_IDS = {
  resume: "payment-current-resume",
  evolution: "payment-current-evolution",
  payments: "payment-current-payments",
} as const;

const LINKS: NavbarLink[] = [
  {
    href: `#${PAYMENT_CURRENT_SECTION_IDS.resume}`,
    label: "Annual resume",
    Icon: ReceiptText,
  },
  {
    href: `#${PAYMENT_CURRENT_SECTION_IDS.evolution}`,
    label: "Billing evolution",
    Icon: AudioWaveform,
  },
  {
    href: `#${PAYMENT_CURRENT_SECTION_IDS.payments}`,
    label: "Payments",
    Icon: Receipt,
  },
];

const NAVBAR_SECTIONS: NavbarProps = {
  links: LINKS,
  brand: "Payments",
  position: "sticky",
  "aria-label": "Payment sections",
};

export const getPaymentCurrentNavbarConfig = (): NavbarProps =>
  NAVBAR_SECTIONS;
