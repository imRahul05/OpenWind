import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  Button,
  DIALOG_CONTENT_RESET,
} from "@platform/ui";

export interface Transition {
  id: string;
  fromState: string;
  toState: string;
  label: string;
  requiresComment: boolean;
}

export interface TransitionDialogProps {
  transition: Transition | null;
  currentState: string | null;
  isTransitioning: boolean;
  onClose: () => void;
  onConfirm: (transition: Transition, comment?: string) => Promise<void> | void;
}

export function TransitionDialog({
  transition,
  currentState,
  isTransitioning,
  onClose,
  onConfirm,
}: TransitionDialogProps): React.ReactElement {
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!transition) {
      setComment("");
    }
  }, [transition]);

  const handleClose = (): void => {
    setComment("");
    onClose();
  };

  const handleConfirm = (): void => {
    if (!transition) return;
    void onConfirm(transition, comment.trim() || undefined);
  };

  return (
    <Dialog
      open={transition !== null}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="modal"
        style={DIALOG_CONTENT_RESET}
      >
        <div className="modal-header">
          <DialogTitle asChild>
            <h3 className="modal-title">
              Move to "
              {(transition?.label ?? "") || (transition?.toState ?? "")}"
            </h3>
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              className="modal-close"
              aria-label="Close"
              onClick={handleClose}
            >
              ×
            </button>
          </DialogClose>
        </div>
        <div className="modal-body">
          <p className="rcd-modal-desc">
            This will transition the record from <strong>{currentState}</strong>{" "}
            to <strong>{transition?.toState}</strong>.
          </p>
          <div className="form-group">
            <label className="form-label">
              Comment {transition?.requiresComment ? "*" : "(optional)"}
            </label>
            <textarea
              className="form-input portal-textarea"
              rows={3}
              placeholder="Add a note about this transition…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={
              (Boolean(transition?.requiresComment) && !comment.trim()) ||
              isTransitioning
            }
            onClick={handleConfirm}
          >
            {isTransitioning ? "Moving…" : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
