import { AlertTriangle, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { CommandBtn } from "@/components/buttons/Buttons";

export type UserConfirmVariant = "recover" | "delete" | "hard-delete";

export interface UserConfirmDialogProps {
  variant: UserConfirmVariant;
  userName: string;
  isPending?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel?: () => void;
}

type VariantCopy = {
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel: string;
  destructive: boolean;
};

const buildCopy = (
  variant: UserConfirmVariant,
  userName: string,
): VariantCopy => {
  switch (variant) {
    case "recover":
      return {
        title: "Recover user",
        description: `"${userName}" will regain access to the administration panel.`,
        confirmLabel: "Recover user",
        pendingLabel: "Recovering…",
        destructive: false,
      };
    case "delete":
      return {
        title: "Delete user",
        description: `"${userName}" will lose access immediately. You can recover this user later.`,
        confirmLabel: "Delete user",
        pendingLabel: "Deleting…",
        destructive: true,
      };
    case "hard-delete":
      return {
        title: "Permanently delete user",
        description: `"${userName}" will be permanently removed. This action cannot be undone.`,
        confirmLabel: "Delete permanently",
        pendingLabel: "Deleting…",
        destructive: true,
      };
  }
};

const VariantIcon = ({ variant }: { variant: UserConfirmVariant }) => {
  const props = { size: 20, "aria-hidden": true } as const;
  if (variant === "recover") return <RotateCcw {...props} />;
  if (variant === "delete") return <Trash2 {...props} />;
  return <AlertTriangle {...props} />;
};

export const UserConfirmDialog = ({
  variant,
  userName,
  isPending = false,
  error,
  onConfirm,
  onCancel,
}: UserConfirmDialogProps) => {
  const copy = buildCopy(variant, userName);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`mt-0.5 inline-flex rounded-full p-2 ${
            copy.destructive
              ? "bg-danger/10 text-danger"
              : "bg-accent/10 text-accent"
          }`}
        >
          <VariantIcon variant={variant} />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-text-primary">
            {copy.title}
          </h3>
          <p className="text-sm text-text-secondary">{copy.description}</p>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <CommandBtn type="button" onClick={onCancel} disabled={isPending}>
            Cancel
          </CommandBtn>
        )}
        <CommandBtn
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          aria-busy={isPending || undefined}
          className={
            copy.destructive
              ? "border-danger font-semibold text-danger hover:border-danger hover:bg-danger/10"
              : "border-transparent bg-accent font-semibold text-surface hover:bg-accent-emphasis"
          }
        >
          {isPending && (
            <Loader2 size={18} aria-hidden="true" className="animate-spin" />
          )}
          {isPending ? copy.pendingLabel : copy.confirmLabel}
        </CommandBtn>
      </div>
    </div>
  );
};
