import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { TableLayout } from "./TableLayout";
import type { Column } from "@/types/Types";

type Member = {
  id: number;
  name: string;
  plan: string;
};

const columns: Column<Member>[] = [
  { key: "name", header: "Name" },
  { key: "plan", header: "Plan" },
];

const data: Member[] = [
  { id: 1, name: "Ada Lovelace", plan: "Pro" },
  { id: 2, name: "Grace Hopper", plan: "Basic" },
];

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "plan", label: "Plan" },
];

const baseProps = {
  title: "Members",
  description: "Everyone with an active membership",
  data,
  columns,
  searchPlaceholder: "Search members...",
  currentPage: 1,
  totalPages: 5,
  onPageChange: vi.fn(),
  table: {
    caption: "Gym members",
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("TableLayout", () => {
  it("renders the visible title, description, table, and pagination", () => {
    renderWithProviders(<TableLayout {...baseProps} />);

    expect(
      screen.getByRole("heading", { name: "Members" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Everyone with an active membership"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: "Gym members" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Ada Lovelace" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("keeps the toolbar sticky at the top of the scroll container", () => {
    renderWithProviders(<TableLayout {...baseProps} />);

    const toolbar = screen.getByTestId("table-layout-toolbar");
    expect(toolbar).toHaveClass("sticky", "top-0", "z-10");
  });

  it("caps the scroll region with a fixed max height", () => {
    renderWithProviders(<TableLayout {...baseProps} />);

    expect(screen.getByTestId("table-layout-body")).toHaveClass("max-h-160");
  });

  it("reports search typing and submit to the consumer", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onSearchSubmit = vi.fn();
    renderWithProviders(
      <TableLayout
        {...baseProps}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
      />,
    );

    const search = screen.getByPlaceholderText("Search members...");
    await user.type(search, "ada");
    expect(onSearchChange).toHaveBeenLastCalledWith("ada");

    await user.type(search, "{enter}");
    expect(onSearchSubmit).toHaveBeenCalledWith("ada");
  });

  it("hides pagination when there are no pages to show", () => {
    renderWithProviders(
      <TableLayout {...baseProps} data={[]} currentPage={1} totalPages={0} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Pagination" }),
    ).not.toBeInTheDocument();
  });

  it("reports page changes to the consumer", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderWithProviders(
      <TableLayout {...baseProps} currentPage={2} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Go to next page" }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});

describe("TableLayout toolbar slots", () => {
  it("reports sort field and direction changes", async () => {
    const user = userEvent.setup();
    const onSortByChange = vi.fn();
    const onSortDirectionChange = vi.fn();
    renderWithProviders(
      <TableLayout
        {...baseProps}
        sortOptions={sortOptions}
        onSortByChange={onSortByChange}
        onSortDirectionChange={onSortDirectionChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Sort by" }));
    await user.click(screen.getByRole("menuitemradio", { name: "Plan" }));
    expect(onSortByChange).toHaveBeenCalledWith("plan");

    await user.click(
      screen.getByRole("button", {
        name: "Sort direction: ascending, activate to sort descending",
      }),
    );
    expect(onSortDirectionChange).toHaveBeenCalledWith("desc");
  });

  it("renders the domain controls slot", () => {
    renderWithProviders(
      <TableLayout {...baseProps} controls={<button>Export users</button>} />,
    );

    expect(
      screen.getByRole("button", { name: "Export users" }),
    ).toBeInTheDocument();
  });

  it("hides the search input when it is not searchable", () => {
    renderWithProviders(
      <TableLayout {...baseProps} isSearchable={false} />,
    );

    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("shows an alert instead of the table on error", () => {
    renderWithProviders(
      <TableLayout {...baseProps} errorMessage="Members could not be loaded" />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Members could not be loaded",
    );
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("shows a loading status when the first page is pending", () => {
    renderWithProviders(
      <TableLayout {...baseProps} data={[]} isLoading loadingMessage="Loading members…" />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Loading members…");
  });
});
