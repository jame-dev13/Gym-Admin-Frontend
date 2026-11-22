import { PaymentEvolutionChart } from "@/features/payment/components/PaymentEvolutionChart";
import { useGetInvestmentEvolution } from "@/features/payment/hooks/useFetchPaymentMetrics";

export const PaymentInvestmentEvolution = () => {
  const { data, error, isPending, isRefetching, refetch } =
    useGetInvestmentEvolution();

  return (
    <PaymentEvolutionChart
      months={data?.data.content ?? []}
      error={error}
      isPending={isPending}
      isRefetching={isRefetching}
      onRefetch={() => {
        void refetch();
      }}
    />
  );
};
