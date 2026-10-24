import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ModalProvider } from "@/context/ModalProvider";
import { RestoreBackupDialog } from "@/features/backup/components/RestoreBackupDialog";
import { useRestoreBackupHandler } from "@/features/backup/hooks/handlers/useRestoreBackupHandler";

vi.mock("@/features/backup/hooks/handlers/useRestoreBackupHandler", () => ({
  useRestoreBackupHandler: vi.fn(),
}));

const submit = vi.fn((e: React.SubmitEvent<HTMLFormElement>) =>
  e.preventDefault(),
);

describe("RestoreBackupDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRestoreBackupHandler).mockReturnValue({
      submit,
      isPending: false,
      error: null,
    });
  });

  it("renders the target backup and submits the restore", async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <RestoreBackupDialog
          backupId="backup-id"
          fileName="backup-2026-10-23.zip"
        />
      </ModalProvider>,
    );

    expect(useRestoreBackupHandler).toHaveBeenCalledWith("backup-id");
    expect(
      screen.getByRole("heading", { level: 3, name: "Restore backup" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/backup-2026-10-23\.zip/),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Restore backup confirm button." }),
    );

    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("falls back to generic copy when the file name is missing", () => {
    render(
      <ModalProvider>
        <RestoreBackupDialog backupId="backup-id" />
      </ModalProvider>,
    );

    expect(
      screen.getByText(/Restore the application data from this backup\?/),
    ).toBeInTheDocument();
  });
});
