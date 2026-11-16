import { Construction } from "lucide-react";
import { Modal } from "@/components/modal/Modal";
import type { WelcomeMembershipDialogProps } from "@/components/welcome/WelcomeTypes";

const CLOSE_STYLES = [
  "inline-flex",
  "w-full",
  "cursor-pointer",
  "items-center",
  "justify-center",
  "rounded-full",
  "bg-accent",
  "px-6",
  "py-2.5",
  "text-sm",
  "font-semibold",
  "text-surface",
  "transition-colors",
  "duration-200",
  "hover:bg-accent-emphasis",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-accent",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-surface-raised",
  "sm:w-auto",
].join(" ");

export const WelcomeMembershipDialog = ({
  open,
  onClose,
}: WelcomeMembershipDialogProps) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Membership registration"
    description="Activate your Gym Admin membership."
    size="md"
  >
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-accent/20 bg-accent/5 p-5">
        <span className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
          <Construction size={24} aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-text-primary">
            Still in development
          </p>
          <p className="text-sm leading-relaxed text-text-secondary">
            Your account is ready, but membership registration is not available
            yet. This flow is still being built and will open right here as soon
            as it is ready.
          </p>
        </div>
      </div>

      <button type="button" onClick={onClose} className={CLOSE_STYLES}>
        Got it
      </button>
    </div>
  </Modal>
);
