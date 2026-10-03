import * as React from "react";
import { TOKENS } from "./tokens.js";
import { cn } from "./utils.js";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  round?: boolean;
}

const baseSkeletonStyle: React.CSSProperties = {
  flexShrink: 0,
  background: `linear-gradient(90deg, ${TOKENS.bgTertiary} 25%, ${TOKENS.bgSecondary} 50%, ${TOKENS.bgTertiary} 75%)`,
  backgroundSize: "200% 100%",
  animation: "dash-skeleton 1.4s ease-in-out infinite",
};

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(
    {
      className,
      width = "100%",
      height = "14px",
      round = false,
      style,
      "aria-hidden": ariaHidden = true,
      ...props
    },
    ref,
  ): React.ReactElement {
    return (
      <div
        ref={ref}
        aria-hidden={ariaHidden}
        className={className ? cn(className) : undefined}
        style={{
          ...baseSkeletonStyle,
          width,
          height,
          borderRadius: round ? "50%" : TOKENS.radiusSm,
          ...style,
        }}
        {...props}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";
