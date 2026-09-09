import { IconFacebook, IconGoogle } from "@/components/icons/Icons";
import { LinkTo } from "@/components/links/LinkTo";
import { Dumbbell, UserPenIcon } from "lucide-react";
import { Outlet, useOutlet } from "react-router-dom";

const AuthLayout = () => {
  const outlet = useOutlet();

  if (outlet) {
    return <Outlet />;
  }

  return (
    <main className="flex w-full flex-1 min-h-screen place-content-center place-items-center overflow-hidden bg-surface p-4 bg-[radial-gradient(circle_at_50%_-20%,rgba(34,211,238,0.15),transparent_55%)]">
      <section className="animate-fade-in-scale my-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-border bg-surface-raised p-8 shadow-2xl shadow-black/40">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 place-content-center place-items-center rounded-2xl bg-accent/10 ring-1 ring-accent/30">
            <Dumbbell size={28} className="text-accent" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              Gym Admin
            </h1>
            <p className="text-sm leading-relaxed text-text-secondary">
              Sign in or create your account to manage your training, routines,
              and progress all in one place.
            </p>
          </div>
        </header>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <small className="text-xs font-medium uppercase tracking-widest text-text-tertiary">
            Continue with
          </small>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="flex items-center justify-center gap-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface-over transition-colors hover:border-accent/50 hover:bg-accent/5"
            aria-hidden="true"
          >
            <IconGoogle />
          </span>
          <span
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface-over transition-colors hover:border-accent/50 hover:bg-accent/5"
            aria-hidden="true"
          >
            <IconFacebook />
          </span>
        </div>

        <footer className="flex flex-col gap-3">
          <p className="text-center text-sm text-text-secondary">
            Or create an account on our application to get started.
          </p>
          <div className="flex justify-center">
            <LinkTo
              label="Try on"
              Icon={UserPenIcon}
              to="/auth/login"
              className="rounded-xl bg-sky-600 px-6 py-2.5 font-semibold hover:text-surface-raised hover:bg-accent-emphasis hover:no-underline"
              aria-label="Go to login"
            />
          </div>
        </footer>
      </section>
    </main>
  );
};

export default AuthLayout;
