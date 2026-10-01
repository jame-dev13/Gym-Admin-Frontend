import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { CommandBtn, SubmitBtn } from "@/components/buttons/Buttons";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { getVerificationFormConfig } from "@/features/auth/services/VerificationFormConfig";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { useHandleVerify } from "@/features/auth/hooks/useVerifyHandler";

const PAGE_TITLE = "Verification | Gym Admin";

const VerificationForm = () => {
  const navigate = useNavigate();
  const { handleSubmit, isPending } = useHandleVerify();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <AuthCard aria-labelledby="auth-title">
      <AuthHeader
        title="Enter your verification code"
        subtitle="A one-time code was sent to your email or phone. Enter it below to continue."
        aside={
          <>
            Didn&apos;t receive it?{" "}
            <button
              type="button"
              className="text-sm font-medium text-accent underline-offset-4 transition-colors hover:underline"
              aria-label="Resend verification code"
            >
              Resend code
            </button>
          </>
        }
      />

      <AppForm className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Fieldset aria-label="Verification form" legend="Verification Code">
          <VerificationFormBody />
        </Fieldset>
        <SubmitBtn
          className="w-full"
          Icon={ShieldCheck}
          aria-label="Verify button"
          disabled={isPending}
        >
          Verify
        </SubmitBtn>
      </AppForm>

      <span className="h-px w-full bg-border" />

      <div className="flex justify-center">
        <CommandBtn
          Icon={ArrowLeft}
          onClick={() => navigate(-1)}
          aria-label="Go back to previous page"
        >
          Back
        </CommandBtn>
      </div>
    </AuthCard>
  );
};

const config = getVerificationFormConfig();

const VerificationFormBody = () => (
  <>
    {config.map(({ key, name, autoComplete, required, Field }) => (
      <Field
        key={key}
        name={name}
        autoComplete={autoComplete}
        required={required}
      />
    ))}
  </>
);

export default VerificationForm;