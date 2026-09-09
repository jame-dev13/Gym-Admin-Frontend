import { useEffect } from "react";
import { IconFacebook, IconGoogle } from "@/components/icons/Icons";
import { LinkTo } from "@/components/links/LinkTo";
import { ArrowLeft, Dumbbell } from "lucide-react";

const PAGE_TITLE = "Register | Gym Admin";

const RegisterForm = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <main className="flex w-full flex-1 min-h-screen place-content-center place-items-center overflow-hidden bg-surface p-4 bg-[radial-gradient(circle_at_50%_-20%,rgba(34,211,238,0.15),transparent_55%)]">
      <article
        aria-labelledby="auth-title"
        className="animate-fade-in-up my-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-border bg-surface-raised p-8 shadow-2xl shadow-black/40"
      >
        <header className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 place-content-center place-items-center rounded-2xl bg-accent/10 ring-1 ring-accent/30">
            <Dumbbell size={26} className="text-accent" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h1
              id="auth-title"
              className="text-2xl font-bold tracking-tight text-text-primary"
            >
              Create your account
            </h1>
            <p className="text-sm text-text-secondary">
              Join Gym Admin to start tracking your training today.
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Already have an account?{" "}
              <LinkTo
                label="Log in"
                to="/auth/login"
                className="text-sm"
                aria-label="Go to login"
              />
            </p>
          </div>
        </header>

        <form className="flex flex-col gap-4">
          <fieldset
            aria-label="Register form"
            className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-surface-over px-4 py-6"
          >
            <legend className="sr-only">User Register</legend>
            <p className="text-sm text-text-tertiary">
              In development
            </p>
          </fieldset>
        </form>

        <footer className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <small className="text-xs font-medium uppercase tracking-widest text-text-tertiary">
              Sign in with
            </small>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-surface-over px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary"
              aria-label="Sign in with Google"
            >
              <IconGoogle />
              Google
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-surface-over px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary"
              aria-label="Sign in with Facebook"
            >
              <IconFacebook />
              Facebook
            </a>
          </div>

          <span className="h-px w-full bg-border" />

          <div className="flex justify-center">
            <LinkTo
              label="Back to Landing Page"
              Icon={ArrowLeft}
              to="/"
              className="text-sm"
              aria-label="Back to landing page"
            />
          </div>
        </footer>
      </article>
    </main>
  );
};

export default RegisterForm;
