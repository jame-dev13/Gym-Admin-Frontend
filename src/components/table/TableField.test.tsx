import { render, screen } from "@testing-library/react";
import { FileText } from "lucide-react";
import { describe, expect, it } from "vitest";
import { TableField, TableFieldGroup } from "./TableField";

describe("TableField", () => {
  it("renders the icon, accessible label and plain value", () => {
    const { container } = render(
      <TableField icon={FileText} label="File name" title="backup.zip">
        backup.zip
      </TableField>,
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByText("File name")).toHaveClass("sr-only");
    expect(screen.getByText("backup.zip")).toHaveAttribute("title", "backup.zip");
  });

  it("wraps the value in a badge when a variant is provided", () => {
    const { container } = render(
      <TableField icon={FileText} label="Status" badge="emerald" leading="none">
        Success
      </TableField>,
    );

    expect(container.querySelector(".border-emerald-600")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("renders a standalone indicator dot", () => {
    const { container } = render(
      <TableField icon={FileText} label="Status" indicator="danger">
        Failure
      </TableField>,
    );

    expect(container.querySelector(".bg-rose-500")).toBeInTheDocument();
  });

  it("groups related fields in the two-row layout", () => {
    const { container } = render(
      <TableFieldGroup>
        <TableField icon={FileText} label="File name">
          backup.zip
        </TableField>
      </TableFieldGroup>,
    );

    expect(container.firstElementChild).toHaveClass("grid-rows-2");
  });
});
