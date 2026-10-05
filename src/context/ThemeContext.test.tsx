import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { THEME_STORAGE_KEY } from "./ThemeContext";
import { ThemeProvider } from "./ThemeProvider";
import { useThemeContext } from "./useThemeContext";

const ModeProbe = () => {
  const { mode, setMode, toggle } = useThemeContext();

  return (
    <div>
      <p data-testid="theme-mode">{mode}</p>
      <button type="button" onClick={() => setMode("light")}>
        set light
      </button>
      <button type="button" onClick={toggle}>
        toggle theme
      </button>
    </div>
  );
};

const stubMatchMedia = (prefersDark: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: prefersDark && query === "(prefers-color-scheme: dark)",
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
};

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove("light");
  stubMatchMedia(false);
});

describe("ThemeProvider", () => {
  it("defaults to dark mode when nothing is stored and the OS prefers light", () => {
    render(
      <ThemeProvider>
        <ModeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("respects the OS dark preference on first visit", () => {
    stubMatchMedia(true);

    render(
      <ThemeProvider>
        <ModeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");
  });

  it("restores the stored light mode and applies the light class", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");

    render(
      <ThemeProvider>
        <ModeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("falls back to dark when the stored value is invalid", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "midnight");

    render(
      <ThemeProvider>
        <ModeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("toggles the mode, the root class, and the stored value", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ModeProbe />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "toggle theme" }));

    expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");

    await user.click(screen.getByRole("button", { name: "toggle theme" }));

    expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("sets the mode explicitly", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ModeProbe />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "set light" }));

    expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });
});

describe("useThemeContext", () => {
  it("throws when used outside of a ThemeProvider", () => {
    const Outside = () => {
      useThemeContext();
      return null;
    };

    expect(() => render(<Outside />)).toThrow(
      "useThemeContext must be used within a ThemeProvider",
    );
  });
});
