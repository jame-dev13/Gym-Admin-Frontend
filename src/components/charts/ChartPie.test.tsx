import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartPie } from "./ChartPie";
import type { ChartDatum } from "@/types/Types";

const data: ChartDatum[] = [
  { zona: "Norte", miembros: 120 },
  { zona: "Sur", miembros: 80 },
];

describe("ChartPie", () => {
  it("renders every slice with its name", () => {
    render(<ChartPie data={data} dataKey="miembros" nameKey="zona" responsive={false} animate={false} />);
    expect(screen.getByText("Norte")).toBeInTheDocument();
    expect(screen.getByText("Sur")).toBeInTheDocument();
  });

  it("paints slices with distinct palette colors", () => {
    const { container } = render(
      <ChartPie data={data} dataKey="miembros" nameKey="zona" responsive={false} animate={false} />,
    );
    const fills = Array.from(
      container.querySelectorAll(".recharts-pie-sector path"),
    ).map((path) => path.getAttribute("fill"));
    expect(fills).toEqual(["#22d3ee", "#10b981"]);
  });

  it("shows an empty state instead of an empty chart", () => {
    const { container } = render(
      <ChartPie data={[]} dataKey="miembros" nameKey="zona" responsive={false} animate={false} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("No data available");
    expect(container.querySelector("svg")).toBeNull();
  });

  it("supports the money tooltip variant", () => {
    render(
      <ChartPie
        data={data}
        dataKey="miembros"
        nameKey="zona"
        tooltipVariant="money"
        responsive={false}
      />,
    );
    expect(screen.getByText("Norte")).toBeInTheDocument();
  });
});
