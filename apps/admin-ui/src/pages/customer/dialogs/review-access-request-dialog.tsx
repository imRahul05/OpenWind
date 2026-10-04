import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DIALOG_CONTENT_RESET,
} from "@platform/ui";
import type { OrgUser } from "../assign-dropdown.js";

export type AccessLevel = "read_only" | "read_comment" | "read_write";

export interface ReviewAccessRequestData {
  reqId: string;
  requesterId: string;
  currentRequestedLevel: string;
}

export interface ReviewAccessRequestDialogProps {
  data: ReviewAccessRequestData | null;
  users: OrgUser[];
  saving: boolean;
  onClose: () => void;
  onResolve: (
    reqId: string,
    action: "approve" | "reject",
    level: AccessLevel,
  ) => Promise<void> | void;
}

const ACCESS_OPTIONS: Array<{
  value: AccessLevel;
  label: string;
  desc: string;
}> = [
  {
    value: "read_only",
    label: "View only",
    desc: "Can read the ticket but not comment",
  },
  {
    value: "read_comment",
    label: "View + comment",
    desc: "Can read and post comments",
  },
  {
    value: "read_write",
    label: "Full access",
    desc: "Can edit fields and transition state",
  },
];

export function ReviewAccessRequestDialog({
  data,
  users,
  saving,
  onClose,
  onResolve,
}: ReviewAccessRequestDialogProps): React.ReactElement {
  const [level, setLevel] = useState<AccessLevel>("read_comment");

  useEffect(() => {
    if (data) {
      if (
        data.currentRequestedLevel === "read_only" ||
        data.currentRequestedLevel === "read_comment" ||
        data.currentRequestedLevel === "read_write"
      ) {
        setLevel(data.currentRequestedLevel);
      } else {
        setLevel("read_comment");
      }
    }
  }, [data]);

  const requesterName =
    users.find((u) => u.userId === data?.requesterId)?.displayName ??
    data?.requesterId ??
    "User";

  const requestedLabel =
    data?.currentRequestedLevel === "read_only"
      ? "view-only"
      : data?.currentRequestedLevel === "read_comment"
        ? "view + comment"
        : "full";

  return (
    <Dialog
      open={data !== null}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="modal"
        style={DIALOG_CONTENT_RESET}
      >
        <div className="modal-header">
          <DialogTitle asChild>
            <h3 className="modal-title">Review access request</h3>
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              className="modal-close"
              aria-label="Close"
              onClick={onClose}
            >
              ✕
            </button>
          </DialogClose>
        </div>
        <div className="modal-body">
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              marginBottom: "14px",
            }}
          >
            {requesterName} requested <strong>{requestedLabel} access</strong>.
            Select the level to grant:
          </p>
          <div className="modal-access-opts">
            {ACCESS_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`modal-access-opt ${level === opt.value ? "modal-access-opt--active" : ""}`}
              >
                <input
                  type="radio"
                  name="resolve-level"
                  value={opt.value}
                  checked={level === opt.value}
                  onChange={() => setLevel(opt.value)}
                />
                <span className="modal-access-opt-label">{opt.label}</span>
                <span className="modal-access-opt-desc">{opt.desc}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="portal-btn-secondary"
            disabled={saving}
            onClick={() => {
              if (data) {
                void onResolve(data.reqId, "reject", level);
              }
            }}
          >
            Reject
          </button>
          <button
            type="button"
            className="portal-btn-primary"
            disabled={saving}
            onClick={() => {
              if (data) {
                void onResolve(data.reqId, "approve", level);
              }
            }}
          >
            {saving ? "Saving…" : "Approve"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
