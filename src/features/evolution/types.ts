export type CustomerEvolution = Readonly<{
  content: {
    monthlyEvolution: ReadonlyArray<EvolutionMonth>;
    evoInsights: EvolutionInsight;
  };
}>;

export type SubscriberEvolution = {
  content: {
    monthlyEvolution: ReadonlyArray<EvolutionMonth>;
    evoInsights: EvolutionInsight;
  };
};

type EvolutionMonth = {
  month: string;
  joins: number;
  downs: number;
};

type BillingMonth = {
  month: string;
  total: number;
};

export type BillingEvolution = {
  content: {
    monthlyEvolution: ReadonlyArray<BillingMonth>;
    billingInsights: Readonly<{
      totalRevenue: number;
      bestMonth: string;
      monthlyAverage: number;
    }>;
  };
};

export type EvolutionInsight = Readonly<{
  joiningTotal: number;
  downingTotal: number;
  netMovement: number;
}>;
