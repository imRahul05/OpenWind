import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { RequestAccessDialog } from "./request-access-dialog.js";

describe("RequestAccessDialog", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders when open for comment access", () => {
    render(
      <RequestAccessDialog
        level="read_comment"
        requesting={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText("Request access?")).toBeDefined();
    expect(screen.getByText(/comment access/)).toBeDefined();
    expect(screen.getByRole("button", { name: "Send Request" })).toBeDefined();
  });

  it("renders when open for view access", () => {
    render(
      <RequestAccessDialog
        level="read_only"
        requesting={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText(/view access/)).toBeDefined();
  });

  it("calls onConfirm with the level when clicked", () => {
    const handleConfirm = vi.fn();
    render(
      <RequestAccessDialog
        level="read_comment"
        requesting={false}
        onClose={vi.fn()}
        onConfirm={handleConfirm}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Send Request" }));
    expect(handleConfirm).toHaveBeenCalledWith("read_comment");
  });

  it("disables send button when requesting", () => {
    render(
      <RequestAccessDialog
        level="read_comment"
        requesting={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    const btn = screen.getByRole("button", {
      name: "Sending…",
    }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
