import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { CommandBtn, SubmitBtn } from "@/components/buttons/Buttons";
import { LinkTo } from "@/components/links/LinkTo";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { EmailInput } from "@/components/input/Input";
import { useHandleRecover } from "@/features/auth/hooks/useRecoveryHandler";
import { getRecoveryActivateConfig } from "@/features/auth/services/RecoveryFormConfig";
import { RecoveryRequestForm } from "@/features/auth/components/RecoveryRequestForm";

const PAGE_TITLE = "Recover Account | Gym Admin";

const RecoveryForm = () => {
  const navigate = useNavigate();
  const { handleSubmit, isPending } = useHandleRecover();
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const emailRef = useRef<string>("");

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <AuthCard aria-labelledby="auth-title">
      <AuthHeader
        title={sent ? "Enter your recovery code" : "Recover your account"}
        subtitle={
          sent
            ? `We sent a recovery code to ${sentEmail}. Enter it below to recover your account.`
            : "Enter your account email and we'll send you a recovery code."
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

      {!sent ? (
        <RecoveryRequestForm
          emailRef={emailRef}
          onSuccess={() => {
            setSentEmail(emailRef.current);
            setSent(true);
          }}
        />
      ) : (
        <AppForm className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Fieldset aria-label="Recovery form" legend="Account Recovery">
            <EmailInput
              name="email"
              labelText="Email"
              autoComplete="email"
              defaultValue={sentEmail}
              readOnly
              required
            />
            <RecoveryActivateBody />
          </Fieldset>
          <SubmitBtn
            className="w-full"
            Icon={ShieldCheck}
            aria-label="Recover button"
            disabled={isPending}
          >
            Recover
          </SubmitBtn>
        </AppForm>
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

const recoveryActivateConfig = getRecoveryActivateConfig();

const RecoveryActivateBody = () => (
  <>
    {recoveryActivateConfig.map(
      ({
        key,
        name,
        autoComplete,
        required,
        Field,
        "aria-label": ariaLabel,
      }) => (
        <Field
          key={key}
          name={name}
          autoComplete={autoComplete}
          required={required}
          aria-label={ariaLabel}
        />
      ),
    )}
  </>
);

export default RecoveryForm;
