import { render, screen } from "@testing-library/react";
import { UserPlus } from "lucide-react";
import { describe, expect, it } from "vitest";
import { CommandBtn } from "./Buttons";

describe("CommandBtn", () => {
  it("renders only the icon and exposes the label through title and aria-label", () => {
    render(
      <CommandBtn
        Icon={UserPlus}
        aria-label="Add user"
        title="Add user"
        iconOnly
      >
        Add user
      </CommandBtn>,
    );

    const button = screen.getByRole("button", { name: "Add user" });

    expect(button).toHaveAttribute("title", "Add user");
    expect(button).not.toHaveTextContent("Add user");
    expect(button.querySelector("svg")).not.toBeNull();
  });
});
