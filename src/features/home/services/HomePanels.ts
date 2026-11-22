import { lazy, type JSX, type LazyExoticComponent } from "react";

export type HomePanelRoute = {
  path: string;
  title: string;
  description: string;
  Element?: LazyExoticComponent<() => JSX.Element>;
};

export const homePanelRoutes: HomePanelRoute[] = [
  {
    path: "overview/billing",
    title: "Billing",
    description:
      "Review your billing history and keep track of every charge tied to your membership.",
  },
  {
    path: "my/subscription",
    title: "Subscription overview",
    description:
      "Review your current membership, its payment status, and the actions available for it.",
    Element: lazy(() =>
      import("@/features/subscription/layouts/SubscriptionOverviewLayout").then(
        (mod) => ({
          default: mod.SubscriptionOverviewLayout,
        }),
      ),
    ),
  },
  {
    path: "my/payments",
    title: "Payments",
    description:
      "Browse the payments registered on your account and their current status.",
    Element: lazy(() =>
      import("@/features/payment/layouts/PaymentBillingLayout").then((mod) => ({
        default: mod.PaymentBillingLayout,
      })),
    ),
  },
  {
    path: "my/comments",
    title: "Comments",
    description:
      "Read the comments you have shared and follow up on any pending feedback.",
  },
  {
    path: "my/trace",
    title: "Trace",
    description:
      "Follow a chronological record of the activity linked to your account.",
    Element: lazy(
      () => import("@/features/audit/layouts/AuditLogCurrentLayout"),
    ),
  },
  {
    path: "community/comments",
    title: "Comments",
    description:
      "Discover what other members are saying and join the community conversation.",
  },
  {
    path: "settings",
    title: "Settings",
    description:
      "Manage your account details and keep your personal information up to date.",
    Element: lazy(() =>
      import("@/features/home/layouts/HomeSettingsLayout").then((mod) => ({
        default: mod.HomeSettingsLayout,
      })),
    ),
  },
];
