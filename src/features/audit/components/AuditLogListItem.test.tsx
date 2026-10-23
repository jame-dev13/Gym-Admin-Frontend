import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalHost } from "@/components/modal/ModalHost";
import { ModalProvider } from "@/context/ModalProvider";
import { AuditLogListItem } from "@/features/audit/components/AuditLogListItem";
import type { AuditLogResponse } from "@/features/audit/types";
import { renderWithProviders } from "@/test/test-utils";

const buildAuditLog = (
  overrides: Partial<AuditLogResponse> = {},
): AuditLogResponse => ({
  entity: { type: "customer", entityId: { id: 24 } },
  action: "UPDATE",
  actor: { userId: { id: 7 }, username: "ana" },
  payload: {
    type: "CRUD",
    before: { name: "Old" },
    after: { name: "New" },
  },
  metadata: { ip: "192.168.1.10", userAgent: "Vitest" },
  success: true,
  createdAt: "2026-10-23T12:00:00.000Z",
  ...overrides,
});

const renderItem = (data: AuditLogResponse = buildAuditLog()) =>
  renderWithProviders(
    <ModalProvider>
      <AuditLogListItem data={data} />
      <ModalHost />
    </ModalProvider>,
  );

describe("AuditLogListItem", () => {
  it("renders the grouped minimal information", () => {
    renderItem();

    expect(screen.getByText("UPDATE")).toBeInTheDocument();
    expect(screen.getByText("Succeeded")).toBeInTheDocument();
    expect(screen.getByText("Changes")).toBeInTheDocument();
    expect(screen.getByText("customer #24")).toBeInTheDocument();
    expect(screen.getByText("ana")).toBeInTheDocument();
    expect(
      screen.getByText("2026-10-23T12:00:00.000Z"),
    ).toBeInTheDocument();
  });

  it("opens the details modal for the selected log", async () => {
    const user = userEvent.setup();
    renderItem();

    await user.click(
      screen.getByRole("button", { name: "Show details for UPDATE" }),
    );

    const dialog = await screen.findByRole("dialog");

    expect(within(dialog).getByText("Audit log details")).toBeInTheDocument();
    expect(within(dialog).getByText("Before")).toBeInTheDocument();
    expect(within(dialog).getByText("After")).toBeInTheDocument();
    expect(within(dialog).getByText("Old")).toBeInTheDocument();
    expect(within(dialog).getByText("New")).toBeInTheDocument();
    expect(within(dialog).getByText("IP address")).toBeInTheDocument();
    expect(within(dialog).getByText("192.168.1.10")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show details for UPDATE" }),
    ).toBeDisabled();
  });
});
