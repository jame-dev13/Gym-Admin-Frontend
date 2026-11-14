import { lazy, type JSX, type LazyExoticComponent } from "react";

export type AdministrationPanelRoute = {
  path: string;
  title: string;
  description: string;
  Element?: LazyExoticComponent<() => JSX.Element>
};

export const administrationPanelRoutes: AdministrationPanelRoute[] = [
  {
    path: "settings",
    title: "Settings",
    description:
      "Manage your account details and control gym-wide notifications from one place.",
    Element: lazy(() =>
      import("@/features/administration/layouts/AdminSettingsLayout").then(
        (mod) => ({
          default: mod.AdminSettingsLayout,
        }),
      ),
    ),
  },
  {
    path: "overview/subscriptions",
    title: "Subscriptions",
    description:
      "Track plan distribution, membership volume, and net worth at a glance.",
    Element: lazy(() =>
      import("@/features/subscription/layouts/SubscriptionMetricsLayout").then(
        (mod) => ({
          default: mod.SubscriptionMetricsLayout,
        }),
      ),
    ),
  },
  {
    path: "overview/rankings",
    title: "Rankings",
    description:
      "Compare membership plans and subscription periods by the number of subscriptions they generated.",
    Element: lazy(() =>
      import("@/features/ranking/layouts/RankingLayout").then((mod) => ({
        default: mod.RankingLayout,
      })),
    ),
  },
  {
    path: "overview/evolution",
    title: "Evolution",
    description:
      "Follow customer, subscriber, and billing evolution month by month across the selected year.",
    Element: lazy(() =>
      import("@/features/evolution/layouts/EvolutionLayout").then((mod) => ({
        default: mod.EvolutionLayout,
      })),
    ),
  },
  {
    path: "overview/billings",
    title: "Billing",
    description:
      "Review annual payment performance, monthly investment evolution, and transaction history.",
    Element: lazy(() =>
      import("@/features/payment/layouts/PaymentAdministrationLayout").then(
        (mod) => ({
          default: mod.PaymentAdministrationLayout,
        }),
      ),
    ),
  },
  {
    path: "services/users",
    title: "Users",
    description:
      "Create, edit, and deactivate gym staff and administrator accounts. Management tools will be added here.",
    Element: lazy(() =>
      import("@/features/user/layouts/UserLayout").then((mod) => ({
        default: mod.UserLayout,
      })),
    ),
  },
  {
    path: "services/customers",
    title: "Customers",
    description:
      "Create, edit, and manage customer profiles and memberships. Management tools will be added here.",
    Element: lazy(() =>
      import("@/features/customer/layouts/CustomerTableLayout").then((mod) => ({
        default: mod.CustomerTableLayout,
      })),
    ),
  },
  {
    path: "services/subscriptions",
    title: "Subscriptions",
    description:
      "Create, edit, and cancel subscription plans and assignments. Management tools will be added here.",
    Element: lazy(() =>
      import("@/features/subscription/layouts/SubscriptionLayout").then(
        (mod) => ({
          default: mod.SubscriptionLayout,
        }),
      ),
    ),
  },
  {
    path: "services/audit-logs",
    title: "Audit Logs",
    description:
      "Inspect a chronological record of administrative actions. The audit trail will be added here.",
    Element: lazy(() =>
      import("@/features/audit/layouts/AuditLogLayout").then((mod) => ({
        default: mod.AuditLogLayout,
      })),
    ),
  },
  {
    path: "services/dumps",
    title: "Dumps",
    description:
      "Generate and download full data exports. Export tools will be added here.",
    Element: lazy(() =>
      import("@/features/backup/layouts/BackupLayout").then((mod) => ({
        default: mod.BackupLayout,
      })),
    ),
  },
  {
    path: "recycle/users",
    title: "Users",
    description:
      "Restore recently deleted user accounts or remove them permanently. Recovery tools will be added here.",
    Element: lazy(() => import("@/features/user/layouts/UserRecycleLayout")),
  },
  {
    path: "recycle/backups",
    title: "Backups",
    description:
      "Browse stored backups and restore the system from a snapshot. Restore tools will be added here.",
    Element: lazy(() => import("@/features/backup/layouts/BackupRecycleLayout")),
  },
  {
    path: "support/guide",
    title: "Guide",
    description:
      "Step-by-step instructions for everyday administration tasks, including record lifecycles, recovery paths, and backups.",
    Element: lazy(() =>
      import("@/features/administration/layouts/GuideLayout").then((mod) => ({
        default: mod.GuideLayout,
      })),
    ),
  },
  {
    path: "support/comments",
    title: "Comments",
    description:
      "Read and moderate member comments and feedback, including ratings and comment metadata.",
    Element: lazy(() =>
      import("@/features/comments/layouts/CommentLayout").then((mod) => ({
        default: mod.CommentLayout,
      })),
    ),
  },
  {
    path: "support/help-center",
    title: "Help Center",
    description:
      "Find answers to common questions and contact support. Help articles will be added here.",
  },
];
