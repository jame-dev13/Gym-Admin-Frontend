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
    title: "Subscription",
    description:
      "Check the details of your current membership plan and its renewal status.",
  },
  {
    path: "my/payments",
    title: "Payments",
    description:
      "Browse the payments registered on your account and their current status.",
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
