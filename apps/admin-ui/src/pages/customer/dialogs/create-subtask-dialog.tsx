import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  Button,
  DIALOG_CONTENT_RESET,
} from "@platform/ui";
import { AssignDropdown, type OrgUser } from "../assign-dropdown.js";

export interface CreateSubtaskFormData {
  title: string;
  assignedTo: string;
  dueDate: string;
  description: string;
}

export interface CreateSubtaskDialogProps {
  open: boolean;
  users: OrgUser[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSubtaskFormData) => Promise<void>;
}

const INITIAL_FORM: CreateSubtaskFormData = {
  title: "",
  assignedTo: "",
  dueDate: "",
  description: "",
};

export function CreateSubtaskDialog({
  open,
  users,
  onOpenChange,
  onSubmit,
}: CreateSubtaskDialogProps): React.ReactElement {
  const [form, setForm] = useState<CreateSubtaskFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = (): void => {
    setForm(INITIAL_FORM);
    setError(null);
    setLoading(false);
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!form.title.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit(form);
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create sub-task",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="modal"
        style={DIALOG_CONTENT_RESET}
      >
        <div className="modal-header">
          <DialogTitle asChild>
            <h3 className="modal-title">New sub-task</h3>
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
        <form onSubmit={(e) => void handleSubmit(e)}>
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
              <label className="form-label">Title *</label>
              <input
                className="form-input"
                type="text"
                placeholder="Sub-task title…"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Assign to</label>
              <AssignDropdown
                value={form.assignedTo}
                users={users}
                onChange={(assignedTo) =>
                  setForm((f) => ({ ...f, assignedTo }))
                }
                className="asgn-drop-full"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Due date</label>
              <input
                className="form-input"
                type="datetime-local"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="What needs to be done…"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                style={{ resize: "vertical" }}
              />
            </div>
          </div>
          <div className="modal-footer">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!form.title.trim() || loading}
            >
              {loading ? "Creating…" : "Create sub-task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
