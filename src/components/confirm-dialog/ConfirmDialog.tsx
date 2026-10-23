import { CommandBtn, SubmitBtn } from "@/components/buttons/Buttons";
import { AppForm } from "@/components/form/AppForm";
import type { ConfirmDialogProps, ConfirmDialogTone } from "./ConfirmDialogTypes";

const TONE_STYLES: Record<
  ConfirmDialogTone,
  { badge: string; confirm: string }
> = {
  default: {
    badge: "bg-accent/10 text-accent",
    confirm:
      "border-transparent bg-accent font-semibold text-surface hover:bg-accent-emphasis",
  },
  destructive: {
    badge: "bg-danger/10 text-danger",
    confirm:
      "border-danger font-semibold text-danger hover:border-danger hover:bg-danger/10",
  },
};

export const ConfirmDialog = ({
  title,
  description,
  confirmLabel,
  pendingLabel,
  tone = "default",
  Icon,
  isPending = false,
  confirmDisabled = false,
  error,
  onConfirmSubmit,
  onCancel,
  confirmAriaLabel,
  cancelLabel = "Cancel",
  children,
}: ConfirmDialogProps) => {
  const styles = TONE_STYLES[tone];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <span
            aria-hidden="true"
            className={`mt-0.5 inline-flex rounded-full p-2 ${styles.badge}`}
          >
            <Icon size={20} aria-hidden="true" />
          </span>
        )}
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <AppForm noValidate={false} onSubmit={onConfirmSubmit}>
        {children}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {onCancel && (
            <CommandBtn type="button" onClick={onCancel} disabled={isPending}>
              {cancelLabel}
            </CommandBtn>
          )}
          <SubmitBtn
            isPending={isPending}
            disabled={confirmDisabled}
            pendingLabel={pendingLabel}
            aria-label={confirmAriaLabel}
            className={styles.confirm}
          >
            {confirmLabel}
          </SubmitBtn>
        </div>
      </AppForm>
    </div>
  );
};
