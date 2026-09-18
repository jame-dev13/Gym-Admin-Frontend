import { Component, type ErrorInfo, type ReactNode } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { CommandBtn } from "@/components/buttons/Buttons";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, info);
    } else {
      console.error(error, info);
    }
  }

  private handleReset = (): void => {
    this.props.onReset?.();
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <section
          role="alert"
          aria-live="assertive"
          className="flex min-h-screen items-center justify-center bg-surface p-4 bg-[radial-gradient(circle_at_50%_-20%,rgba(34,211,238,0.15),transparent_55%)]"
        >
          <div className="animate-fade-in-scale w-full max-w-md rounded-3xl border border-border bg-surface-raised p-8 text-center shadow-xl shadow-black/10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 ring-1 ring-danger/30">
              <TriangleAlert
                size={28}
                className="text-danger"
                aria-hidden="true"
              />
            </span>
            <h2 className="mt-4 text-xl font-bold tracking-tight text-text-primary">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              We ran into an unexpected problem. Try again to continue where you
              left off.
            </p>
            <CommandBtn
              Icon={RotateCcw}
              onClick={this.handleReset}
              aria-label="Try again"
              className="mt-6 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Try again
            </CommandBtn>
            <p className="mt-4 text-xs text-text-tertiary">
              If the problem persists, reload the page.
            </p>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
