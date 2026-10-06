import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { Pagination } from "./Pagination";

const renderPagination = (props?: {
  totalElements?: number;
  currentPage?: number;
  disabled?: boolean;
  onPageChange?: (page: number) => void;
}) =>
  renderWithProviders(
    <Pagination
      totalElements={props?.totalElements ?? 10}
      currentPage={props?.currentPage ?? 1}
      disabled={props?.disabled}
      onPageChange={props?.onPageChange ?? (() => {})}
    />,
  );

describe("Pagination", () => {
  it("renders the current position as current over total", () => {
    renderPagination({ currentPage: 1 });

    expect(screen.getByText("1 / 10")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 10")).toBeInTheDocument();
  });

  it("moves to the previous page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderPagination({ currentPage: 5, onPageChange });

    await user.click(screen.getByRole("button", { name: "Go to previous page" }));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("moves to the next page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderPagination({ currentPage: 5, onPageChange });

    await user.click(screen.getByRole("button", { name: "Go to next page" }));

    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  it("disables previous on the first page", () => {
    renderPagination({ currentPage: 1 });

    expect(
      screen.getByRole("button", { name: "Go to previous page" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Go to next page" }),
    ).toBeEnabled();
  });

  it("disables next on the last page", () => {
    renderPagination({ currentPage: 10 });

    expect(
      screen.getByRole("button", { name: "Go to next page" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Go to previous page" }),
    ).toBeEnabled();
  });

  it("disables both steps on a single page", () => {
    renderPagination({ totalElements: 1, currentPage: 1 });

    expect(
      screen.getByRole("button", { name: "Go to previous page" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Go to next page" }),
    ).toBeDisabled();
  });

  it("disables both steps when disabled", () => {
    renderPagination({ currentPage: 5, disabled: true });

    expect(
      screen.getByRole("button", { name: "Go to previous page" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Go to next page" }),
    ).toBeDisabled();
  });

  it("throws on invalid pagination state", () => {
    expect(() => renderPagination({ totalElements: 0 })).toThrow(
      "Pagination requires totalElements of at least 1",
    );
    expect(() => renderPagination({ currentPage: 0 })).toThrow(
      "Pagination requires currentPage to be within 1 and totalElements",
    );
    expect(() => renderPagination({ currentPage: 11 })).toThrow(
      "Pagination requires currentPage to be within 1 and totalElements",
    );
  });
});
