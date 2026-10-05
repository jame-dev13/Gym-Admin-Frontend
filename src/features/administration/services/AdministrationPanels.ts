export type AdministrationPanelRoute = {
  path: string;
  title: string;
  description: string;
};

export const administrationPanelRoutes: AdministrationPanelRoute[] = [
  {
    path: "overview/subscriptions",
    title: "Subscriptions",
    description:
      "Track plan distribution, renewals, and churn at a glance. Detailed metrics will be added here.",
  },
  {
    path: "overview/customers",
    title: "Customers",
    description:
      "Monitor customer growth and activity. Detailed metrics will be added here.",
  },
  {
    path: "overview/ratings",
    title: "Ratings",
    description:
      "Review average ratings and recent member feedback. Detailed metrics will be added here.",
  },
  {
    path: "overview/billing",
    title: "Billing",
    description:
      "Follow revenue, invoices, and pending payments. Detailed metrics will be added here.",
  },
  {
    path: "services/users",
    title: "Users",
    description:
      "Create, edit, and deactivate gym staff and administrator accounts. Management tools will be added here.",
  },
  {
    path: "services/customers",
    title: "Customers",
    description:
      "Create, edit, and manage customer profiles and memberships. Management tools will be added here.",
  },
  {
    path: "services/subscriptions",
    title: "Subscriptions",
    description:
      "Create, edit, and cancel subscription plans and assignments. Management tools will be added here.",
  },
  {
    path: "services/audit-logs",
    title: "Audit Logs",
    description:
      "Inspect a chronological record of administrative actions. The audit trail will be added here.",
  },
  {
    path: "services/dumps",
    title: "Dumps",
    description:
      "Generate and download full data exports. Export tools will be added here.",
  },
  {
    path: "recycle/users",
    title: "Users",
    description:
      "Restore recently deleted user accounts or remove them permanently. Recovery tools will be added here.",
  },
  {
    path: "recycle/backups",
    title: "Backups",
    description:
      "Browse stored backups and restore the system from a snapshot. Restore tools will be added here.",
  },
  {
    path: "support/guide",
    title: "Guide",
    description:
      "Step-by-step instructions for everyday administration tasks. The guide will be added here.",
  },
  {
    path: "support/comments",
    title: "Comments",
    description:
      "Read and moderate member comments and feedback. Moderation tools will be added here.",
  },
  {
    path: "support/help-center",
    title: "Help Center",
    description:
      "Find answers to common questions and contact support. Help articles will be added here.",
  },
];
