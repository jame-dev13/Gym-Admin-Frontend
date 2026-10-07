import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { TableRowActions } from "./TableRowActions";
import type { RowAction } from "@/types/Types";

type Member = {
  id: number;
  name: string;
  customerId: string;
};

const row: Member = { id: 1, name: "Ada Lovelace", customerId: "c-1" };

function actions(
  overrides?: Partial<RowAction<Member>>,
): RowAction<Member>[] {
  return [
    {
      id: "view",
      label: "View details",
      Icon: Eye,
      onSelect: vi.fn(),
      ...overrides,
    },
  ];
}

describe("TableRowActions", () => {
  it("renders one button per visible action", () => {
    render(
      <TableRowActions
        row={row}
        actions={[
          { id: "view", label: "View details", Icon: Eye, onSelect: vi.fn() },
          { id: "edit", label: "Edit member", Icon: Pencil, onSelect: vi.fn() },
        ]}
      />,
    );

    expect(
      screen.getByRole("button", { name: "View details" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Edit member" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Row actions" }),
    ).toBeInTheDocument();
  });

  it("calls onSelect with the row when clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <TableRowActions
        row={row}
        actions={[{ id: "view", label: "View details", onSelect }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "View details" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(row);
  });

  it("hides actions opted out by the hidden predicate", () => {
    render(
      <TableRowActions
        row={row}
        actions={[
          {
            id: "delete",
            label: "Delete member",
            Icon: Trash2,
            hidden: (r) => r.customerId === "c-1",
            onSelect: vi.fn(),
          },
        ]}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Delete member" }),
    ).not.toBeInTheDocument();
  });

  it("renders the placeholder when every action is hidden", () => {
    render(
      <TableRowActions
        row={row}
        actions={[
          {
            id: "delete",
            label: "Delete member",
            hidden: () => true,
            onSelect: vi.fn(),
          },
        ]}
      />,
    );

    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("supports boolean and row-based disabled states", () => {
    render(
      <TableRowActions
        row={row}
        actions={[
          {
            id: "view",
            label: "View details",
            disabled: true,
            onSelect: vi.fn(),
          },
          {
            id: "edit",
            label: "Edit member",
            disabled: (r) => r.id === 1,
            onSelect: vi.fn(),
          },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "View details" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Edit member" })).toBeDisabled();
  });

  it("does not call onSelect when the action is disabled", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <TableRowActions
        row={row}
        actions={actions({ onSelect, disabled: true })}
      />,
    );

    const button = screen.getByRole("button", { name: "View details" });
    expect(button).toBeDisabled();
    await user.click(button);

    expect(onSelect).not.toHaveBeenCalled();
  });
});
