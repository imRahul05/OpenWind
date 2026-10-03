import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SectionHeader } from "./section-header.js";

describe("SectionHeader", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders title and optional action", () => {
    render(
      <SectionHeader
        title="Overview"
        action={<button type="button">Refresh</button>}
      />,
    );
    expect(screen.getByText("Overview")).toBeDefined();
    expect(screen.getByText("Refresh")).toBeDefined();
  });

  it("renders with icon and custom color", () => {
    render(<SectionHeader title="Alerts" icon="⚠️" color="hsl(340,80%,58%)" />);
    expect(screen.getByText("Alerts")).toBeDefined();
    expect(screen.getByText("⚠️")).toBeDefined();
  });

  it("renders muted-uppercase variant", () => {
    render(<SectionHeader title="System Summary" variant="muted-uppercase" />);
    expect(screen.getByText("System Summary")).toBeDefined();
  });
});
