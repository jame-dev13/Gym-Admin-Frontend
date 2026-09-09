import { type FormEvent, useEffect } from "react";
import { SubmitBtn } from "@/components/buttons/Buttons";
import { LinkTo } from "@/components/links/LinkTo";
import { SocialAuthButtons } from "@/components/social/SocialAuthButtons";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { BackToLandingLink } from "@/features/auth/components/BackToLandingLink";
import { getRegisterFormConfig } from "@/features/auth/services/RegisterFormConfig";
import { UserPlus } from "lucide-react";

const PAGE_TITLE = "Register | Gym Admin";

const RegisterForm = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

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

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <fieldset
          aria-label="Register form"
          className="flex min-h-fit flex-col items-center justify-center rounded-2xl border border-slate-300/30 bg-surface-over px-4 py-3.5"
        >
          <legend className="rounded-full bg-surface p-2.5 font-serif text-sm">
            User Register
          </legend>

          <section className="flex w-full flex-col shrink gap-3">
            <RegisterFormBody />
          </section>
        </fieldset>
        <SubmitBtn className="w-full" Icon={UserPlus}>Create account</SubmitBtn>
      </form>

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
