import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { CreateSubtaskDialog } from "./create-subtask-dialog.js";
import type { OrgUser } from "../assign-dropdown.js";

const USERS: OrgUser[] = [
  { userId: "u1", displayName: "Charlie", email: "charlie@example.com" },
];

describe("CreateSubtaskDialog", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders when open", () => {
    render(
      <CreateSubtaskDialog
        open={true}
        users={USERS}
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByText("New sub-task")).toBeDefined();
    expect(screen.getByPlaceholderText("Sub-task title…")).toBeDefined();
    const createBtn = screen.getByRole("button", {
      name: "Create sub-task",
    }) as HTMLButtonElement;
    expect(createBtn.disabled).toBe(true);
  });

  it("submits the form data when valid", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const handleOpenChange = vi.fn();
    render(
      <CreateSubtaskDialog
        open={true}
        users={USERS}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
      />,
    );

    const titleInput = screen.getByPlaceholderText("Sub-task title…");
    fireEvent.change(titleInput, { target: { value: "Investigate crash" } });

    const createBtn = screen.getByRole("button", {
      name: "Create sub-task",
    }) as HTMLButtonElement;
    expect(createBtn.disabled).toBe(false);

    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        title: "Investigate crash",
        assignedTo: "",
        dueDate: "",
        description: "",
      });
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("displays error when submission rejects", async () => {
    const handleSubmit = vi
      .fn()
      .mockRejectedValue(new Error("Entity not found"));
    render(
      <CreateSubtaskDialog
        open={true}
        users={USERS}
        onOpenChange={vi.fn()}
        onSubmit={handleSubmit}
      />,
    );

    const titleInput = screen.getByPlaceholderText("Sub-task title…");
    fireEvent.change(titleInput, { target: { value: "Investigate crash" } });

    fireEvent.click(screen.getByRole("button", { name: "Create sub-task" }));

    await waitFor(() => {
      expect(screen.getByText("Entity not found")).toBeDefined();
    });
  });
});
