import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartLine } from "./ChartLine";
import type { ChartDatum, ChartSeries } from "@/types/Types";

const data: ChartDatum[] = [
  { mes: "Ene", ingresos: 100, egresos: 80 },
  { mes: "Feb", ingresos: 125, egresos: 90 },
  { mes: "Mar", ingresos: 75, egresos: 95 },
];

const series: ChartSeries[] = [
  { dataKey: "ingresos", name: "Ingresos" },
  { dataKey: "egresos", name: "Egresos" },
];

describe("ChartLine", () => {
  it("renders one line per series", () => {
    render(<ChartLine data={data} series={series} xKey="mes" responsive={false} />);
    expect(screen.getByText("Ingresos")).toBeInTheDocument();
    expect(screen.getByText("Egresos")).toBeInTheDocument();
  });

  it("rejects more than three series", () => {
    const tooMany: ChartSeries[] = [
      ...series,
      { dataKey: "a", name: "A" },
      { dataKey: "b", name: "B" },
    ];
    expect(() =>
      render(<ChartLine data={data} series={tooMany} responsive={false} />),
    ).toThrow(/at most 3/);
  });

  it("rejects an empty series list", () => {
    expect(() =>
      render(<ChartLine data={data} series={[]} responsive={false} />),
    ).toThrow(/at least one series/);
  });

  it("shows an empty state instead of an empty chart", () => {
    const { container } = render(
      <ChartLine data={[]} series={series} responsive={false} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("No data available");
    expect(container.querySelector("svg")).toBeNull();
  });

  it("exposes an accessible name", () => {
    render(<ChartLine data={data} series={series} responsive={false} />);
    expect(screen.getByRole("img", { name: "Line chart" })).toBeInTheDocument();
  });

  it("wraps the chart in a responsive container by default", () => {
    const { container } = render(<ChartLine data={data} series={series} />);
    expect(
      container.querySelector(".recharts-responsive-container"),
    ).not.toBeNull();
  });
});
