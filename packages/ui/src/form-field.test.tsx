import * as React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { FormField } from "./form-field.js";
import { Input } from "./input.js";
import { TOKENS } from "./tokens.js";

afterEach(() => {
  cleanup();
});

describe("FormField", () => {
  it("renders label, input container, and child", () => {
    render(
      <FormField label="Email" htmlFor="email-input">
        <Input id="email-input" />
      </FormField>,
    );

    const label = screen.getByText("Email");
    expect(label.tagName).toBe("LABEL");
    expect(label.getAttribute("for")).toBe("email-input");

    const input = screen.getByRole("textbox");
    expect(input.id).toBe("email-input");
  });

  it("renders required indicator (*) when required is true", () => {
    render(
      <FormField label="Full Name" required htmlFor="name-input">
        <Input id="name-input" />
      </FormField>,
    );

    const indicator = screen.getByText("*");
    expect(indicator.style.color).toBe(TOKENS.danger);
    expect(indicator.getAttribute("aria-hidden")).toBe("true");

    const input = screen.getByRole("textbox");
    expect(input.getAttribute("required")).toBe("");
  });

  it("does not render required indicator when required is false", () => {
    render(
      <FormField label="Bio" required={false} htmlFor="bio-input">
        <Input id="bio-input" />
      </FormField>,
    );

    expect(screen.queryByText("*")).toBeNull();
  });

  it("renders error message and sets aria-invalid and aria-describedby on input", () => {
    render(
      <FormField
        label="Username"
        error="Username is already taken"
        htmlFor="user-input"
      >
        <Input id="user-input" />
      </FormField>,
    );

    const error = screen.getByRole("alert");
    expect(error.textContent).toBe("Username is already taken");
    expect(error.id).toBe("user-input-error");
    expect(error.style.color).toBe(TOKENS.danger);

    const input = screen.getByRole("textbox");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("user-input-error");
  });

  it("renders hint message and attaches it to aria-describedby on input", () => {
    render(
      <FormField
        label="Password"
        hint="Must be at least 8 characters"
        htmlFor="pwd-input"
      >
        <Input id="pwd-input" type="password" />
      </FormField>,
    );

    const hint = screen.getByText("Must be at least 8 characters");
    expect(hint.id).toBe("pwd-input-hint");
    expect(hint.style.color).toBe(TOKENS.textMuted);

    const input = screen.getByLabelText("Password");
    expect(input.getAttribute("aria-describedby")).toBe("pwd-input-hint");
  });

  it("combines error and hint in aria-describedby when both are present", () => {
    render(
      <FormField
        label="Code"
        error="Code expired"
        hint="Enter the 6-digit verification code"
        htmlFor="code-input"
      >
        <Input id="code-input" />
      </FormField>,
    );

    const input = screen.getByRole("textbox");
    expect(input.getAttribute("aria-describedby")).toBe(
      "code-input-error code-input-hint",
    );
  });

  it("uses child's id if htmlFor is omitted", () => {
    render(
      <FormField label="First Name">
        <Input id="first-name-field" />
      </FormField>,
    );

    const label = screen.getByText("First Name");
    expect(label.getAttribute("for")).toBe("first-name-field");
  });

  it("generates an id if neither htmlFor nor child id is provided", () => {
    render(
      <FormField label="Auto ID">
        <Input />
      </FormField>,
    );

    const label = screen.getByText("Auto ID");
    const htmlFor = label.getAttribute("for");
    expect(htmlFor).toBeTruthy();

    const input = screen.getByRole("textbox");
    expect(input.id).toBe(htmlFor);
  });

  it("forwards ref to the outer container element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <FormField ref={ref} label="Ref Test">
        <Input />
      </FormField>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges custom className and style", () => {
    const { container } = render(
      <FormField
        label="Styled Field"
        className="custom-field"
        style={{ padding: "8px" }}
      >
        <Input />
      </FormField>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("custom-field");
    expect(wrapper.style.padding).toBe("8px");
  });
});
