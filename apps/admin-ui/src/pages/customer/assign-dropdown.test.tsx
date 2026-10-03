import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { AssignDropdown, type OrgUser } from "./assign-dropdown.js";

const USERS: OrgUser[] = [
  { userId: "u1", displayName: "Alice Smith", email: "alice@example.com" },
  { userId: "u2", displayName: "Bob Jones", email: "bob@example.com" },
];

describe("AssignDropdown", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders unassigned state by default", () => {
    render(<AssignDropdown value="" users={USERS} onChange={vi.fn()} />);

    expect(screen.getByText("Unassigned")).toBeDefined();
  });

  it("renders selected user name when value matches", () => {
    render(<AssignDropdown value="u1" users={USERS} onChange={vi.fn()} />);

    expect(screen.getByText("Alice Smith")).toBeDefined();
  });

  it("opens menu and calls onChange when selecting an option", () => {
    const handleChange = vi.fn();
    render(<AssignDropdown value="" users={USERS} onChange={handleChange} />);

    fireEvent.click(screen.getByRole("button", { name: /Unassigned/ }));
    expect(screen.getByPlaceholderText("Search people…")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: /Alice Smith/ }));
    expect(handleChange).toHaveBeenCalledWith("u1");
  });

  it("filters users when typing in search input", () => {
    render(<AssignDropdown value="" users={USERS} onChange={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /Unassigned/ }));
    const searchInput = screen.getByPlaceholderText("Search people…");
    fireEvent.change(searchInput, { target: { value: "Bob" } });

    expect(screen.queryByText("Alice Smith")).toBeNull();
    expect(screen.getByText("Bob Jones")).toBeDefined();
  });
});
