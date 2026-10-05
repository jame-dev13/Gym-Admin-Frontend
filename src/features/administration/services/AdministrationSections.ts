import {
  Archive,
  BookOpen,
  CreditCard,
  DatabaseBackup,
  LayoutDashboard,
  LifeBuoy,
  MessageSquareText,
  ReceiptText,
  ScrollText,
  Star,
  UserRound,
  Users,
} from "lucide-react";
import type { SidebarSection } from "@/types/Types";

export const ADMINISTRATION_SECTIONS: SidebarSection[] = [
  {
    label: "Overview",
    links: [
      { to: "/administration", label: "Overview", Icon: LayoutDashboard },
      {
        to: "/administration/overview/subscriptions",
        label: "Subscriptions",
        Icon: CreditCard,
      },
      {
        to: "/administration/overview/customers",
        label: "Customers",
        Icon: Users,
      },
      {
        to: "/administration/overview/ratings",
        label: "Ratings",
        Icon: Star,
      },
      {
        to: "/administration/overview/billing",
        label: "Billing",
        Icon: ReceiptText,
      },
    ],
  },
  {
    label: "Services",
    links: [
      {
        to: "/administration/services/users",
        label: "Users",
        Icon: UserRound,
      },
      {
        to: "/administration/services/customers",
        label: "Customers",
        Icon: Users,
      },
      {
        to: "/administration/services/subscriptions",
        label: "Subscriptions",
        Icon: CreditCard,
      },
      {
        to: "/administration/services/audit-logs",
        label: "Audit Logs",
        Icon: ScrollText,
      },
      {
        to: "/administration/services/dumps",
        label: "Dumps",
        Icon: DatabaseBackup,
      },
    ],
  },
  {
    label: "Recycle Bin",
    links: [
      {
        to: "/administration/recycle/users",
        label: "Users",
        Icon: UserRound,
      },
      {
        to: "/administration/recycle/backups",
        label: "Backups",
        Icon: Archive,
      },
    ],
  },
  {
    label: "Support",
    links: [
      {
        to: "/administration/support/guide",
        label: "Guide",
        Icon: BookOpen,
      },
      {
        to: "/administration/support/comments",
        label: "Comments",
        Icon: MessageSquareText,
      },
      {
        to: "/administration/support/help-center",
        label: "Help Center",
        Icon: LifeBuoy,
      },
    ],
  },
];
