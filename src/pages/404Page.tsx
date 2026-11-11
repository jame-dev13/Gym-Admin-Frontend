import { useEffect } from "react";
import { Compass, Home, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const primaryLinkStyles = [
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-2",
  "rounded-xl",
  "bg-accent",
  "px-6",
  "py-2.5",
  "font-semibold",
  "text-surface",
  "transition-colors",
  "duration-200",
  "hover:bg-accent-emphasis",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-accent",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-surface",
].join(" ");

const secondaryLinkStyles = [
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-2",
  "rounded-xl",
  "border",
  "border-border-emphasis",
  "px-6",
  "py-2.5",
  "font-semibold",
  "text-text-primary",
  "transition-colors",
  "duration-200",
  "hover:border-accent",
  "hover:text-accent",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-accent",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-surface",
].join(" ");

const NotFoundPage = () => {
  useEffect(() => {
    document.title = "Gym Admin | Page not found";
  }, []);

  return (
    <main
      aria-labelledby="not-found-title"
      className="flex min-h-screen w-full flex-1 place-content-center place-items-center overflow-hidden bg-surface p-4 bg-[radial-gradient(circle_at_50%_-20%,rgba(34,211,238,0.15),transparent_55%)]"
    >
      <section className="animate-fade-in-scale my-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-border bg-surface-raised p-8 text-center shadow-2xl shadow-black/40">
        <header className="flex flex-col items-center gap-4">
          <span className="flex h-14 w-14 place-content-center place-items-center rounded-2xl bg-accent/10 ring-1 ring-accent/30">
            <Compass size={28} className="text-accent" aria-hidden="true" />
          </span>
          <p
            className="text-6xl font-extrabold tracking-tight text-accent"
            aria-hidden="true"
          >
            404
          </p>
          <div className="flex flex-col gap-2">
            <h1
              id="not-found-title"
              className="text-2xl font-bold tracking-tight text-text-primary"
            >
              Page not found
            </h1>
            <p className="text-sm leading-relaxed text-text-secondary">
              The page you are looking for does not exist or may have been
              moved. Go back to the home page or sign in to continue.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/" className={`${primaryLinkStyles} flex-1`}>
            <Home size={18} aria-hidden="true" />
            Back to home
          </Link>
          <Link to="/auth" className={`${secondaryLinkStyles} flex-1`}>
            <LogIn size={18} aria-hidden="true" />
            Go to sign in
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
