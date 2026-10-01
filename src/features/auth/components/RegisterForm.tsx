import { useEffect } from "react";
import { SubmitBtn } from "@/components/buttons/Buttons";
import { LinkTo } from "@/components/links/LinkTo";
import { SocialAuthButtons } from "@/components/social/SocialAuthButtons";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { BackToLandingLink } from "@/features/auth/components/BackToLandingLink";
import { getRegisterFormConfig } from "@/features/auth/services/RegisterFormConfig";
import { UserPlus } from "lucide-react";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { useHandleRegister } from "@/features/auth/hooks/useRegisterHandler";
import { useAuthErrorLinkProvider } from "@/features/auth/hooks/useAuthErrorLinkProvider";

const PAGE_TITLE = "Register | Gym Admin";

const RegisterForm = () => {
  const { handleSubmit, isPending, error } = useHandleRegister();

  const linkConfig = useAuthErrorLinkProvider(error ?? undefined);

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <AuthCard aria-labelledby="auth-title">
      <AuthHeader
        title="Create your account"
        subtitle="Join Gym Admin to start tracking your training today."
        aside={
          <>
            Already have an account?{" "}
            <LinkTo
              label="Log in"
              to="/auth/login"
              className="text-sm"
              aria-label="Go to login"
            />
          </>
        }
      />

      <AppForm className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Fieldset aria-label="Register form" legend="User Register">
          <RegisterFormBody />
        </Fieldset>
        {linkConfig && (
          <LinkTo
            label={linkConfig.label}
            to={linkConfig.to}
            aria-label={linkConfig.ariaLabel}
            className="font-serif w-fit text-sky-500"
          />
        )}
        <SubmitBtn
          className="w-full"
          Icon={UserPlus}
          aria-label="Register button"
          disabled={isPending}
        >
          Create account
        </SubmitBtn>
      </AppForm>

      <SocialAuthButtons />

      <span className="h-px w-full bg-border" />

      <BackToLandingLink />
    </AuthCard>
  );
};

const config = getRegisterFormConfig();

const RegisterFormBody = () => (
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

export default RegisterForm;
