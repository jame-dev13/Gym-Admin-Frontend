import { AppForm } from "@/components/form/AppForm";
import { useRetryPaymentHandler } from "@/features/payment/hooks/handlers/useRetryPaymentHandler";
import { RefreshCcwDot } from "lucide-react";

export const RetryPaymentBtn = () => {
  const { isPending, submit } = useRetryPaymentHandler();
  return (
    <AppForm onSubmit={submit} className={"p-0"}>
      <button
        aria-busy={isPending}
        disabled={isPending}
        aria-disabled={isPending}
        aria-label={"Button retry payment."}
        className={
          "inline-flex gap-2 w-full items-center justify-center p-2 bg-amber-300 text-amber-900 hover:bg-amber-400 hover:text-amber-950 text-sm rounded-2xl border border-amber-800 font-bold transition-colors duration-200 ease-in"
        }
      >
        <RefreshCcwDot
          className={`${isPending ? "animate-spin" : ""}`}
          size={20}
        />
        {!isPending && <span className={"max-sm:hidden"}>Retry</span>}
      </button>
    </AppForm>
  );
};
