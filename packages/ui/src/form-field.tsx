import * as React from "react";
import { TOKENS } from "./tokens.js";
import { cn } from "./utils.js";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  required?: boolean;
  error?: React.ReactNode;
  hint?: React.ReactNode;
  htmlFor?: string;
  children?: React.ReactNode;
}

interface ControlElementProps {
  id?: string | undefined;
  "aria-invalid"?: boolean | "true" | "false" | undefined;
  "aria-describedby"?: string | undefined;
  "aria-required"?: boolean | undefined;
  required?: boolean | undefined;
}

const containerStyle: React.CSSProperties = {
  marginBottom: 16,
  display: "flex",
  flexDirection: "column",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: TOKENS.textSecondary,
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const requiredIndicatorStyle: React.CSSProperties = {
  color: TOKENS.danger,
  marginLeft: 3,
};

const inputContainerStyle: React.CSSProperties = {
  width: "100%",
  position: "relative",
};

const errorStyle: React.CSSProperties = {
  marginTop: 5,
  fontSize: 12,
  color: TOKENS.danger,
};

const hintStyle: React.CSSProperties = {
  marginTop: 5,
  fontSize: 11,
  color: TOKENS.textMuted,
};

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField(
    {
      label,
      required = false,
      error,
      hint,
      htmlFor,
      className,
      style,
      children,
      ...props
    },
    ref,
  ): React.ReactElement {
    const generatedId = React.useId();
    const safeGeneratedId = `field-${generatedId.replace(/:/g, "")}`;

    let childId: string | undefined;
    if (
      React.isValidElement<ControlElementProps>(children) &&
      typeof children.props.id === "string"
    ) {
      childId = children.props.id;
    }

    const inputId = htmlFor ?? childId ?? safeGeneratedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    const hasError = Boolean(error);

    let childNode = children;
    if (React.isValidElement<ControlElementProps>(children)) {
      const existingDescribedBy =
        typeof children.props["aria-describedby"] === "string"
          ? children.props["aria-describedby"]
          : undefined;

      const describedByParts: string[] = [];
      if (hasError) describedByParts.push(errorId);
      if (hint) describedByParts.push(hintId);
      if (existingDescribedBy) describedByParts.push(existingDescribedBy);
      const describedBy =
        describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

      childNode = React.cloneElement(children, {
        id: children.props.id ?? inputId,
        "aria-invalid":
          children.props["aria-invalid"] ?? (hasError ? true : undefined),
        "aria-describedby": describedBy,
        "aria-required":
          children.props["aria-required"] ?? (required ? true : undefined),
        required: children.props.required ?? (required ? true : undefined),
      });
    }

    return (
      <div
        ref={ref}
        className={className ? cn(className) : undefined}
        style={{ ...containerStyle, ...style }}
        {...props}
      >
        {label ? (
          <label htmlFor={inputId} style={labelStyle}>
            {label}
            {required ? (
              <span style={requiredIndicatorStyle} aria-hidden="true">
                *
              </span>
            ) : null}
          </label>
        ) : null}
        <div data-slot="input-container" style={inputContainerStyle}>
          {childNode}
        </div>
        {hasError && typeof error !== "boolean" ? (
          <div id={errorId} role="alert" style={errorStyle}>
            {error}
          </div>
        ) : null}
        {hint ? (
          <div id={hintId} style={hintStyle}>
            {hint}
          </div>
        ) : null}
      </div>
    );
  },
);
FormField.displayName = "FormField";
