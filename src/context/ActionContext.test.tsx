import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ACTIONS, type Action } from "./ActionContext";
import { ActionProvider } from "./ActionProvider";
import { useActionContext } from "./useActionContext";

const ActionProbe = () => {
  const { action, setAction } = useActionContext();

  return (
    <div>
      <p data-testid="action-value">{action ?? "null"}</p>
      <button type="button" onClick={() => setAction("add")}>
        set add
      </button>
      <button type="button" onClick={() => setAction("edit")}>
        set edit
      </button>
      <button type="button" onClick={() => setAction("delete")}>
        set delete
      </button>
      <button type="button" onClick={() => setAction("recover")}>
        set recover
      </button>
      <button type="button" onClick={() => setAction("hard-delete")}>
        set hard-delete
      </button>
      <button type="button" onClick={() => setAction(null)}>
        clear action
      </button>
    </div>
  );
};

const renderHarness = () =>
  render(
    <ActionProvider>
      <ActionProbe />
    </ActionProvider>,
  );

describe("ACTIONS constant", () => {
  it("contains the expected action types", () => {
    expect(ACTIONS).toEqual([
      "add",
      "edit",
      "delete",
      "recover",
      "hard-delete",
    ]);
  });

  it("defines Action type correctly", () => {
    const validAction: Action = "add";
    expect(ACTIONS.includes(validAction)).toBe(true);
  });
});

describe("ActionProvider", () => {
  it("initializes with null action by default", () => {
    renderHarness();

    expect(screen.getByTestId("action-value")).toHaveTextContent("null");
  });

  it("sets and updates action through setAction", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "set add" }));
    expect(screen.getByTestId("action-value")).toHaveTextContent("add");

    await user.click(screen.getByRole("button", { name: "set edit" }));
    expect(screen.getByTestId("action-value")).toHaveTextContent("edit");

    await user.click(screen.getByRole("button", { name: "set delete" }));
    expect(screen.getByTestId("action-value")).toHaveTextContent("delete");

    await user.click(screen.getByRole("button", { name: "set recover" }));
    expect(screen.getByTestId("action-value")).toHaveTextContent("recover");

    await user.click(screen.getByRole("button", { name: "set hard-delete" }));
    expect(screen.getByTestId("action-value")).toHaveTextContent("hard-delete");
  });

  it("clears action back to null", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "set add" }));
    expect(screen.getByTestId("action-value")).toHaveTextContent("add");

    await user.click(screen.getByRole("button", { name: "clear action" }));
    expect(screen.getByTestId("action-value")).toHaveTextContent("null");
  });
});

describe("useActionContext", () => {
  it("throws when used outside of an ActionProvider", () => {
    const Outside = () => {
      useActionContext();
      return null;
    };

    expect(() => render(<Outside />)).toThrow("ActionContext is required.");
  });

  it("returns action and setAction when used inside ActionProvider", () => {
    renderHarness();

    expect(screen.getByTestId("action-value")).toHaveTextContent("null");
  });
});