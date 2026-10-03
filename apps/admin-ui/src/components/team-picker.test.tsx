import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { TeamPicker, type TeamOption } from "./team-picker.js";

const TEAMS: TeamOption[] = [
  { id: "team-eng", name: "Engineering" },
  { id: "team-ops", name: "Operations" },
  { id: "team-sec", name: "Security" },
];

describe("TeamPicker", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders placeholder when no team is selected", () => {
    render(<TeamPicker teams={TEAMS} value="" onChange={vi.fn()} />);
    expect(screen.getByText("Select a team…")).toBeDefined();
  });

  it("renders selected team name when value is provided", () => {
    render(<TeamPicker teams={TEAMS} value="team-eng" onChange={vi.fn()} />);
    expect(screen.getByText("Engineering")).toBeDefined();
  });

  it("opens dropdown and selects an option", () => {
    const handleChange = vi.fn();
    render(<TeamPicker teams={TEAMS} value="" onChange={handleChange} />);

    fireEvent.click(screen.getByText("Select a team…"));
    expect(screen.getByText("Operations")).toBeDefined();

    fireEvent.click(screen.getByText("Operations"));
    expect(handleChange).toHaveBeenCalledWith("team-ops");
  });

  it("shows empty state when no teams are available", () => {
    render(<TeamPicker teams={[]} value="" onChange={vi.fn()} />);
    fireEvent.click(screen.getByText("Select a team…"));
    expect(screen.getByText("No teams configured")).toBeDefined();
  });

  it("closes dropdown on outside click", () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <TeamPicker teams={TEAMS} value="" onChange={vi.fn()} />
      </div>,
    );

    fireEvent.click(screen.getByText("Select a team…"));
    expect(screen.getByText("Engineering")).toBeDefined();

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByText("Engineering")).toBeNull();
  });
});
