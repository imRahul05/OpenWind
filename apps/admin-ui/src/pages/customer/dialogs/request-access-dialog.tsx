import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DIALOG_CONTENT_RESET,
} from "@platform/ui";

export type RequestAccessLevel = "read_only" | "read_comment" | "read_write";

export interface RequestAccessDialogProps {
  level: RequestAccessLevel | null;
  requesting: boolean;
  onClose: () => void;
  onConfirm: (level: RequestAccessLevel) => Promise<void> | void;
}

export function RequestAccessDialog({
  level,
  requesting,
  onClose,
  onConfirm,
}: RequestAccessDialogProps): React.ReactElement {
  return (
    <Dialog
      open={level !== null}
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
            <span className="modal-title">Request access?</span>
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              className="modal-close"
              aria-label="Close"
              onClick={onClose}
            >
              ×
            </button>
          </DialogClose>
        </div>
        <div className="modal-body">
          <p
            style={{
              margin: "0 0 18px",
              color: "var(--text-secondary)",
              fontSize: "14px",
            }}
          >
            {level === "read_comment"
              ? "This will send a request to the ticket owner for comment access. They will be able to approve or decline."
              : "This will send a request to the ticket owner for view access. They will be able to approve or decline."}
          </p>
          <div className="rcd-access-modal-actions">
            <button
              type="button"
              className="portal-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="portal-btn-primary"
              disabled={requesting}
              onClick={() => {
                if (level !== null) {
                  void onConfirm(level);
                }
              }}
            >
              {requesting ? "Sending…" : "Send Request"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
