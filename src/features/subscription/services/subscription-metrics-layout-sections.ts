import type { NavbarProps } from "@/components/navbar/NavbarTypes";
import type { NavbarLink } from "@/types/SharedTypes";
import {
  BarChart3,
  CircleDollarSign,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

export const SUBSCRIPTION_METRICS_SECTION_IDS = {
  summary: "subscription-metrics-summary",
  distribution: "subscription-metrics-distribution",
  worth: "subscription-metrics-worth",
} as const;

export type SubscriptionMetricsSection = Readonly<{
  id: string;
  headingId: string;
  title: string;
  description: string;
}>;

type SubscriptionMetricsSectionDefinition = SubscriptionMetricsSection &
  Readonly<{
    navbarLabel: string;
    Icon: LucideIcon;
  }>;

const BASE_PATH = "/administration/overview/subscriptions";

const SECTION_DEFINITIONS: ReadonlyArray<SubscriptionMetricsSectionDefinition> =
  [
    {
      id: SUBSCRIPTION_METRICS_SECTION_IDS.summary,
      headingId: "subscription-metrics-summary-heading",
      title: "Annual summary",
      description:
        "The current membership volume, accumulated net worth, and leading plan.",
      navbarLabel: "Summary",
      Icon: LayoutDashboard,
    },
    {
      id: SUBSCRIPTION_METRICS_SECTION_IDS.distribution,
      headingId: "subscription-metrics-distribution-heading",
      title: "Plan distribution",
      description:
        "How subscriptions are distributed across the available membership plans.",
      navbarLabel: "Plan mix",
      Icon: BarChart3,
    },
    {
      id: SUBSCRIPTION_METRICS_SECTION_IDS.worth,
      headingId: "subscription-metrics-worth-heading",
      title: "Net worth distribution",
      description:
        "The value each membership plan contributes to the subscription portfolio.",
      navbarLabel: "Net worth",
      Icon: CircleDollarSign,
    },
  ];

const LINKS: NavbarLink[] = SECTION_DEFINITIONS.map(
  ({ id, navbarLabel, Icon }) => ({
    href: `${BASE_PATH}#${id}`,
    label: navbarLabel,
    Icon,
  }),
);

const NAVBAR_CONFIG: NavbarProps = {
  links: LINKS,
  position: "sticky",
  "aria-label": "Subscription metrics sections",
  brand: "Subscription metrics",
};

const SECTIONS: ReadonlyArray<SubscriptionMetricsSection> =
  SECTION_DEFINITIONS.map(({ id, headingId, title, description }) => ({
    id,
    headingId,
    title,
    description,
  }));

export const getSubscriptionMetricsSections =
  (): ReadonlyArray<SubscriptionMetricsSection> => SECTIONS;

export const getSubscriptionMetricsNavbarConfig = (): NavbarProps =>
  NAVBAR_CONFIG;

export const getSubscriptionMetricsHrefSections = (): string[] =>
  LINKS.map(({ href }) => href?.split("#")[1] ?? "");
