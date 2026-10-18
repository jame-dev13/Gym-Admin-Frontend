import { AlertTriangle, RotateCcw, Trash2 } from "lucide-react";
import { CommandBtn, SubmitBtn } from "@/components/buttons/Buttons";
import { AppForm } from "@/components/form/AppForm";
import type React from "react";

export type UserConfirmVariant = "recover" | "delete" | "hard-delete";

export interface UserConfirmDialogProps {
  variant: UserConfirmVariant;
  isPending?: boolean;
  error?: string | null;
  onConfirmSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
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
): VariantCopy => {
  switch (variant) {
    case "recover":
      return {
        title: "Recover user",
        description: `The user will regain access to the application depending on his own role.`,
        confirmLabel: "Recover user",
        pendingLabel: "Recovering…",
        destructive: false,
      };
    case "delete":
      return {
        title: "Delete user",
        description: `The user will lose access immediately. You can recover this user later.`,
        confirmLabel: "Delete user",
        pendingLabel: "Deleting…",
        destructive: true,
      };
    case "hard-delete":
      return {
        title: "Permanently delete user",
        description: `The user will be permanently removed. This action cannot be undone.`,
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
  isPending = false,
  error,
  onConfirmSubmit,
  onCancel,
}: UserConfirmDialogProps) => {
  const copy = buildCopy(variant);

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

      <AppForm noValidate={false} onSubmit={onConfirmSubmit} className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <CommandBtn type="button" onClick={onCancel} disabled={isPending}>
            Cancel
          </CommandBtn>
        )}
        <SubmitBtn
          isPending={isPending}
          pendingLabel={copy.pendingLabel}
          aria-label={`${variant} dialog confirm button.`}
          className={
            copy.destructive
              ? "border-danger font-semibold text-danger hover:border-danger hover:bg-danger/10"
              : "border-transparent bg-accent font-semibold text-surface hover:bg-accent-emphasis"
          }
        >
          {copy.confirmLabel}
        </SubmitBtn>
      </AppForm>
    </div>
  );
};
