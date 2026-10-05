import { AppForm } from "@/components/form/AppForm";
import { useResendVerificationToken } from "@/features/auth/hooks/verification";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useEffect, useState, type FC } from "react";

export const RequestNewVerificationTokenLink: FC<{ email: string }> = ({
  email,
}) => {
  const [debTimer, setDebTimer] = useState(0);

  const isDebouncing = debTimer > 0;

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isDebouncing && debTimer > 0) {
      timer = setInterval(() => {
        setDebTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isDebouncing, debTimer]);

  const hook = useResendVerificationToken(email);

  const { submit, isPending } = useMutationHandler({
    mutationHook: () => hook,
    resultHandlers: {
      onSuccess: () => {
        setDebTimer(60);
      },
    },
  });

  return (
    <AppForm className="p-0 w-fit" onSubmit={submit}>
      <button
        type="submit"
        className={`text-sm font-medium text-accent underline-offset-4 transition-colors hover:underline ${isDebouncing || isPending ? "cursor-not-allowed opacity-50" : ""}`}
        aria-label="Resend verification code"
        role="link"
        disabled={isDebouncing || isPending}
      >
        {isDebouncing ? `Resend code in ${debTimer}s` : "Resend code"}
      </button>
    </AppForm>
  );
};
