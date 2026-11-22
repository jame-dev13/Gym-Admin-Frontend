import { AnnualResumeCards } from "@/features/payment/components/AnnualResumeCards";
import { useGetAnnualResume } from "@/features/payment/hooks/useFetchPaymentMetrics";

export const PaymentAnnualResumeCards = () => {
  const { data, error, isPending, isRefetching, refetch } =
    useGetAnnualResume();

  return (
    <AnnualResumeCards
      resume={data?.data}
      error={error}
      isPending={isPending}
      isRefetching={isRefetching}
      onRefetch={() => {
        void refetch();
      }}
    />
  );
};
