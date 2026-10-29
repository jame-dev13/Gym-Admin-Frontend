import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Rating } from "./Rating";

const rect = {
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  right: 100,
  bottom: 20,
  width: 100,
  height: 20,
  toJSON: () => ({}),
} as DOMRect;

describe("Rating", () => {
  it("renders five stars and exposes the normalized value", () => {
    const { container } = render(<Rating value={0.4} label="Quality" />);

    const slider = screen.getByRole("slider", { name: "Quality" });

    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "1");
    expect(slider).toHaveAttribute("aria-valuenow", "0.4");
    expect(slider).toHaveAttribute("aria-valuetext", "2 out of 5 stars");
    expect(container.querySelectorAll("[data-rating-star]")).toHaveLength(5);
  });

  it("fills each star according to the decimal value", () => {
    const { container } = render(<Rating value={0.3} readOnly />);

    const fills = container.querySelectorAll("[data-rating-star] > span");

    expect(fills[0]).toHaveStyle({ width: "100%" });
    expect(fills[1]).toHaveStyle({ width: "50%" });
    expect(fills[2]).toHaveStyle({ width: "0%" });
    expect(fills[4]).toHaveStyle({ width: "0%" });
  });

  it("picks a value from the pointer position", () => {
    const onChange = vi.fn();
    render(<Rating value={0.2} onChange={onChange} />);

    const slider = screen.getByRole("slider");
    vi.spyOn(slider, "getBoundingClientRect").mockReturnValue(rect);

    fireEvent.pointerDown(slider, { clientX: 63, button: 0, pointerId: 1 });

    expect(onChange).toHaveBeenCalledWith(0.63);
  });

  it("previews the hovered value and restores it on leave", () => {
    const { container } = render(<Rating value={0.2} onChange={vi.fn()} />);

    const slider = screen.getByRole("slider");
    vi.spyOn(slider, "getBoundingClientRect").mockReturnValue(rect);

    fireEvent.pointerMove(slider, { clientX: 80, pointerId: 1 });

    const fills = container.querySelectorAll("[data-rating-star] > span");
    expect(fills[3]).toHaveStyle({ width: "100%" });
    expect(fills[4]).toHaveStyle({ width: "0%" });

    fireEvent.pointerLeave(slider);

    expect(fills[1]).toHaveStyle({ width: "0%" });
    expect(fills[4]).toHaveStyle({ width: "0%" });
  });

  it("supports keyboard interaction with the configured step", () => {
    const onChange = vi.fn();
    render(<Rating value={0.5} step={0.05} onChange={onChange} />);

    const slider = screen.getByRole("slider");

    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith(0.55);

    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith(0.45);

    fireEvent.keyDown(slider, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith(1);

    fireEvent.keyDown(slider, { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it("exposes read-only ratings as images and disables interaction", () => {
    const onChange = vi.fn();
    render(
      <Rating value={0.75} readOnly label="Average score" onChange={onChange} />,
    );

    const image = screen.getByRole("img", { name: "Average score: 3.75 out of 5 stars" });

    expect(image).not.toHaveAttribute("tabindex");

    fireEvent.pointerDown(image, { clientX: 10, button: 0, pointerId: 1 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("marks disabled ratings as disabled", () => {
    render(<Rating value={0.5} disabled />);

    expect(screen.getByRole("slider")).toHaveAttribute("aria-disabled", "true");
  });

  it("clamps values outside the 0 to 1 range", () => {
    const { container } = render(<Rating value={1.6} readOnly />);

    const fills = container.querySelectorAll("[data-rating-star] > span");

    expect(fills).toHaveLength(5);
    fills.forEach((fill) => expect(fill).toHaveStyle({ width: "100%" }));
  });

  it("supports uncontrolled usage through defaultValue", () => {
    const onChange = vi.fn();
    render(<Rating defaultValue={0.2} onChange={onChange} />);

    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "0.2");

    vi.spyOn(slider, "getBoundingClientRect").mockReturnValue(rect);
    fireEvent.pointerDown(slider, { clientX: 76, button: 0, pointerId: 1 });

    expect(onChange).toHaveBeenCalledWith(0.76);
    expect(slider).toHaveAttribute("aria-valuenow", "0.76");
  });

  it("submits the rating through a hidden named input", () => {
    const { container } = render(
      <form>
        <Rating name="score" defaultValue={0.4} />
      </form>,
    );

    const form = container.querySelector("form");
    const hiddenInput = container.querySelector('input[name="score"]');

    expect(form).not.toBeNull();
    expect(hiddenInput).toHaveValue("0.4");
    expect(new FormData(form as HTMLFormElement).get("score")).toBe("0.4");
  });

  it("keeps the hidden input in sync with a controlled value", () => {
    const { container, rerender } = render(<Rating name="score" value={0.2} />);

    const hiddenInput = container.querySelector('input[name="score"]');
    expect(hiddenInput).toHaveValue("0.2");

    rerender(<Rating name="score" value={0.9} />);
    expect(hiddenInput).toHaveValue("0.9");
  });

  it("omits the hidden input from form data when disabled", () => {
    const { container } = render(
      <form>
        <Rating name="score" defaultValue={0.4} disabled />
      </form>,
    );

    const form = container.querySelector("form") as HTMLFormElement;

    expect(new FormData(form).has("score")).toBe(false);
  });

  it("restores defaultValue when the surrounding form is reset", () => {
    const { container } = render(
      <form>
        <Rating name="score" defaultValue={0.4} />
      </form>,
    );

    const form = container.querySelector("form") as HTMLFormElement;
    const slider = screen.getByRole("slider");

    vi.spyOn(slider, "getBoundingClientRect").mockReturnValue(rect);
    fireEvent.pointerDown(slider, { clientX: 80, button: 0, pointerId: 1 });
    expect(slider).toHaveAttribute("aria-valuenow", "0.8");

    fireEvent.reset(form);

    expect(slider).toHaveAttribute("aria-valuenow", "0.4");
    expect(new FormData(form).get("score")).toBe("0.4");
  });
});
