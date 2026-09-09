import { IconFacebook, IconGoogle } from "@/components/icons/Icons";
import type { SocialAuthButtonsProps } from "@/types/Props";

const providerButtonStyles = [
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-2.5",
  "rounded-xl",
  "border",
  "border-border",
  "bg-surface-over",
  "px-4",
  "py-2.5",
  "text-sm",
  "font-medium",
  "text-text-secondary",
  "transition",
  "duration-200",
  "hover:border-accent/50",
  "hover:text-text-primary",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-accent/50",
  "active:scale-[0.98]",
].join(" ");

const providers = [
  {
    key: "google",
    label: "Google",
    ariaLabel: "Sign in with Google",
    Icon: IconGoogle,
  },
  {
    key: "facebook",
    label: "Facebook",
    ariaLabel: "Sign in with Facebook",
    Icon: IconFacebook,
  },
];

export const SocialAuthButtons = ({
  label = "Sign in with",
}: SocialAuthButtonsProps) => {
  return (
    <footer className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <small className="text-xs font-medium uppercase tracking-widest text-text-tertiary">
          {label}
        </small>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {providers.map(({ key, label, ariaLabel, Icon }) => (
          <a
            key={key}
            href="#"
            aria-label={ariaLabel}
            className={providerButtonStyles}
          >
            <Icon />
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
};