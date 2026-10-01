import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { CommandBtn, SubmitBtn } from "@/components/buttons/Buttons";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { getVerificationFormConfig } from "@/features/auth/services/VerificationFormConfig";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { useHandleVerify } from "@/features/auth/hooks/useVerifyHandler";
import { RequestNewVerificationTokenLink } from "@/features/auth/components/RequestNewVerificationTokenLink";
import { EmailInput } from "@/components/input/Input";

const PAGE_TITLE = "Verification | Gym Admin";
const REGISTER_ROUTE = "/auth/register";

const VerificationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location?.state?.email ?? "";
  const { handleSubmit, isPending } = useHandleVerify();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  useEffect(() => {
    if (!emailFromState) {
      navigate(REGISTER_ROUTE, { replace: true });
    }
  }, [emailFromState, navigate]);

  if (!emailFromState) {
    return null;
  }

  return (
    <AuthCard aria-labelledby="auth-title">
      <AuthHeader
        title="Enter your verification code"
        subtitle="A one-time code was sent to your email or phone. Enter it below to continue."
        aside={
          <>
            Didn&apos;t receive it?{" "}
            <RequestNewVerificationTokenLink email={emailFromState} />
          </>
        }
      />

      <AppForm className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Fieldset aria-label="Verification form" legend="Verification Code">
          <EmailInput
            name="email"
            required
            defaultValue={emailFromState}
            aria-label="Email input"
            readOnly
          />
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
