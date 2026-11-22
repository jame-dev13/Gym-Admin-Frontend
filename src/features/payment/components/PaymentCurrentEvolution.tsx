import { PaymentEvolutionChart } from "@/features/payment/components/PaymentEvolutionChart";
import { useGetCurrentEvolution } from "@/features/payment/hooks/useFetchPaymentCurrentMetrics";

const ERROR_MESSAGE = "Your billing evolution could not be loaded.";

export const PaymentCurrentEvolution = () => {
  const { data, error, isPending, isRefetching, refetch } =
    useGetCurrentEvolution();

  return (
    <PaymentEvolutionChart
      months={data?.data.content ?? []}
      error={error}
      isPending={isPending}
      isRefetching={isRefetching}
      errorMessage={ERROR_MESSAGE}
      ariaLabel="Billing evolution by month"
      onRefetch={() => {
        void refetch();
      }}
    />
  );
};
