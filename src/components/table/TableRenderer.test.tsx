import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import { TableRenderer } from "./TableRenderer";
import type {
  PageQueryHook,
  TableRendererConfig,
} from "./tableRendererConfig";
import type { Column, Page } from "@/types/Types";

type Member = {
  id: number;
  name: string;
  plan: string;
};

const columns: Column<Member>[] = [
  { key: "name", header: "Name" },
  { key: "plan", header: "Plan" },
];

function pageOf(content: Member[], totalPages = 1): Page<Member> {
  return {
    content,
    page: {
      size: 10,
      number: 0,
      totalElements: content.length,
      totalPages,
    },
  };
}

const firstPage = pageOf([
  { id: 1, name: "Ada Lovelace", plan: "Pro" },
  { id: 2, name: "Grace Hopper", plan: "Basic" },
]);

const secondPage = pageOf([{ id: 3, name: "Alan Turing", plan: "Elite" }], 2);

function createStub(pages: Record<number, Page<Member>>) {
  const seen: Array<Record<string, unknown>> = [];
  const hook = ((params?: Record<string, unknown>) => {
    seen.push({ ...(params ?? {}) });
    return {
      data: pages[Number(params?.page ?? 0)] ?? pageOf([]),
      isPending: false,
      isFetching: false,
      isError: false,
      error: null,
    };
  }) as unknown as PageQueryHook<Member>;
  return { hook, seen };
}

function baseConfig(
  hook: PageQueryHook<Member>,
  overrides?: Partial<TableRendererConfig<Member>>,
): TableRendererConfig<Member> {
  return {
    usePage: hook,
    columns,
    title: "Members",
    tableOptions: { caption: "Gym members" },
    search: { enabled: true, placeholder: "Search members…" },
    sort: { properties: ["name", "plan"] },
    ...overrides,
  };
}

describe("TableRenderer", () => {
  it("requests the first 0-based page with Spring-style sort", () => {
    const { hook, seen } = createStub({ 0: firstPage });
    renderWithProviders(<TableRenderer config={baseConfig(hook)} />);

    expect(
      screen.getByRole("cell", { name: "Ada Lovelace" }),
    ).toBeInTheDocument();
    expect(seen).toHaveLength(1);
    expect(seen[0]).toMatchObject({
      page: 0,
      size: 10,
      sort: "name,asc",
    });
    expect(seen[0]).not.toHaveProperty("search");
  });

  it("hides the search input when filtering is disabled", () => {
    const { hook } = createStub({ 0: firstPage });
    renderWithProviders(
      <TableRenderer
        config={baseConfig(hook, { search: { enabled: false } })}
      />,
    );

    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("submits search on enter and resets to the first page", async () => {
    const user = userEvent.setup();
    const { hook, seen } = createStub({ 0: firstPage });
    renderWithProviders(<TableRenderer config={baseConfig(hook)} />);

    await user.type(
      screen.getByPlaceholderText("Search members…"),
      "ada{enter}",
    );

    expect(seen.at(-1)).toMatchObject({ page: 0, search: "ada" });
  });

  it("sends Spring-style sort params when field and direction change", async () => {
    const user = userEvent.setup();
    const { hook, seen } = createStub({ 0: firstPage });
    renderWithProviders(<TableRenderer config={baseConfig(hook)} />);

    await user.click(screen.getByRole("button", { name: "Name" }));
    await user.click(screen.getByRole("menuitemradio", { name: "Plan" }));
    expect(seen.at(-1)).toMatchObject({ page: 0, sort: "plan,asc" });

    await user.click(
      screen.getByRole("button", {
        name: "Sort direction: ascending, activate to sort descending",
      }),
    );
    expect(seen.at(-1)).toMatchObject({ page: 0, sort: "plan,desc" });
  });

  it("maps UI pagination to 0-based backend pages", async () => {
    const user = userEvent.setup();
    const pagedFirst = pageOf(firstPage.content, 2);
    const { hook, seen } = createStub({ 0: pagedFirst, 1: secondPage });
    renderWithProviders(<TableRenderer config={baseConfig(hook)} />);

    await user.click(screen.getByRole("button", { name: "Go to next page" }));

    expect(seen.at(-1)).toMatchObject({ page: 1 });
    expect(
      screen.getByRole("cell", { name: "Alan Turing" }),
    ).toBeInTheDocument();
  });

  it("shows an alert when the page query fails", () => {
    const hook = (() => ({
      data: undefined,
      isPending: false,
      isFetching: false,
      isError: true,
      error: { message: "Members could not be loaded" },
    })) as unknown as PageQueryHook<Member>;
    renderWithProviders(<TableRenderer config={baseConfig(hook)} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Members could not be loaded",
    );
  });

  it("shows a loading status while the first page resolves", () => {
    const hook = (() => ({
      data: undefined,
      isPending: true,
      isFetching: true,
      isError: false,
      error: null,
    })) as unknown as PageQueryHook<Member>;
    renderWithProviders(
      <TableRenderer
        config={baseConfig(hook, { loadingMessage: "Loading members…" })}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Loading members…");
  });
});
