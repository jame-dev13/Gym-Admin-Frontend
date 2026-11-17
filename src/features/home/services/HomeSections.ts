import {
  CreditCard,
  LayoutDashboard,
  MessageSquareText,
  MessagesSquare,
  ReceiptText,
  ScrollText,
  Settings,
  Wallet,
} from "lucide-react";
import type { SidebarSection } from "@/types/Types";

export const HOME_SECTIONS: SidebarSection[] = [
  {
    label: "Overview",
    links: [
      { to: "/home", label: "Overview", Icon: LayoutDashboard },
      {
        to: "/home/overview/billing",
        label: "Billing",
        Icon: ReceiptText,
      },
    ],
  },
  {
    label: "My",
    links: [
      {
        to: "/home/my/subscription",
        label: "Subscription",
        Icon: CreditCard,
      },
      {
        to: "/home/my/payments",
        label: "Payments",
        Icon: Wallet,
      },
      {
        to: "/home/my/comments",
        label: "Comments",
        Icon: MessageSquareText,
      },
      {
        to: "/home/my/trace",
        label: "Trace",
        Icon: ScrollText,
      },
    ],
  },
  {
    label: "Community",
    links: [
      {
        to: "/home/community/comments",
        label: "Comments",
        Icon: MessagesSquare,
      },
    ],
  },
  {
    label: "Settings",
    links: [
      {
        to: "/home/settings",
        label: "Settings",
        Icon: Settings,
      },
    ],
  },
];
