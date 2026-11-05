import type { Content } from "@/types/SharedTypes";

type EvolutionType = {
  month: string;
  evolutionValue: number;
};

export type CustomerEvolution = Content<EvolutionType>;

export type SubscriberEvolution = Content<EvolutionType>;

export type BillingEvolution = Content<{
  month: string;
  total: number;
}>;
