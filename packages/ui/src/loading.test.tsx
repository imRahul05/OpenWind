import * as React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LoadingSpinner, LoadingScreen } from "./loading.js";
import { TOKENS } from "./tokens.js";

afterEach(() => {
  cleanup();
});

describe("LoadingSpinner", () => {
  it("renders with default size, role='status', and aria-label='Loading'", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole("status", { name: "Loading" });

    expect(spinner.style.width).toBe("32px");
    expect(spinner.style.height).toBe("32px");
    expect(spinner.style.borderWidth).toBe("3px");
    expect(spinner.style.borderRadius).toBe("50%");
    expect(spinner.style.animation).toBe("spin 1s linear infinite");
  });

  it("renders with sm size", () => {
    render(<LoadingSpinner size="sm" data-testid="spinner-sm" />);
    const spinner = screen.getByTestId("spinner-sm");

    expect(spinner.style.width).toBe("16px");
    expect(spinner.style.height).toBe("16px");
    expect(spinner.style.borderWidth).toBe("2px");
  });

  it("renders with lg size", () => {
    render(<LoadingSpinner size="lg" data-testid="spinner-lg" />);
    const spinner = screen.getByTestId("spinner-lg");

    expect(spinner.style.width).toBe("48px");
    expect(spinner.style.height).toBe("48px");
    expect(spinner.style.borderWidth).toBe("4px");
  });

  it("supports custom aria-label", () => {
    render(<LoadingSpinner aria-label="Syncing data..." />);
    expect(
      screen.getByRole("status", { name: "Syncing data..." }),
    ).toBeDefined();
  });

  it("handles aria-hidden='true' by removing role='status' and aria-label", () => {
    render(<LoadingSpinner aria-hidden="true" data-testid="hidden-spinner" />);
    const spinner = screen.getByTestId("hidden-spinner");

    expect(spinner.getAttribute("aria-hidden")).toBe("true");
    expect(spinner.getAttribute("role")).toBeNull();
    expect(spinner.getAttribute("aria-label")).toBeNull();
  });

  it("merges custom className and style", () => {
    render(
      <LoadingSpinner
        className="my-spinner"
        style={{ margin: 10 }}
        data-testid="styled-spinner"
      />,
    );
    const spinner = screen.getByTestId("styled-spinner");

    expect(spinner.className).toContain("my-spinner");
    expect(spinner.style.margin).toBe("10px");
  });

  it("forwards ref to the div element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<LoadingSpinner ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("LoadingScreen", () => {
  it("renders with default minHeight='60vh' and role='status'", () => {
    const { container } = render(
      <LoadingScreen data-testid="loading-screen" />,
    );
    const screenEl = screen.getByTestId("loading-screen");

    expect(screenEl.getAttribute("role")).toBe("status");
    expect(screenEl.style.minHeight).toBe("60vh");
    expect(container.querySelector("p")).toBeNull();
  });

  it("renders text when provided", () => {
    render(<LoadingScreen text="Loading tickets..." />);
    const textEl = screen.getByText("Loading tickets...");

    expect(textEl).toBeDefined();
    expect(textEl.tagName).toBe("P");
    expect(textEl.style.color).toBe(TOKENS.textSecondary);
  });

  it("supports custom minHeight", () => {
    render(<LoadingScreen minHeight="80vh" data-testid="loading-screen" />);
    const screenEl = screen.getByTestId("loading-screen");

    expect(screenEl.style.minHeight).toBe("80vh");
  });

  it("supports custom spinnerSize", () => {
    const { container } = render(
      <LoadingScreen spinnerSize="sm" data-testid="loading-screen" />,
    );
    const spinner = container.querySelector(
      '[aria-hidden="true"]',
    ) as HTMLElement;

    expect(spinner.style.width).toBe("16px");
    expect(spinner.style.height).toBe("16px");
  });

  it("forwards ref to the container element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<LoadingScreen ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
