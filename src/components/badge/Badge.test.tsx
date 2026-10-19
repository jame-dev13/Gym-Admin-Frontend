import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge>FACEBOOK</Badge>);

    expect(screen.getByText("FACEBOOK")).toBeInTheDocument();
  });

  it("renders a decorative dot by default", () => {
    const { container } = render(<Badge>ADMIN</Badge>);

    const marker = container.querySelector("span[aria-hidden='true']");
    expect(marker).toBeInTheDocument();
  });

  it("derives the initial from string children when leading is 'initial'", () => {
    const { container } = render(
      <Badge leading="initial">alex@gymadmin.io</Badge>,
    );

    expect(container.querySelector("span[aria-hidden='true']")).toHaveTextContent("a");
    expect(screen.getByText("alex@gymadmin.io")).toBeInTheDocument();
  });

  it("renders no marker when leading is 'none'", () => {
    const { container } = render(<Badge leading="none">None</Badge>);

    expect(container.querySelector("span[aria-hidden='true']")).not.toBeInTheDocument();
  });

  it("fails fast when leading is 'initial' without a text label", () => {
    expect(() =>
      render(
        <Badge leading="initial">
          <span>element child</span>
        </Badge>,
      ),
    ).toThrow('Badge with leading="initial" requires string or number children');
  });

  it("applies the mono and variant classes", () => {
    const { container } = render(
      <Badge variant="rose" mono>
        ADMIN
      </Badge>,
    );

    const root = container.firstElementChild;
    expect(root).toHaveClass("font-mono");
    expect(root).toHaveClass("border-rose-600");
  });

  it("stays shrinkable and left-aligned for the Table card layout", () => {
    const { container } = render(<Badge>a very long value</Badge>);

    const root = container.firstElementChild;
    expect(root).toHaveClass("min-w-0");
    expect(root).toHaveClass("max-w-full");
    expect(root).toHaveClass("text-left");
    expect(screen.getByText("a very long value")).toHaveClass("truncate");
  });
});
