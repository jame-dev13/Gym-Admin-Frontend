import { useEffect } from "react";
import { SubmitBtn } from "@/components/buttons/Buttons";
import { LinkTo } from "@/components/links/LinkTo";
import { SocialAuthButtons } from "@/components/social/SocialAuthButtons";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { BackToLandingLink } from "@/features/auth/components/BackToLandingLink";
import { getLoginFormConfig } from "@/features/auth/services/LoginFormConfig";
import { UserRoundArrowLeft } from "lucide-react";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { useHandleLogin } from "@/features/auth/hooks/useLoginHandler";

const PAGE_TITLE = "Login | Gym Admin";

const LoginForm = () => {
  const { handleSubmit, isPending } = useHandleLogin();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <AuthCard aria-labelledby="auth-title">
      <AuthHeader
        title="Welcome back"
        subtitle="Log in to your account to pick up where you left off."
        aside={
          <>
            Don&apos;t have an account?{" "}
            <LinkTo
              label="Create one"
              to="/auth/register"
              className="text-sm"
              aria-label="Go to register"
            />
          </>
        }
      />

      <AppForm className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Fieldset aria-label="Login form" legend="User Login">
          <section className="flex w-full flex-col shrink gap-3">
            <LoginFormBody />
          </section>
        </Fieldset>
        <SubmitBtn
          className="w-full"
          Icon={UserRoundArrowLeft}
          aria-label="Login button"
          disabled={isPending}
        >
          Login
        </SubmitBtn>
      </AppForm>

      <SocialAuthButtons />

      <span className="h-px w-full bg-border" />

      <BackToLandingLink />
    </AuthCard>
  );
};

const config = getLoginFormConfig();

const LoginFormBody = () => (
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

export default LoginForm;
