import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ArchiveConfirmDialog } from "./archive-confirm-dialog.js";

describe("ArchiveConfirmDialog", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders when open with child count", () => {
    render(
      <ArchiveConfirmDialog
        open={true}
        childCount={3}
        loading={false}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText("Archive this record?")).toBeDefined();
    expect(screen.getByText(/3 sub-tasks/)).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Archive record" }),
    ).toBeDefined();
  });

  it("handles singular child count correctly", () => {
    render(
      <ArchiveConfirmDialog
        open={true}
        childCount={1}
        loading={false}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText(/1 sub-task\b/)).toBeDefined();
  });

  it("calls onConfirm when clicking Archive record", () => {
    const handleConfirm = vi.fn();
    render(
      <ArchiveConfirmDialog
        open={true}
        childCount={0}
        loading={false}
        onOpenChange={vi.fn()}
        onConfirm={handleConfirm}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Archive record" }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("disables buttons when loading", () => {
    render(
      <ArchiveConfirmDialog
        open={true}
        childCount={0}
        loading={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    const archiveBtn = screen.getByRole("button", {
      name: "Archiving…",
    }) as HTMLButtonElement;
    const cancelBtn = screen.getByRole("button", {
      name: "Cancel",
    }) as HTMLButtonElement;
    expect(archiveBtn.disabled).toBe(true);
    expect(cancelBtn.disabled).toBe(true);
  });
});
