import * as React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Textarea } from "./textarea.js";
import { TOKENS } from "./tokens.js";

afterEach(() => {
  cleanup();
});

describe("Textarea", () => {
  it("renders a textarea element with base styles", () => {
    render(<Textarea placeholder="Enter description" />);
    const textarea = screen.getByPlaceholderText("Enter description");

    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea.style.resize).toBe("vertical");
    expect(textarea.style.minHeight).toBe("80px");
    expect(textarea.style.borderRadius).toBe(TOKENS.radiusSm);
  });

  it("applies focus styling on focus and clears on blur", () => {
    render(<Textarea placeholder="Focus test" />);
    const textarea = screen.getByPlaceholderText("Focus test");

    fireEvent.focus(textarea);
    expect(textarea.style.borderColor).toBe(TOKENS.accentPrimary);
    expect(textarea.style.boxShadow).toContain(TOKENS.borderFocus);

    fireEvent.blur(textarea);
    expect(textarea.style.borderColor).toBe(TOKENS.borderColor);
    expect(textarea.style.boxShadow).toBe("");
  });

  it("applies error styling when error is true", () => {
    render(<Textarea placeholder="Error test" error />);
    const textarea = screen.getByPlaceholderText("Error test");

    expect(textarea.getAttribute("aria-invalid")).toBe("true");
    expect(textarea.style.borderColor).toBe(TOKENS.danger);

    fireEvent.focus(textarea);
    expect(textarea.style.borderColor).toBe(TOKENS.danger);
    expect(textarea.style.boxShadow).toContain("hsla(350, 80%, 60%, 0.25)");
  });

  it("applies error styling when aria-invalid is true", () => {
    render(<Textarea placeholder="Aria invalid test" aria-invalid="true" />);
    const textarea = screen.getByPlaceholderText("Aria invalid test");

    expect(textarea.style.borderColor).toBe(TOKENS.danger);
  });

  it("applies disabled styling when disabled", () => {
    render(<Textarea placeholder="Disabled" disabled />);
    const textarea = screen.getByPlaceholderText(
      "Disabled",
    ) as HTMLTextAreaElement;

    expect(textarea.disabled).toBe(true);
    expect(textarea.style.opacity).toBe("0.5");
    expect(textarea.style.cursor).toBe("not-allowed");
  });

  it("calls custom onFocus and onBlur handlers", () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(
      <Textarea
        placeholder="Handlers"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />,
    );
    const textarea = screen.getByPlaceholderText("Handlers");

    fireEvent.focus(textarea);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(textarea);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("forwards ref to the HTMLTextAreaElement", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} placeholder="Ref test" />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("merges custom className and style", () => {
    render(
      <Textarea
        placeholder="Custom"
        className="custom-textarea"
        style={{ minHeight: "150px" }}
      />,
    );
    const textarea = screen.getByPlaceholderText("Custom");

    expect(textarea.className).toContain("custom-textarea");
    expect(textarea.style.minHeight).toBe("150px");
  });
});
