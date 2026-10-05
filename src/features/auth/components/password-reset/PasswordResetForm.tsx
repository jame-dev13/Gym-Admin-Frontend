import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { CommandBtn, SubmitBtn } from "@/components/buttons/Buttons";
import { LinkTo } from "@/components/links/LinkTo";
import { AuthCard, AuthHeader } from "@/features/auth/components/shared";
import { useHandlePasswordResetRequest } from "@/features/auth/hooks/password-reset";
import { getEmailConfirmationConfig } from "@/features/auth/services/password-reset";

const PAGE_TITLE = "Reset Password | Gym Admin";

const PasswordResetForm = () => {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const emailRef = useRef<string>("");
  const { handleSubmit: handleEmailSubmit, isPending: isRequestPending } =
    useHandlePasswordResetRequest(emailRef, () => {
      setSentEmail(emailRef.current);
      setSent(true);
    });

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <AuthCard aria-labelledby="auth-title">
      <AuthHeader
        title={sent ? "Check your email" : "Forgot your password?"}
        subtitle={
          sent
            ? "Your password reset link is on its way."
            : "Enter your email and we'll send you a link to reset your password."
        }
        aside={
          sent ? (
            <button
              type="button"
              className="text-sm font-medium text-accent underline-offset-4 transition-colors hover:underline"
              aria-label="Use a different email"
              onClick={() => setSent(false)}
            >
              Use a different email
            </button>
          ) : (
            <>
              Remembered it?{" "}
              <LinkTo
                label="Log in"
                to="/auth/login"
                className="text-sm"
                aria-label="Go to login"
              />
            </>
          )
        }
      />

      {sent ? (
        <section
          aria-label="Reset link sent confirmation"
          className="flex min-h-fit flex-col items-center justify-center gap-2 rounded-2xl border border-slate-300/30 bg-surface-over px-4 py-3.5 text-center animate-fade-in-scale"
        >
          <p className="text-sm text-text-primary">
            We sent a password reset link to{" "}
            <strong className="font-semibold">{sentEmail}</strong>.
          </p>
          <p className="text-sm text-text-secondary">
            Check your inbox and follow the link to continue with the reset
            process.
          </p>
        </section>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleEmailSubmit}>
          <fieldset
            aria-label="Email confirmation form"
            className="flex min-h-fit flex-col items-center justify-center rounded-2xl border border-slate-300/30 bg-surface-over px-4 py-3.5"
          >
            <legend className="rounded-full bg-surface p-2.5 font-serif text-sm">
              Email Confirmation
            </legend>

            <section
              key="email-confirmation-step"
              className="flex w-full flex-col shrink gap-3 animate-fade-in-scale"
            >
              <EmailConfirmationBody />
            </section>
          </fieldset>
          <SubmitBtn
            className="w-full"
            Icon={Send}
            disabled={isRequestPending}
          >
            Send reset link
          </SubmitBtn>
        </form>
      )}

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

const emailConfirmationConfig = getEmailConfirmationConfig();

const EmailConfirmationBody = () => (
  <>
    {emailConfirmationConfig.map(
      ({ key, name, autoComplete, required, Field }) => (
        <Field
          key={key}
          name={name}
          autoComplete={autoComplete}
          required={required}
        />
      ),
    )}
  </>
);

export default PasswordResetForm;