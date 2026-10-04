import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  Button,
  DIALOG_CONTENT_RESET,
} from "@platform/ui";

export interface ArchiveConfirmDialogProps {
  open: boolean;
  childCount: number;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
}

export function ArchiveConfirmDialog({
  open,
  childCount,
  loading,
  onOpenChange,
  onConfirm,
}: ArchiveConfirmDialogProps): React.ReactElement {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="modal" style={DIALOG_CONTENT_RESET}>
        <div className="modal-header">
          <AlertDialogTitle asChild>
            <h3 className="modal-title">Archive this record?</h3>
          </AlertDialogTitle>
        </div>
        <div className="modal-body">
          <AlertDialogDescription asChild>
            <p className="rcd-modal-desc">
              This record has{" "}
              <strong>
                {childCount} sub-task{childCount !== 1 ? "s" : ""}
              </strong>
              . Archiving will also archive all of them. This can be undone with
              Restore.
            </p>
          </AlertDialogDescription>
        </div>
        <AlertDialogFooter className="modal-footer">
          <AlertDialogCancel asChild>
            <Button variant="secondary" disabled={loading}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="primary"
              className="rcd-btn-archive-confirm"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                void onConfirm();
              }}
            >
              {loading ? "Archiving…" : `Archive all ${childCount + 1}`}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
