import { type FormEvent, useEffect } from "react";
import { SubmitBtn } from "@/components/buttons/Buttons";
import { LinkTo } from "@/components/links/LinkTo";
import { SocialAuthButtons } from "@/components/social/SocialAuthButtons";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { BackToLandingLink } from "@/features/auth/components/BackToLandingLink";
import { getLoginFormConfig } from "@/features/auth/services/LoginFormConfig";
import { UserRoundArrowLeft } from "lucide-react";

const PAGE_TITLE = "Login | Gym Admin";

const LoginForm = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

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

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <fieldset
          aria-label="Login form"
          className="flex min-h-fit flex-col items-center justify-center rounded-2xl border border-slate-300/30 bg-surface-over px-4 py-3.5"
        >
          <legend className="rounded-full bg-surface p-2.5 font-serif text-sm">
            User Login
          </legend>

          <section className="flex w-full flex-col shrink gap-3">
            <LoginFormBody />
          </section>
        </fieldset>
        <SubmitBtn className="w-full" Icon={UserRoundArrowLeft}>
          Login
        </SubmitBtn>
      </form>

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