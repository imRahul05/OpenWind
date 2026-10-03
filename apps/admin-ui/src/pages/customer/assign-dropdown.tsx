import React, { useState, useRef, useEffect } from "react";
import { useOutsideClick } from "../../hooks/use-outside-click.js";

export interface OrgUser {
  userId: string;
  email: string;
  displayName: string | null;
  loginName?: string;
}

export interface AssignDropdownProps {
  value: string;
  users: OrgUser[];
  disabled?: boolean;
  onChange: (userId: string) => void;
  className?: string;
}

export function AssignDropdown({
  value,
  users,
  disabled,
  onChange,
  className,
}: AssignDropdownProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedUser = users.find((u) => u.userId === value);
  const filtered = search
    ? users.filter((u) => {
        const q = search.toLowerCase();
        return (
          (u.displayName ?? "").toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        );
      })
    : users;

  useOutsideClick(containerRef, () => {
    if (open) {
      setOpen(false);
      setSearch("");
    }
  });

  useEffect(() => {
    if (open) {
      searchRef.current?.focus();
    }
  }, [open]);

  function select(userId: string): void {
    onChange(userId);
    setOpen(false);
    setSearch("");
  }

  return (
    <div ref={containerRef} className={`asgn-drop ${className ?? ""}`}>
      <button
        type="button"
        className={`asgn-trigger ${open ? "asgn-trigger-open" : ""}`}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
      >
        {selectedUser ? (
          <>
            <span className="asgn-avatar">
              {(selectedUser.displayName ?? selectedUser.email)
                .slice(0, 1)
                .toUpperCase()}
            </span>
            <span className="asgn-name">
              {selectedUser.displayName ?? selectedUser.email}
            </span>
          </>
        ) : (
          <>
            <span className="asgn-avatar asgn-avatar-empty">?</span>
            <span className="asgn-name asgn-unassigned">Unassigned</span>
          </>
        )}
        <svg
          className="asgn-chevron"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="asgn-menu">
          <div className="asgn-search-wrap">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchRef}
              className="asgn-search"
              placeholder="Search people…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="asgn-options">
            <button
              type="button"
              className={`asgn-option ${!value ? "asgn-option-selected" : ""}`}
              onClick={() => select("")}
            >
              <span className="asgn-avatar asgn-avatar-empty">?</span>
              <span className="asgn-option-info">
                <span className="asgn-option-name">Unassigned</span>
              </span>
              {!value && (
                <svg
                  className="asgn-check"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
            {filtered.length === 0 && (
              <div className="asgn-empty">No results</div>
            )}
            {filtered.map((u) => (
              <button
                key={u.userId}
                type="button"
                className={`asgn-option ${value === u.userId ? "asgn-option-selected" : ""}`}
                onClick={() => select(u.userId)}
              >
                <span className="asgn-avatar">
                  {(u.displayName ?? u.email).slice(0, 1).toUpperCase()}
                </span>
                <span className="asgn-option-info">
                  <span className="asgn-option-name">
                    {u.displayName ?? u.email}
                  </span>
                  <span className="asgn-option-email">{u.email}</span>
                </span>
                {value === u.userId && (
                  <svg
                    className="asgn-check"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
