import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeBtn } from "./Buttons";
import { THEME_STORAGE_KEY } from "@/context/ThemeContext";
import { ThemeProvider } from "@/context/ThemeProvider";

const renderThemeBtn = () =>
  render(
    <ThemeProvider>
      <ThemeBtn />
    </ThemeProvider>,
  );

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("light");
});

describe("ThemeBtn", () => {
  it("offers switching to light mode when the theme is dark", () => {
    renderThemeBtn();

    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
  });

  it("toggles the theme and updates its accessible name on click", async () => {
    const user = userEvent.setup();
    renderThemeBtn();

    await user.click(
      screen.getByRole("button", { name: "Switch to light mode" }),
    );

    expect(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeInTheDocument();
  });

  it("reflects a stored light mode on first render", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    renderThemeBtn();

    expect(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeInTheDocument();
  });
});
