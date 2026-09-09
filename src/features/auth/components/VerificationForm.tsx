import { type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { CommandBtn, SubmitBtn } from "@/components/buttons/Buttons";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { getVerificationFormConfig } from "@/features/auth/services/VerificationFormConfig";

const PAGE_TITLE = "Verification | Gym Admin";

const VerificationForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

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

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <fieldset
          aria-label="Verification form"
          className="flex min-h-fit flex-col items-center justify-center rounded-2xl border border-slate-300/30 bg-surface-over px-4 py-5"
        >
          <legend className="rounded-full bg-surface p-2.5 font-serif text-sm">
            Verification Code
          </legend>

          <section className="flex w-full flex-col shrink gap-3">
            <VerificationFormBody />
          </section>
        </fieldset>
        <SubmitBtn className="w-full" Icon={ShieldCheck}>
          Verify
        </SubmitBtn>
      </form>

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