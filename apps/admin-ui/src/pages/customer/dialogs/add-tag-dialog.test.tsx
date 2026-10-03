import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { AddTagDialog } from "./add-tag-dialog.js";

describe("AddTagDialog", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders when open", () => {
    render(
      <AddTagDialog open={true} onOpenChange={vi.fn()} onAddTag={vi.fn()} />,
    );

    expect(screen.getByText("Add tag")).toBeDefined();
    expect(screen.getByPlaceholderText("e.g. railways")).toBeDefined();
    const addBtn = screen.getByRole("button", {
      name: "Add",
    }) as HTMLButtonElement;
    expect(addBtn.disabled).toBe(true);
  });

  it("submits the entered tag and clears state", async () => {
    const handleAddTag = vi.fn().mockResolvedValue(undefined);
    const handleOpenChange = vi.fn();
    render(
      <AddTagDialog
        open={true}
        onOpenChange={handleOpenChange}
        onAddTag={handleAddTag}
      />,
    );

    const input = screen.getByPlaceholderText("e.g. railways");
    fireEvent.change(input, { target: { value: "urgent" } });

    const addButton = screen.getByRole("button", {
      name: "Add",
    }) as HTMLButtonElement;
    expect(addButton.disabled).toBe(false);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(handleAddTag).toHaveBeenCalledWith("urgent");
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("displays error when submission rejects", async () => {
    const handleAddTag = vi
      .fn()
      .mockRejectedValue(new Error("Tag already exists"));
    render(
      <AddTagDialog
        open={true}
        onOpenChange={vi.fn()}
        onAddTag={handleAddTag}
      />,
    );

    const input = screen.getByPlaceholderText("e.g. railways");
    fireEvent.change(input, { target: { value: "duplicate" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(screen.getByText("Tag already exists")).toBeDefined();
    });
  });
});
