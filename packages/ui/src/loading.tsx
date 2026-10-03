import * as React from "react";
import { TOKENS } from "./tokens.js";
import { cn } from "./utils.js";

export type LoadingSpinnerSize = "sm" | "default" | "lg";

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: LoadingSpinnerSize;
}

const spinnerBaseStyle: React.CSSProperties = {
  display: "inline-block",
  borderRadius: "50%",
  borderStyle: "solid",
  borderColor: TOKENS.borderColor,
  borderTopColor: TOKENS.accentPrimary,
  animation: "spin 1s linear infinite",
  boxSizing: "border-box",
  flexShrink: 0,
};

const spinnerSizeStyle: Record<LoadingSpinnerSize, React.CSSProperties> = {
  sm: { width: 16, height: 16, borderWidth: 2 },
  default: { width: 32, height: 32, borderWidth: 3 },
  lg: { width: 48, height: 48, borderWidth: 4 },
};

export const LoadingSpinner = React.forwardRef<
  HTMLDivElement,
  LoadingSpinnerProps
>(function LoadingSpinner(
  {
    size = "default",
    className,
    style,
    role = "status",
    "aria-label": ariaLabel,
    "aria-hidden": ariaHidden,
    ...props
  },
  ref,
): React.ReactElement {
  const isAriaHidden = ariaHidden === true || ariaHidden === "true";
  return (
    <div
      ref={ref}
      role={isAriaHidden ? undefined : role}
      aria-label={isAriaHidden ? undefined : (ariaLabel ?? "Loading")}
      aria-hidden={ariaHidden}
      className={className ? cn(className) : undefined}
      style={{
        ...spinnerBaseStyle,
        ...spinnerSizeStyle[size],
        ...style,
      }}
      {...props}
    />
  );
});
LoadingSpinner.displayName = "LoadingSpinner";

export interface LoadingScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  minHeight?: string | number;
  text?: React.ReactNode;
  spinnerSize?: LoadingSpinnerSize;
}

const screenContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  boxSizing: "border-box",
};

const screenTextStyle: React.CSSProperties = {
  color: TOKENS.textSecondary,
  fontWeight: 500,
  fontSize: 16,
  marginTop: 16,
  textAlign: "center",
};

export const LoadingScreen = React.forwardRef<
  HTMLDivElement,
  LoadingScreenProps
>(function LoadingScreen(
  {
    minHeight = "60vh",
    text,
    spinnerSize = "lg",
    className,
    style,
    role = "status",
    ...props
  },
  ref,
): React.ReactElement {
  return (
    <div
      ref={ref}
      role={role}
      className={className ? cn(className) : undefined}
      style={{
        ...screenContainerStyle,
        minHeight,
        ...style,
      }}
      {...props}
    >
      <LoadingSpinner size={spinnerSize} aria-hidden="true" />
      {text ? <p style={screenTextStyle}>{text}</p> : null}
    </div>
  );
});
LoadingScreen.displayName = "LoadingScreen";
