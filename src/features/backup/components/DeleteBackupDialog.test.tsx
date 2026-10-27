import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ModalProvider } from "@/context/ModalProvider";
import { DeleteBackupDialog } from "@/features/backup/components/DeleteBackupDialog";
import { useDeleteBackupHandler } from "@/features/backup/hooks/handlers/useDeleteBackupHandler";

vi.mock("@/features/backup/hooks/handlers/useDeleteBackupHandler", () => ({
  useDeleteBackupHandler: vi.fn(),
}));

const submit = vi.fn((e: React.SubmitEvent<HTMLFormElement>) =>
  e.preventDefault(),
);

describe("DeleteBackupDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDeleteBackupHandler).mockReturnValue({
      submit,
      isPending: false,
      error: null,
    });
  });

  it("renders the target backup and submits the deletion", async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <DeleteBackupDialog
          backupId="backup-id"
          fileName="backup-2026-10-23.zip"
        />
      </ModalProvider>,
    );

    expect(useDeleteBackupHandler).toHaveBeenCalledWith("backup-id");
    expect(
      screen.getByRole("heading", { level: 3, name: "Delete backup" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/backup-2026-10-23\.zip/),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Delete backup confirm button." }),
    );

    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("surfaces the mutation error", () => {
    vi.mocked(useDeleteBackupHandler).mockReturnValue({
      submit: vi.fn(),
      isPending: false,
      error: { message: "Cannot delete backup" },
    });

    render(
      <ModalProvider>
        <DeleteBackupDialog backupId="backup-id" />
      </ModalProvider>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Cannot delete backup");
  });
});
