import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Table } from "./Table";
import type { Column } from "@/types/Types";

type Member = {
  id: number;
  name: string;
  plan: string | null;
  sessions: number;
};

const columns: Column<Member>[] = [
  { key: "name", header: "Name" },
  { key: "plan", header: "Plan" },
  { key: "sessions", header: "Sessions", align: "right" },
];

const data: Member[] = [
  { id: 1, name: "Ada Lovelace", plan: "Pro", sessions: 12 },
  { id: 2, name: "Grace Hopper", plan: null, sessions: 8 },
];

describe("Table", () => {
  it("renders headers with column scope and row data", () => {
    render(
      <Table data={data} columns={columns} caption="Members" />,
    );

    const table = screen.getByRole("table", { name: "Members" });
    expect(table).toBeInTheDocument();

    const headerRow = within(table).getAllByRole("row")[0];
    const headers = within(headerRow).getAllByRole("columnheader");
    expect(headers.map((h) => h.textContent)).toEqual([
      "Name",
      "Plan",
      "Sessions",
    ]);
    headers.forEach((h) => expect(h).toHaveAttribute("scope", "col"));

    expect(
      screen.getByRole("cell", { name: "Ada Lovelace" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Pro" })).toBeInTheDocument();
  });

  it("shows the empty message with status role when data is empty", () => {
    render(<Table data={[]} columns={columns} caption="Members" />);

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("No data available");
  });

  it("uses a custom empty message when provided", () => {
    render(
      <Table
        data={[]}
        columns={columns}
        caption="Members"
        emptyMessage="No members found"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("No members found");
  });

  it("renders null cells with the default placeholder", () => {
    render(<Table data={data} columns={columns} caption="Members" />);

    const row = screen.getByRole("row", { name: /Grace Hopper/ });
    expect(within(row).getByRole("cell", { name: "—" })).toBeInTheDocument();
  });

  it("supports custom render", () => {
    render(
      <Table<Member>
        data={data}
        caption="Members"
        columns={[
          { key: "name", header: "Name" },
          {
            key: "plan",
            header: "Plan",
            render: (value) => (
              <span data-testid="plan-badge">{String(value ?? "none")}</span>
            ),
          },
          {
            key: "sessions",
            header: "Sessions",
            render: (value) => `${Number(value)} sessions`,
          },
        ]}
      />,
    );

    const badges = screen.getAllByTestId("plan-badge");
    expect(badges.map((b) => b.textContent)).toEqual(["Pro", "none"]);
    expect(screen.getByRole("cell", { name: "12 sessions" })).toBeInTheDocument();
  });

  it("falls back to emptyValue when render returns null", () => {
    render(
      <Table<Member>
        data={data}
        caption="Members"
        columns={[
          { key: "name", header: "Name" },
          { key: "plan", header: "Plan", emptyValue: "No plan", render: () => null },
        ]}
      />,
    );

    const graceRow = screen.getByRole("row", { name: /Grace Hopper/ });
    expect(
      within(graceRow).getByRole("cell", { name: "No plan" }),
    ).toBeInTheDocument();
  });

  it("supports aria-label without a visible caption", () => {
    render(
      <Table data={data} columns={columns} aria-label="Members table" />,
    );

    expect(
      screen.getByRole("table", { name: "Members table" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Members table")).not.toBeInTheDocument();
  });

  it("uses getRowKey when row id is null", () => {
    type Loose = { id: number | null; name: string };

    render(
      <Table<Loose>
        data={[{ id: null, name: "Unassigned" }]}
        columns={[{ key: "name", header: "Name" }]}
        caption="Members"
        getRowKey={(row) => `row-${row.name}`}
      />,
    );

    expect(
      screen.getByRole("cell", { name: "Unassigned" }),
    ).toBeInTheDocument();
  });

  it("fails fast when columns are missing", () => {
    expect(() =>
      render(<Table data={data} columns={[]} caption="Members" />),
    ).toThrow("Table requires at least one column");
  });

  it("fails fast when a row has no usable key", () => {
    type Loose = { id: number | null; name: string };

    expect(() =>
      render(
        <Table<Loose>
          data={[{ id: null, name: "Unassigned" }]}
          columns={[{ key: "name", header: "Name" }]}
          caption="Members"
        />,
      ),
    ).toThrow();
  });
});

describe("Table card layout", () => {
  it("tags every cell with its column header label by default", () => {
    render(<Table data={data} columns={columns} caption="Members" />);

    const adaRow = screen.getByRole("row", { name: /Ada Lovelace/ });
    const cells = within(adaRow).getAllByRole("cell");
    expect(cells.map((c) => c.getAttribute("data-label"))).toEqual([
      "Name",
      "Plan",
      "Sessions",
    ]);
  });

  it("marks the title cell and hides opted-out columns on cards", () => {
    const cardColumns: Column<Member>[] = [
      { key: "name", header: "Name" },
      { key: "plan", header: "Plan", hideOnCards: true },
      { key: "sessions", header: "Sessions" },
    ];

    render(
      <Table
        data={data}
        columns={cardColumns}
        caption="Members"
        cardTitleKey="name"
      />,
    );

    const adaRow = screen.getByRole("row", { name: /Ada Lovelace/ });
    const cells = within(adaRow).getAllByRole("cell");
    expect(cells[0]).toHaveAttribute("data-card-title", "true");
    expect(cells[1]).toHaveAttribute("data-hide-on-cards", "true");
    expect(cells[2]).not.toHaveAttribute("data-card-title");
  });

  it("renders uniform rows when no cardTitleKey is given", () => {
    render(<Table data={data} columns={columns} caption="Members" />);

    const adaRow = screen.getByRole("row", { name: /Ada Lovelace/ });
    within(adaRow)
      .getAllByRole("cell")
      .forEach((cell) =>
        expect(cell).not.toHaveAttribute("data-card-title"),
      );
  });

  it("omits card markers when responsive is scroll", () => {
    render(
      <Table
        data={data}
        columns={columns}
        caption="Members"
        responsive="scroll"
        cardTitleKey="name"
      />,
    );

    const adaRow = screen.getByRole("row", { name: /Ada Lovelace/ });
    const cells = within(adaRow).getAllByRole("cell");
    expect(cells[0]).not.toHaveAttribute("data-label");
    expect(cells[0]).not.toHaveAttribute("data-card-title");
  });
});
