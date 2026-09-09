import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, Send } from "lucide-react";
import { CommandBtn, SubmitBtn } from "@/components/buttons/Buttons";
import { LinkTo } from "@/components/links/LinkTo";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import {
  getEmailConfirmationConfig,
  getNewPasswordConfig,
} from "@/features/auth/services/PasswordResetConfig";

const PAGE_TITLE = "Reset Password | Gym Admin";

const PasswordResetForm = () => {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <AuthCard aria-labelledby="auth-title">
      <AuthHeader
        title={sent ? "Set a new password" : "Forgot your password?"}
        subtitle={
          sent
            ? "Choose a new password and confirm it below."
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

      <form
        className="flex flex-col gap-4"
        onSubmit={sent ? handlePasswordSubmit : handleEmailSubmit}
      >
        <fieldset
          aria-label={sent ? "New password form" : "Email confirmation form"}
          className="flex min-h-fit flex-col items-center justify-center rounded-2xl border border-slate-300/30 bg-surface-over px-4 py-3.5"
        >
          <legend className="rounded-full bg-surface p-2.5 font-serif text-sm">
            {sent ? "New Password" : "Email Confirmation"}
          </legend>

          <section
            key={sent ? "new-password-step" : "email-confirmation-step"}
            className="flex w-full flex-col shrink gap-3 animate-fade-in-scale"
          >
            {sent ? <PasswordResetBody /> : <EmailConfirmationBody />}
          </section>
        </fieldset>
        <SubmitBtn className="w-full" Icon={sent ? KeyRound : Send}>
          {sent ? "Reset password" : "Send reset link"}
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

const emailConfirmationConfig = getEmailConfirmationConfig();
const newPasswordConfig = getNewPasswordConfig();

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

const PasswordResetBody = () => (
  <>
    {newPasswordConfig.map(({ key, name, labelText,  autoComplete, required, Field }) => (
      <Field
        key={key}
        name={name}
        labelText={labelText}
        autoComplete={autoComplete}
        required={required}
      />
    ))}
  </>
);

export default PasswordResetForm;