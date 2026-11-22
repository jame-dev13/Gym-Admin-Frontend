import { AnnualResumeCards } from "@/features/payment/components/AnnualResumeCards";
import { useGetAnnualCurrentResume } from "@/features/payment/hooks/useFetchPaymentCurrentMetrics";

const ERROR_MESSAGE = "Your annual payment summary could not be loaded.";

export const PaymentCurrentAnnualResumeCards = () => {
  const { data, error, isPending, isRefetching, refetch } =
    useGetAnnualCurrentResume();

  return (
    <AnnualResumeCards
      resume={data?.data}
      error={error}
      isPending={isPending}
      isRefetching={isRefetching}
      errorMessage={ERROR_MESSAGE}
      onRefetch={() => {
        void refetch();
      }}
    />
  );
};
