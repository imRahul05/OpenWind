import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { DonutChart, type DonutSegment } from "./donut-chart.js";

const SEGMENTS: DonutSegment[] = [
  { label: "Open", value: 10, color: "#f00" },
  { label: "In Progress", value: 5, color: "#0f0" },
  { label: "Closed", value: 15, color: "#00f" },
];

describe("DonutChart", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders total count and center label", () => {
    render(<DonutChart segments={SEGMENTS} centerLabel="ITEMS" />);
    expect(screen.getByText("30")).toBeDefined();
    expect(screen.getByText("ITEMS")).toBeDefined();
  });

  it("renders empty state when total is 0", () => {
    render(<DonutChart segments={[]} />);
    expect(screen.getByText("0")).toBeDefined();
    expect(screen.getByText("TICKETS")).toBeDefined();
  });

  it("renders legend when showLegend is true", () => {
    render(<DonutChart segments={SEGMENTS} showLegend />);
    expect(screen.getByText("Open")).toBeDefined();
    expect(screen.getByText("In Progress")).toBeDefined();
    expect(screen.getByText("Closed")).toBeDefined();
  });
});
