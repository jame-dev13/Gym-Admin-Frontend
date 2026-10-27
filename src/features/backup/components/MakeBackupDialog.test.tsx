import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ModalProvider } from "@/context/ModalProvider";
import { MakeBackupDialog } from "@/features/backup/components/MakeBackupDialog";
import { useMakeBackupHandler } from "@/features/backup/hooks/handlers/useMakeBackupHandler";

vi.mock("@/features/backup/hooks/handlers/useMakeBackupHandler", () => ({
  useMakeBackupHandler: vi.fn(),
}));

const submit = vi.fn((e: React.SubmitEvent<HTMLFormElement>) =>
  e.preventDefault(),
);

describe("MakeBackupDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMakeBackupHandler).mockReturnValue({
      submit,
      isPending: false,
      error: null,
    });
  });

  it("renders the confirmation copy and submits a new backup", async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <MakeBackupDialog />
      </ModalProvider>,
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Create backup" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Create a new backup snapshot of the current application data?",
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Create backup confirm button." }),
    );

    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("exposes the pending state and errors accessibly", () => {
    vi.mocked(useMakeBackupHandler).mockReturnValue({
      submit: vi.fn(),
      isPending: true,
      error: { message: "Cannot create backup" },
    });

    render(
      <ModalProvider>
        <MakeBackupDialog />
      </ModalProvider>,
    );

    expect(
      screen.getByRole("button", { name: "Create backup confirm button." }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("Cannot create backup");
    expect(screen.getByText("Creating…")).toBeInTheDocument();
  });
});
