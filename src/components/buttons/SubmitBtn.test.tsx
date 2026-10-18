import { render, screen } from "@testing-library/react";
import { Send } from "lucide-react";
import { describe, expect, it } from "vitest";
import { SubmitBtn } from "./Buttons";

describe("SubmitBtn", () => {
  it("renders the idle icon and label and is not disabled", () => {
    render(
      <SubmitBtn Icon={Send} aria-label="Send button">
        Send
      </SubmitBtn>,
    );

    const button = screen.getByRole("button", { name: "Send button" });

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).not.toHaveAttribute("aria-busy");
    expect(screen.getByText("Send")).toBeInTheDocument();
    expect(document.querySelector(".animate-spin")).toBeNull();
  });

  it("shows a spinner, swaps the label, and disables the button while pending", () => {
    render(
      <SubmitBtn
        Icon={Send}
        isPending
        pendingLabel="Sending…"
        aria-label="Send button"
      >
        Send
      </SubmitBtn>,
    );

    const button = screen.getByRole("button", { name: "Send button" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Sending…")).toBeInTheDocument();
    expect(screen.queryByText("Send")).not.toBeInTheDocument();
    expect(document.querySelector(".animate-spin")).not.toBeNull();
  });

  it("keeps the children as label when no pendingLabel is provided", () => {
    render(
      <SubmitBtn isPending aria-label="Send button">
        Send
      </SubmitBtn>,
    );

    expect(screen.getByText("Send")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send button" }),
    ).toBeDisabled();
    expect(document.querySelector(".animate-spin")).not.toBeNull();
  });
});
