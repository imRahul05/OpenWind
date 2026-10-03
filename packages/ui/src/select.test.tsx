import * as React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Select } from "./select.js";
import { TOKENS } from "./tokens.js";

afterEach(() => {
  cleanup();
});

describe("Select", () => {
  it("renders a select element with children options", () => {
    render(
      <Select data-testid="select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>,
    );
    const select = screen.getByTestId("select");

    expect(select.tagName).toBe("SELECT");
    expect(select.children.length).toBe(2);
    expect(select.style.cursor).toBe("pointer");
    expect(select.style.borderRadius).toBe(TOKENS.radiusSm);
  });

  it("applies focus styling on focus and clears on blur", () => {
    render(
      <Select data-testid="select">
        <option value="1">Option 1</option>
      </Select>,
    );
    const select = screen.getByTestId("select");

    fireEvent.focus(select);
    expect(select.style.borderColor).toBe(TOKENS.accentPrimary);
    expect(select.style.boxShadow).toContain(TOKENS.borderFocus);

    fireEvent.blur(select);
    expect(select.style.borderColor).toBe(TOKENS.borderColor);
    expect(select.style.boxShadow).toBe("");
  });

  it("applies error styling when error is true", () => {
    render(
      <Select data-testid="select" error>
        <option value="1">Option 1</option>
      </Select>,
    );
    const select = screen.getByTestId("select");

    expect(select.getAttribute("aria-invalid")).toBe("true");
    expect(select.style.borderColor).toBe(TOKENS.danger);

    fireEvent.focus(select);
    expect(select.style.borderColor).toBe(TOKENS.danger);
    expect(select.style.boxShadow).toContain("hsla(350, 80%, 60%, 0.25)");
  });

  it("applies error styling when aria-invalid is true", () => {
    render(
      <Select data-testid="select" aria-invalid="true">
        <option value="1">Option 1</option>
      </Select>,
    );
    const select = screen.getByTestId("select");

    expect(select.style.borderColor).toBe(TOKENS.danger);
  });

  it("applies disabled styling when disabled", () => {
    render(
      <Select data-testid="select" disabled>
        <option value="1">Option 1</option>
      </Select>,
    );
    const select = screen.getByTestId("select") as HTMLSelectElement;

    expect(select.disabled).toBe(true);
    expect(select.style.opacity).toBe("0.5");
    expect(select.style.cursor).toBe("not-allowed");
  });

  it("calls custom onFocus and onBlur handlers", () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(
      <Select data-testid="select" onFocus={handleFocus} onBlur={handleBlur}>
        <option value="1">Option 1</option>
      </Select>,
    );
    const select = screen.getByTestId("select");

    fireEvent.focus(select);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(select);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("forwards ref to the HTMLSelectElement", () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(
      <Select ref={ref} data-testid="select">
        <option value="1">Option 1</option>
      </Select>,
    );

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it("merges custom className and style", () => {
    render(
      <Select
        data-testid="select"
        className="custom-select"
        style={{ width: "200px" }}
      >
        <option value="1">Option 1</option>
      </Select>,
    );
    const select = screen.getByTestId("select");

    expect(select.className).toContain("custom-select");
    expect(select.style.width).toBe("200px");
  });
});
