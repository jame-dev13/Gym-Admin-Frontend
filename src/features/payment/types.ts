import type { Content } from "@/types/SharedTypes";
import type { Identifiable } from "@/types/Types";

export type PaymentResponse = Readonly<
  Identifiable & {
    amount: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
  }
>;

export type AnnualResumeResponse = Readonly<{
  totalPaymentsMade: number;
  totalExpend: number;
  average: number;
  electronicPaymentsDone: number;
  physicPaymentsDone: number;
}>;

export type InvestmentEvolution = Content<{
  month: string;
  total: number;
}>;
