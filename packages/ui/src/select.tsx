import * as React from "react";
import { TOKENS } from "./tokens.js";
import { cn } from "./utils.js";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const baseSelectStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  background: TOKENS.bgSecondary,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: TOKENS.borderColor,
  borderRadius: TOKENS.radiusSm,
  color: TOKENS.textPrimary,
  fontSize: 13,
  fontFamily: "inherit",
  transition: `border-color ${TOKENS.transitionFast}, box-shadow ${TOKENS.transitionFast}`,
  boxSizing: "border-box",
  outline: "none",
  cursor: "pointer",
};

const focusStyle: React.CSSProperties = {
  borderColor: TOKENS.accentPrimary,
  boxShadow: `0 0 0 2px ${TOKENS.borderFocus}`,
};

const errorBorderStyle: React.CSSProperties = {
  borderColor: TOKENS.danger,
};

const errorFocusStyle: React.CSSProperties = {
  borderColor: TOKENS.danger,
  boxShadow: "0 0 0 2px hsla(350, 80%, 60%, 0.25)",
};

const disabledStyle: React.CSSProperties = {
  opacity: 0.5,
  cursor: "not-allowed",
  backgroundColor: TOKENS.bgTertiary,
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      className,
      style,
      disabled,
      error = false,
      onFocus,
      onBlur,
      children,
      ...props
    },
    ref,
  ): React.ReactElement {
    const [focused, setFocused] = React.useState(false);
    const isInvalid =
      error ||
      props["aria-invalid"] === true ||
      props["aria-invalid"] === "true";

    return (
      <select
        ref={ref}
        disabled={disabled}
        aria-invalid={isInvalid ? true : props["aria-invalid"]}
        className={className ? cn(className) : undefined}
        style={{
          ...baseSelectStyle,
          ...(isInvalid ? errorBorderStyle : null),
          ...(focused && !isInvalid ? focusStyle : null),
          ...(focused && isInvalid ? errorFocusStyle : null),
          ...(disabled ? disabledStyle : null),
          ...style,
        }}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";
