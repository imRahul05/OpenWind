import * as React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Input } from "./input.js";
import { TOKENS } from "./tokens.js";

afterEach(() => {
  cleanup();
});

describe("Input", () => {
  it("renders an input element with base styles", () => {
    render(<Input placeholder="Enter title" />);
    const input = screen.getByPlaceholderText("Enter title");

    expect(input.tagName).toBe("INPUT");
    expect(input.style.borderRadius).toBe(TOKENS.radiusSm);
    expect(input.style.background).toBe(TOKENS.bgSecondary);
    expect(input.style.color).toBe(TOKENS.textPrimary);
  });

  it("applies focus styling on focus and reverts on blur", () => {
    render(<Input placeholder="Focused input" />);
    const input = screen.getByPlaceholderText("Focused input");

    fireEvent.focus(input);
    expect(input.style.borderColor).toBe(TOKENS.accentPrimary);
    expect(input.style.boxShadow).toContain(TOKENS.borderFocus);

    fireEvent.blur(input);
    expect(input.style.borderColor).toBe(TOKENS.borderColor);
    expect(input.style.boxShadow).toBe("");
  });

  it("applies error styling when error is true", () => {
    render(<Input placeholder="Error input" error />);
    const input = screen.getByPlaceholderText("Error input");

    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.style.borderColor).toBe(TOKENS.danger);

    fireEvent.focus(input);
    expect(input.style.borderColor).toBe(TOKENS.danger);
    expect(input.style.boxShadow).toContain("hsla(350, 80%, 60%, 0.25)");
  });

  it("applies error styling when aria-invalid is true", () => {
    render(<Input placeholder="Aria error" aria-invalid="true" />);
    const input = screen.getByPlaceholderText("Aria error");

    expect(input.style.borderColor).toBe(TOKENS.danger);
  });

  it("applies disabled styling when disabled", () => {
    render(<Input placeholder="Disabled" disabled />);
    const input = screen.getByPlaceholderText("Disabled") as HTMLInputElement;

    expect(input.disabled).toBe(true);
    expect(input.style.opacity).toBe("0.5");
    expect(input.style.cursor).toBe("not-allowed");
  });

  it("calls custom onFocus and onBlur handlers", () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(
      <Input
        placeholder="Handlers"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />,
    );
    const input = screen.getByPlaceholderText("Handlers");

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("forwards ref to the HTMLInputElement", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="With ref" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("merges custom className and style", () => {
    render(
      <Input
        placeholder="Custom"
        className="extra-input"
        style={{ marginTop: "12px" }}
      />,
    );
    const input = screen.getByPlaceholderText("Custom");

    expect(input.className).toContain("extra-input");
    expect(input.style.marginTop).toBe("12px");
  });
});
