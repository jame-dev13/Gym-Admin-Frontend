import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound } from "lucide-react";
import { CommandBtn, SubmitBtn } from "@/components/buttons/Buttons";
import { LinkTo } from "@/components/links/LinkTo";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { useHandleResetPassword } from "@/features/auth/hooks/usePasswordResetHandler";
import { getSetPasswordConfig } from "@/features/auth/services/PasswordResetConfig";

const PAGE_TITLE = "Set New Password | Gym Admin";
const PASSWORD_MISMATCH_MESSAGE = "Passwords do not match";
const CONFIRM_PASSWORD_FIELD = "confirmPassword";

const SetPasswordForm = () => {
  const navigate = useNavigate();
  const [mismatch, setMismatch] = useState(false);
  const { handleSubmit, isPending } = useHandleResetPassword();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  const handleFormChange = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const confirmPassword = formData.get(CONFIRM_PASSWORD_FIELD);
    setMismatch(
      typeof confirmPassword === "string" &&
        confirmPassword.length > 0 &&
        formData.get("password") !== confirmPassword,
    );
  };

  return (
    <AuthCard aria-labelledby="auth-title">
      <AuthHeader
        title="Set a new password"
        subtitle="Enter your email, then choose a new password and confirm it below."
        aside={
          <>
            Remembered it?{" "}
            <LinkTo
              label="Log in"
              to="/auth/login"
              className="text-sm"
              aria-label="Go to login"
            />
          </>
        }
      />

      <AppForm
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        onChange={handleFormChange}
      >
        <Fieldset aria-label="Set new password form" legend="New Password">
          <SetPasswordBody mismatch={mismatch} />
        </Fieldset>
        <SubmitBtn
          className="w-full"
          Icon={KeyRound}
          aria-label="Set new password button"
          disabled={isPending || mismatch}
        >
          Set new password
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

const setPasswordConfig = getSetPasswordConfig();

const SetPasswordBody = ({ mismatch }: { mismatch: boolean }) => (
  <>
    {setPasswordConfig.map(
      ({ key, name, labelText, autoComplete, required, Field }) => (
        <Field
          key={key}
          name={name}
          labelText={labelText}
          autoComplete={autoComplete}
          required={required}
          error={
            name === CONFIRM_PASSWORD_FIELD && mismatch
              ? PASSWORD_MISMATCH_MESSAGE
              : undefined
          }
        />
      ),
    )}
  </>
);

export default SetPasswordForm;
