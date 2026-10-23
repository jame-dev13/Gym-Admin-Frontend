import { screen } from "@testing-library/react";
import { ModalProvider } from "@/context/ModalProvider";
import { AuditLogList } from "@/features/audit/components/AuditLogList";
import { useAuditLogList } from "@/features/audit/hooks/useAuditLogList";
import type { AuditLogResponse } from "@/features/audit/types";
import type { UseTableRendererResult } from "@/hooks/useTableRenderer";
import { renderWithProviders } from "@/test/test-utils";

vi.mock("@/features/audit/hooks/useAuditLogList", () => ({
  useAuditLogList: vi.fn(),
}));

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

const buildListState = (
  overrides: Partial<UseTableRendererResult<AuditLogResponse>> = {},
): UseTableRendererResult<AuditLogResponse> => ({
  rows: [buildAuditLog()],
  error: null,
  isPending: false,
  isFetching: false,
  isRefetching: false,
  doRefetch: vi.fn(async () => undefined),
  search: {
    value: "",
    onChange: vi.fn(),
    onSubmit: vi.fn(),
  },
  sort: {
    options: [{ value: "createdAt", label: "Date" }],
    sortBy: "createdAt",
    direction: "desc",
    onSortByChange: vi.fn(),
    onDirectionChange: vi.fn(),
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalElements: 1,
    onPageChange: vi.fn(),
  },
  ...overrides,
});

const renderList = (state: UseTableRendererResult<AuditLogResponse>) => {
  vi.mocked(useAuditLogList).mockReturnValue(state);

  return renderWithProviders(
    <ModalProvider>
      <AuditLogList />
    </ModalProvider>,
  );
};

describe("AuditLogList", () => {
  it("renders the rows and the footer totals", () => {
    renderList(buildListState());

    expect(screen.getByRole("heading", { name: "Audit Logs" })).toBeInTheDocument();
    expect(screen.getByText("UPDATE")).toBeInTheDocument();
    expect(screen.getByText("1 log found")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeInTheDocument();
  });

  it("keeps loaded rows visible when a refetch fails", () => {
    renderList(
      buildListState({
        error: { message: "Audit logs failed", status: 500 },
      }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Audit logs failed");
    expect(screen.getByText("UPDATE")).toBeInTheDocument();
  });

  it("renders the empty state", () => {
    renderList(
      buildListState({
        rows: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalElements: 0,
          onPageChange: vi.fn(),
        },
      }),
    );

    expect(screen.getByText("No audit logs found.")).toBeInTheDocument();
    expect(screen.getByText("0 logs found")).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Pagination" }),
    ).not.toBeInTheDocument();
  });
});
