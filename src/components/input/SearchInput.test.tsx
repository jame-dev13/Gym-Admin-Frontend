import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  it("renders an accessible searchbox with a search button", () => {
    render(<SearchInput name="q" />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("types without triggering search until commanded", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    const onChange = vi.fn();
    render(<SearchInput name="q" onSearch={onSearch} onChange={onChange} />);

    await user.type(screen.getByRole("searchbox"), "protein");

    expect(screen.getByRole("searchbox")).toHaveValue("protein");
    expect(onChange).toHaveBeenCalled();
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("triggers search on button click with the current value", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchInput name="q" defaultValue="creatine" onSearch={onSearch} />);

    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("creatine");
  });

  it("triggers search on Enter", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchInput name="q" onSearch={onSearch} />);

    await user.type(screen.getByRole("searchbox"), "plan{enter}");

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("plan");
  });

  it("supports controlled value from the parent", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(
      <SearchInput name="q" value="fixed" onChange={() => {}} onSearch={onSearch} />,
    );

    expect(screen.getByRole("searchbox")).toHaveValue("fixed");
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(onSearch).toHaveBeenCalledWith("fixed");
  });

  it("does not search when disabled", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchInput name="q" disabled onSearch={onSearch} />);

    expect(screen.getByRole("searchbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(onSearch).not.toHaveBeenCalled();
  });
});
