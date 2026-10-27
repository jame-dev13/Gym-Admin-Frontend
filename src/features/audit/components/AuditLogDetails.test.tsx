import { render, screen, within } from "@testing-library/react";
import { AuditLogDetails } from "@/features/audit/components/AuditLogDetails";
import type { AuditLogResponse } from "@/features/audit/types";

const buildAuditLog = (
  overrides: Partial<AuditLogResponse> = {},
): AuditLogResponse => ({
  id: 1,
  entity: { type: "customer", entityId: { id: 24 } },
  action: "UPDATE_CUSTOMER",
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

describe("AuditLogDetails", () => {
  it("renders a compact summary and a field-level diff for CRUD payloads", () => {
    render(<AuditLogDetails data={buildAuditLog()} />);

    expect(screen.getByText("UPDATE_CUSTOMER")).toBeInTheDocument();
    expect(screen.getByText("Succeeded")).toBeInTheDocument();
    expect(screen.getByText("customer #24")).toBeInTheDocument();
    expect(screen.getByText("ana (#7)")).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: "Changed fields" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Old")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.queryByText("Changed")).not.toBeInTheDocument();
  });

  it("marks added and removed fields without redundant change labels", () => {
    render(
      <AuditLogDetails
        data={buildAuditLog({
          payload: {
            type: "CRUD",
            before: { legacy: "kept" },
            after: { nickname: "new" },
          },
        })}
      />,
    );

    expect(screen.getByText("Added")).toBeInTheDocument();
    expect(screen.getByText("Removed")).toBeInTheDocument();
  });

  it("keeps unchanged fields available without cluttering the diff", () => {
    render(
      <AuditLogDetails
        data={buildAuditLog({
          payload: {
            type: "CRUD",
            before: { name: "Old", email: "ana@gym.io" },
            after: { name: "New", email: "ana@gym.io" },
          },
        })}
      />,
    );

    const toggle = screen.getByText("Show 1 unchanged field");
    const details = toggle.closest("details");

    expect(details).not.toHaveAttribute("open");
    expect(within(details as HTMLElement).getByText("Email")).toBeInTheDocument();
  });

  it("renders non-CRUD payloads as a simple detail section", () => {
    render(
      <AuditLogDetails
        data={buildAuditLog({
          success: false,
          payload: {
            type: "ERROR",
            error: { message: "Boom", code: "E_500" },
          },
        })}
      />,
    );

    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Error" })).toBeInTheDocument();
    expect(screen.getByText("Message")).toBeInTheDocument();
    expect(screen.getByText("Boom")).toBeInTheDocument();
    expect(screen.getByText("Code")).toBeInTheDocument();
  });
});
