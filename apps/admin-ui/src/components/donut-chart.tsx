import React from "react";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  showLegend?: boolean;
}

export function DonutChart({
  segments,
  size = 120,
  strokeWidth = 16,
  centerLabel = "TICKETS",
  showLegend = false,
}: DonutChartProps): React.ReactElement {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offsetAccum = 0;

  const chartSvg = (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--bg-tertiary)"
        strokeWidth={strokeWidth}
      />
      {total > 0 &&
        segments.map((s) => {
          const frac = s.value / total;
          const dash = frac * circumference;
          const dashArray = `${dash} ${circumference - dash}`;
          const dashOffset = -offsetAccum * circumference;
          offsetAccum += frac;
          return (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              strokeLinecap="butt"
            />
          );
        })}
      <text
        x="50%"
        y="47%"
        textAnchor="middle"
        fontSize={size > 110 ? "22" : "20"}
        fontWeight="800"
        fill="var(--text-primary)"
      >
        {total}
      </text>
      <text
        x="50%"
        y={size > 110 ? "64%" : "63%"}
        textAnchor="middle"
        fontSize="9"
        fontWeight="600"
        letterSpacing="0.05em"
        fill="var(--text-muted)"
      >
        {centerLabel}
      </text>
    </svg>
  );

  if (!showLegend) {
    return chartSvg;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
      {chartSvg}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          flex: 1,
          minWidth: 0,
        }}
      >
        {segments.slice(0, 5).map((s) => (
          <div
            key={s.label}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "2px",
                background: s.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {s.label}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {s.value}
            </span>
          </div>
        ))}
        {total === 0 && (
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            No records yet
          </span>
        )}
      </div>
    </div>
  );
}
