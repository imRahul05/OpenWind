import * as React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Skeleton } from "./skeleton.js";
import { TOKENS } from "./tokens.js";

afterEach(() => {
  cleanup();
});

describe("Skeleton", () => {
  it("renders with default props and aria-hidden='true'", () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton.getAttribute("aria-hidden")).toBe("true");
    expect(skeleton.style.width).toBe("100%");
    expect(skeleton.style.height).toBe("14px");
    expect(skeleton.style.borderRadius).toBe(TOKENS.radiusSm);
    expect(skeleton.style.animation).toBe(
      "dash-skeleton 1.4s ease-in-out infinite",
    );
    expect(skeleton.style.background).toContain("linear-gradient");
  });

  it("applies custom width and height", () => {
    render(<Skeleton data-testid="skeleton" width="60%" height="24px" />);
    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton.style.width).toBe("60%");
    expect(skeleton.style.height).toBe("24px");
  });

  it("applies 50% border-radius when round is true", () => {
    render(
      <Skeleton data-testid="skeleton" width="48px" height="48px" round />,
    );
    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton.style.borderRadius).toBe("50%");
  });

  it("merges custom className and inline style", () => {
    render(
      <Skeleton
        data-testid="skeleton"
        className="custom-skeleton"
        style={{ opacity: 0.8 }}
      />,
    );
    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton.className).toContain("custom-skeleton");
    expect(skeleton.style.opacity).toBe("0.8");
  });

  it("forwards ref to the underlying div element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} data-testid="skeleton" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId("skeleton"));
  });
});
