import { act, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChartBar } from "@/components/charts/ChartBar";
import { renderWithProviders } from "@/test/test-utils";
import { Carousell } from "./Carousell";
import type { CarousellItem } from "./CarousellTypes";

const items: CarousellItem[] = [
  { id: "revenue", label: "Revenue", content: <p>Revenue panel</p> },
  { id: "members", label: "Members", content: <p>Members panel</p> },
  { id: "occupancy", label: "Occupancy", content: <p>Occupancy panel</p> },
];

class TestPointerEvent extends MouseEvent {
  pointerId: number;
  pointerType: string;

  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 0;
    this.pointerType = init.pointerType ?? "";
  }
}

beforeAll(() => {
  if (typeof window.PointerEvent !== "function") {
    Object.defineProperty(window, "PointerEvent", {
      configurable: true,
      writable: true,
      value: TestPointerEvent,
    });
  }
});

const renderCarousell = (props: Partial<Parameters<typeof Carousell>[0]> = {}) =>
  renderWithProviders(<Carousell items={items} {...props} />);

const activeSlide = (name: string) => screen.getByRole("group", { name });

describe("Carousell", () => {
  it("renders the first slide and hides the rest from assistive technology", () => {
    renderCarousell();

    expect(activeSlide("1 of 3: Revenue")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    expect(activeSlide("1 of 3: Revenue")).toHaveAttribute("data-active", "true");
    expect(
      screen.getByText("Members panel").closest('[role="group"]'),
    ).toHaveAttribute("aria-hidden", "true");
    expect(
      screen.queryByRole("group", { name: "2 of 3: Members" }),
    ).not.toBeInTheDocument();
  });

  it("moves to the next and previous slide with the controls", async () => {
    const user = userEvent.setup();
    renderCarousell();

    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(activeSlide("2 of 3: Members")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    expect(screen.getByText("Slide 2 of 3: Members")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(activeSlide("1 of 3: Revenue")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
  });

  it("wraps around when loop is enabled", async () => {
    const user = userEvent.setup();
    renderCarousell({ initialIndex: 2 });

    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(activeSlide("1 of 3: Revenue")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(activeSlide("3 of 3: Occupancy")).toBeInTheDocument();
  });

  it("clamps the initial index and disables edge controls without loop", () => {
    renderCarousell({ initialIndex: 99, loop: false });

    expect(activeSlide("3 of 3: Occupancy")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next slide" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Previous slide" }),
    ).toBeEnabled();
  });

  it("jumps to a slide through the dot indicators", async () => {
    const user = userEvent.setup();
    renderCarousell();

    const thirdDot = screen.getByRole("button", {
      name: "Go to slide 3: Occupancy",
    });

    await user.click(thirdDot);

    expect(activeSlide("3 of 3: Occupancy")).toBeInTheDocument();
    expect(thirdDot).toHaveAttribute("aria-current", "true");
    expect(
      screen.getByRole("button", { name: "Go to slide 1: Revenue" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("supports arrow, home, and end keys", async () => {
    const user = userEvent.setup();
    renderCarousell();

    const region = screen.getByRole("region", { name: "Carousel" });
    region.focus();

    await user.keyboard("{ArrowRight}");
    expect(activeSlide("2 of 3: Members")).toBeInTheDocument();

    await user.keyboard("{End}");
    expect(activeSlide("3 of 3: Occupancy")).toBeInTheDocument();

    await user.keyboard("{Home}");
    expect(activeSlide("1 of 3: Revenue")).toBeInTheDocument();
  });

  it("navigates with a horizontal swipe", () => {
    renderCarousell();
    const viewport = screen.getByTestId("carousell-viewport");

    fireEvent.pointerDown(viewport, {
      pointerId: 1,
      pointerType: "touch",
      clientX: 220,
      clientY: 120,
    });
    fireEvent.pointerUp(viewport, {
      pointerId: 1,
      pointerType: "touch",
      clientX: 120,
      clientY: 124,
    });

    expect(activeSlide("2 of 3: Members")).toBeInTheDocument();

    fireEvent.pointerDown(viewport, {
      pointerId: 2,
      pointerType: "touch",
      clientX: 120,
      clientY: 120,
    });
    fireEvent.pointerUp(viewport, {
      pointerId: 2,
      pointerType: "touch",
      clientX: 220,
      clientY: 116,
    });

    expect(activeSlide("1 of 3: Revenue")).toBeInTheDocument();
  });

  it("ignores vertical gestures", () => {
    renderCarousell();
    const viewport = screen.getByTestId("carousell-viewport");

    fireEvent.pointerDown(viewport, {
      pointerId: 1,
      pointerType: "touch",
      clientX: 200,
      clientY: 100,
    });
    fireEvent.pointerUp(viewport, {
      pointerId: 1,
      pointerType: "touch",
      clientX: 110,
      clientY: 260,
    });

    expect(activeSlide("1 of 3: Revenue")).toBeInTheDocument();
  });

  it("follows the pointer while dragging and snaps back below the threshold", () => {
    renderCarousell();
    const viewport = screen.getByTestId("carousell-viewport");
    const track = screen.getByTestId("carousell-track");

    fireEvent.pointerDown(viewport, {
      pointerId: 1,
      pointerType: "touch",
      clientX: 200,
      clientY: 100,
    });
    fireEvent.pointerMove(viewport, {
      pointerId: 1,
      pointerType: "touch",
      clientX: 160,
      clientY: 102,
    });

    expect(track.style.transform).toBe(
      "translate3d(calc(-0% + -40px), 0, 0)",
    );

    fireEvent.pointerUp(viewport, {
      pointerId: 1,
      pointerType: "touch",
      clientX: 160,
      clientY: 102,
    });

    expect(track.style.transform).toBe("translate3d(-0%, 0, 0)");
    expect(activeSlide("1 of 3: Revenue")).toBeInTheDocument();
  });

  it("does not follow the pointer once the gesture is vertical", () => {
    renderCarousell();
    const viewport = screen.getByTestId("carousell-viewport");
    const track = screen.getByTestId("carousell-track");

    fireEvent.pointerDown(viewport, {
      pointerId: 1,
      pointerType: "touch",
      clientX: 200,
      clientY: 100,
    });
    fireEvent.pointerMove(viewport, {
      pointerId: 1,
      pointerType: "touch",
      clientX: 190,
      clientY: 220,
    });

    expect(track.style.transform).toBe("translate3d(-0%, 0, 0)");
  });

  it("marks inactive slides as inert", () => {
    renderCarousell();

    expect(activeSlide("1 of 3: Revenue")).not.toHaveAttribute("inert");
    expect(
      screen.getByText("Members panel").closest('[role="group"]'),
    ).toHaveAttribute("inert");
  });

  it("accepts per-slide classes for media sizing", () => {
    renderWithProviders(
      <Carousell
        items={[
          {
            id: "photo",
            label: "Photo",
            content: <img alt="Gym" src="/gym.png" />,
            className: "aspect-video",
            padded: false,
          },
        ]}
      />,
    );

    expect(screen.getByRole("group", { name: "1 of 1: Photo" })).toHaveClass(
      "aspect-video",
    );
  });

  it("notifies index changes", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    renderCarousell({ onIndexChange });

    await user.click(screen.getByRole("button", { name: "Next slide" }));

    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("renders chart content as any other slide", () => {
    renderWithProviders(
      <Carousell
        items={[
          {
            id: "revenue-chart",
            label: "Revenue chart",
            content: (
              <ChartBar
                data={[{ mes: "Ene", ingresos: 100 }]}
                series={[{ dataKey: "ingresos", name: "Ingresos" }]}
                xKey="mes"
                responsive={false}
              />
            ),
          },
        ]}
      />,
    );

    expect(screen.getByText("Ingresos")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "1 of 1: Revenue chart" })).toBeInTheDocument();
  });

  it("renders an empty state without items", () => {
    renderWithProviders(<Carousell items={[]} />);

    expect(screen.getByRole("status")).toHaveTextContent("No content available");
  });

  it("hides the controls for a single slide or when disabled", () => {
    const { unmount } = renderWithProviders(
      <Carousell items={[items[0]]} />,
    );

    expect(
      screen.queryByRole("button", { name: "Next slide" }),
    ).not.toBeInTheDocument();

    unmount();
    renderCarousell({ showControls: false });

    expect(
      screen.queryByRole("button", { name: "Next slide" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Go to slide 1: Revenue" }),
    ).not.toBeInTheDocument();
  });

  it("advances automatically and pauses on demand", () => {
    vi.useFakeTimers();

    try {
      renderCarousell({ autoPlay: true, autoPlayInterval: 1000 });

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(activeSlide("2 of 3: Members")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Pause autoplay" }));

      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(activeSlide("2 of 3: Members")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("stops at the last slide when loop is disabled", () => {
    vi.useFakeTimers();

    try {
      renderCarousell({
        autoPlay: true,
        autoPlayInterval: 1000,
        loop: false,
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(activeSlide("3 of 3: Occupancy")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(activeSlide("3 of 3: Occupancy")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("resumes autoplay after the pause control is toggled", () => {
    vi.useFakeTimers();

    try {
      renderCarousell({ autoPlay: true, autoPlayInterval: 1000 });

      fireEvent.click(screen.getByRole("button", { name: "Pause autoplay" }));
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(activeSlide("1 of 3: Revenue")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Resume autoplay" }));
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(activeSlide("2 of 3: Members")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
