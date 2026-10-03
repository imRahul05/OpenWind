import React from "react";
import { withAlpha } from "../lib/theme.js";

export interface SectionHeaderProps {
  title: string;
  icon?: string;
  color?: string;
  action?: React.ReactNode;
  variant?: "default" | "muted-uppercase";
}

export function SectionHeader({
  title,
  icon,
  color,
  action,
  variant = "default",
}: SectionHeaderProps): React.ReactElement {
  const isUppercase = variant === "muted-uppercase";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        rowGap: "10px",
        paddingBottom: isUppercase ? "12px" : "14px",
        borderBottom: "1px solid var(--border-color)",
        marginBottom: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {icon && (
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "8px",
              background: withAlpha(color ?? "hsl(211,100%,50%)", 0.14),
              border: `1px solid ${withAlpha(color ?? "hsl(211,100%,50%)", 0.28)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <h3
          style={{
            fontSize: isUppercase ? "13px" : "14px",
            fontWeight: 700,
            color: isUppercase ? "var(--text-muted)" : "var(--text-primary)",
            textTransform: isUppercase ? "uppercase" : "none",
            letterSpacing: isUppercase ? "0.07em" : "-0.01em",
            margin: 0,
          }}
        >
          {title}
        </h3>
      </div>
      {action}
    </div>
  );
}
