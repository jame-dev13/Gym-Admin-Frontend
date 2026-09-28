import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartBar } from "./ChartBar";
import type { ChartDatum, ChartSeries } from "@/types/Types";

const data: ChartDatum[] = [
  { mes: "Ene", ingresos: 100, egresos: 80 },
  { mes: "Feb", ingresos: 125, egresos: 90 },
];

const series: ChartSeries[] = [
  { dataKey: "ingresos", name: "Ingresos" },
  { dataKey: "egresos", name: "Egresos" },
];

describe("ChartBar", () => {
  it("renders one bar set per series", () => {
    render(<ChartBar data={data} series={series} xKey="mes" responsive={false} />);
    expect(screen.getByText("Ingresos")).toBeInTheDocument();
    expect(screen.getByText("Egresos")).toBeInTheDocument();
  });

  it("rejects an empty series list", () => {
    expect(() =>
      render(<ChartBar data={data} series={[]} responsive={false} />),
    ).toThrow(/at least one series/);
  });

  it("shows an empty state instead of an empty chart", () => {
    const { container } = render(
      <ChartBar data={[]} series={series} responsive={false} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("No data available");
    expect(container.querySelector("svg")).toBeNull();
  });

  it("applies the requested height", () => {
    const { container } = render(
      <ChartBar data={data} series={series} responsive={false} height={400} />,
    );
    expect(
      container
        .querySelector(".recharts-wrapper > svg.recharts-surface")
        ?.getAttribute("height"),
    ).toBe("400");
  });
});
