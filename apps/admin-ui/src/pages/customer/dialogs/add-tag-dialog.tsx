import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  Button,
  DIALOG_CONTENT_RESET,
} from "@platform/ui";

export interface AddTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTag: (tagText: string) => Promise<void>;
}

export function AddTagDialog({
  open,
  onOpenChange,
  onAddTag,
}: AddTagDialogProps): React.ReactElement {
  const [tagText, setTagText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (next: boolean): void => {
    if (!next) {
      setTagText("");
      setError(null);
      setIsSubmitting(false);
    }
    onOpenChange(next);
  };

  const handleSubmit = async (): Promise<void> => {
    const text = tagText.trim();
    if (!text || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onAddTag(text);
      handleOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="modal"
        style={DIALOG_CONTENT_RESET}
      >
        <div className="modal-header">
          <DialogTitle asChild>
            <h3 className="modal-title">Add tag</h3>
          </DialogTitle>
          <DialogClose asChild>
            <button type="button" className="modal-close" aria-label="Close">
              ×
            </button>
          </DialogClose>
        </div>
        <div className="modal-body">
          {error && (
            <div
              className="portal-alert-error"
              style={{ marginBottom: "12px" }}
            >
              {error}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Tag</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. railways"
              value={tagText}
              disabled={isSubmitting}
              onChange={(e) => setTagText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleSubmit();
                }
              }}
              autoFocus
            />
          </div>
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={isSubmitting || !tagText.trim()}
            onClick={() => void handleSubmit()}
          >
            {isSubmitting ? "Adding…" : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
