import React, { useRef, useState } from "react";
import { useOutsideClick } from "../hooks/use-outside-click.js";

export interface TeamOption {
  id: string;
  name: string;
}

export interface TeamPickerProps {
  teams: TeamOption[];
  value: string;
  onChange: (teamId: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Simple non-searchable dropdown for teams (docs/specs/team-assign-oncall-fallback.md R1).
// Teams are a short, admin-curated list, not a large searchable org roster.
export function TeamPicker({
  teams,
  value,
  onChange,
  placeholder = "Select a team…",
  disabled = false,
}: TeamPickerProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = teams.find((t) => t.id === value) ?? null;

  useOutsideClick(ref, () => setOpen(false));

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "9px 12px",
          background: "var(--bg-primary)",
          border: "1.5px solid var(--border-primary)",
          borderRadius: "var(--radius-sm)",
          cursor: disabled ? "not-allowed" : "pointer",
          textAlign: "left",
          color: selected ? "var(--text-primary)" : "var(--text-tertiary)",
          fontSize: "14px",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {selected ? selected.name : placeholder}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "var(--bg-primary)",
            border: "1.5px solid var(--border-primary)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 50,
            overflow: "hidden",
            maxHeight: "220px",
            overflowY: "auto",
          }}
        >
          {teams.length === 0 ? (
            <div
              style={{
                padding: "12px",
                textAlign: "center",
                color: "var(--text-tertiary)",
                fontSize: "13px",
              }}
            >
              No teams configured
            </div>
          ) : (
            teams.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  onChange(t.id);
                  setOpen(false);
                }}
                style={{
                  padding: "9px 12px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "var(--text-primary)",
                }}
              >
                {t.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
