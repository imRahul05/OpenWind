import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { TransitionDialog, type Transition } from "./transition-dialog.js";

const TRANSITION: Transition = {
  id: "t1",
  fromState: "open",
  toState: "in_progress",
  label: "Start Progress",
  requiresComment: false,
};

describe("TransitionDialog", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders state transition details when open", () => {
    render(
      <TransitionDialog
        transition={TRANSITION}
        currentState="open"
        isTransitioning={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText('Move to "Start Progress"')).toBeDefined();
    expect(screen.getByText("in_progress")).toBeDefined();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeDefined();
  });

  it("calls onConfirm with transition and comment when clicked", () => {
    const handleConfirm = vi.fn();
    render(
      <TransitionDialog
        transition={TRANSITION}
        currentState="open"
        isTransitioning={false}
        onClose={vi.fn()}
        onConfirm={handleConfirm}
      />,
    );

    const textarea = screen.getByPlaceholderText(
      "Add a note about this transition…",
    );
    fireEvent.change(textarea, { target: { value: "Starting work now" } });

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(handleConfirm).toHaveBeenCalledWith(TRANSITION, "Starting work now");
  });

  it("disables confirm button when requiresComment is true and comment is empty", () => {
    const reqCommentTransition: Transition = {
      ...TRANSITION,
      requiresComment: true,
    };
    render(
      <TransitionDialog
        transition={reqCommentTransition}
        currentState="open"
        isTransitioning={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    const confirmBtn = screen.getByRole("button", {
      name: "Confirm",
    }) as HTMLButtonElement;
    expect(confirmBtn.disabled).toBe(true);
  });
});
