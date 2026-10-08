import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartTooltip } from "./ChartTooltip";
import type { ChartTooltipEntry } from "./ChartTypes";
import type { ChartDatum } from "@/types/Types";

const payload: ChartTooltipEntry[] = [
  { name: "Ingresos", value: 1500, color: "#22d3ee", dataKey: "ingresos" },
];

const rateData: ChartDatum[] = [
  { mes: "Ene", ingresos: 100 },
  { mes: "Feb", ingresos: 125 },
  { mes: "Mar", ingresos: 75 },
];

describe("ChartTooltip", () => {
  it("renders nothing when not active", () => {
    const { container } = render(
      <ChartTooltip active={false} payload={payload} label="Ene" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when the payload is empty", () => {
    const { container } = render(
      <ChartTooltip active payload={[]} label="Ene" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("default variant shows the label and raw hovered values", () => {
    const { container } = render(
      <ChartTooltip active payload={payload} label="Ene" />,
    );
    expect(screen.getByText("Ene")).toBeInTheDocument();
    expect(screen.getByText("Ingresos")).toBeInTheDocument();
    expect(screen.getByText("1500")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeNull();
  });

  it("money variant formats values as MXN by default", () => {
    render(<ChartTooltip variant="money" active payload={payload} label="Ene" />);
    expect(screen.getByText("$1,500.00")).toBeInTheDocument();
  });

  it("money variant honors locale and currency overrides", () => {
    render(
      <ChartTooltip
        variant="money"
        active
        payload={payload}
        label="Ene"
        locale="en-US"
        currency="USD"
      />,
    );
    expect(screen.getByText("$1,500.00")).toBeInTheDocument();
  });

  it("rate variant shows the increase in green with an up icon", () => {
    const { container } = render(
      <ChartTooltip
        variant="rate"
        active
        payload={[{ name: "Ingresos", value: 125, color: "#22d3ee", dataKey: "ingresos" }]}
        label="Feb"
        data={rateData}
        xKey="mes"
      />,
    );
    expect(screen.getByText("+25.0%")).toHaveClass("text-success");
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("rate variant shows the decrease in rose with a down icon", () => {
    render(
      <ChartTooltip
        variant="rate"
        active
        payload={[{ name: "Ingresos", value: 75, color: "#22d3ee", dataKey: "ingresos" }]}
        label="Mar"
        data={rateData}
        xKey="mes"
      />,
    );
    expect(screen.getByText("-40.0%")).toHaveClass("text-danger");
  });

  it("rate variant stays neutral on the first point", () => {
    render(
      <ChartTooltip
        variant="rate"
        active
        payload={[{ name: "Ingresos", value: 100, color: "#22d3ee", dataKey: "ingresos" }]}
        label="Ene"
        data={rateData}
        xKey="mes"
      />,
    );
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("rate variant stays neutral when the previous value is zero", () => {
    render(
      <ChartTooltip
        variant="rate"
        active
        payload={[{ name: "Ingresos", value: 50, color: "#22d3ee", dataKey: "ingresos" }]}
        label="Feb"
        data={[{ mes: "Ene", ingresos: 0 }, { mes: "Feb", ingresos: 50 }]}
        xKey="mes"
      />,
    );
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.queryByText(/Infinity/)).toBeNull();
  });
});
