import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DIALOG_CONTENT_RESET,
} from "@platform/ui";

export type TicketAlertScope = "me" | "all";

export interface TicketAlert {
  id: string;
  instanceId: string;
  note: string;
  fireAt: string;
  firedAt?: string | null;
  scope: TicketAlertScope;
  status: "pending" | "fired" | "cancelled";
  createdBy: string;
}

export interface TicketAlertFormData {
  id?: string;
  note: string;
  fireAt: string;
  scope: TicketAlertScope;
}

export interface TicketAlertsDialogProps {
  open: boolean;
  alerts: TicketAlert[];
  currentUserId: string | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onSaveAlert: (data: TicketAlertFormData) => Promise<void> | void;
  onCancelAlert: (alertId: string) => Promise<void> | void;
}

const INITIAL_FORM: TicketAlertFormData = {
  note: "",
  fireAt: "",
  scope: "me",
};

export function TicketAlertsDialog({
  open,
  alerts,
  currentUserId,
  loading,
  saving,
  error,
  onOpenChange,
  onSaveAlert,
  onCancelAlert,
}: TicketAlertsDialogProps): React.ReactElement {
  const [formData, setFormData] = useState<TicketAlertFormData>(INITIAL_FORM);
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);

  const resetForm = (): void => {
    setFormData(INITIAL_FORM);
    setEditingAlertId(null);
  };

  const handleStartEdit = (alert: TicketAlert): void => {
    const localIso = new Date(alert.fireAt).toISOString().slice(0, 16);
    setFormData({
      id: alert.id,
      note: alert.note,
      fireAt: localIso,
      scope: alert.scope,
    });
    setEditingAlertId(alert.id);
  };

  const handleClose = (): void => {
    resetForm();
    onOpenChange(false);
  };

  const handleSave = async (): Promise<void> => {
    if (!formData.note.trim() || !formData.fireAt || saving) return;
    await onSaveAlert(formData);
    resetForm();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : handleClose())}
    >
      <DialogContent
        showCloseButton={false}
        className="modal"
        style={DIALOG_CONTENT_RESET}
      >
        <div className="modal-header">
          <DialogTitle asChild>
            <h3 className="modal-title">Alerts</h3>
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              className="modal-close"
              aria-label="Close"
              onClick={handleClose}
            >
              ✕
            </button>
          </DialogClose>
        </div>
        <div className="modal-body">
          {error && (
            <p
              style={{
                color: "var(--danger, #e5484d)",
                fontSize: "13px",
                marginBottom: "10px",
              }}
            >
              {error}
            </p>
          )}

          {loading ? (
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              Loading…
            </p>
          ) : alerts.length === 0 ? (
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              No alerts on this ticket yet.
            </p>
          ) : (
            <div className="alerts-list">
              {alerts.map((alert) => {
                const isOwn = alert.createdBy === currentUserId;
                return (
                  <div key={alert.id} className="alert-row">
                    <div className="alert-row-main">
                      <span className="alert-row-note">{alert.note}</span>
                      <span className="alert-row-meta">
                        {new Date(alert.fireAt).toLocaleString()} ·{" "}
                        {alert.scope === "all"
                          ? "Everyone with access"
                          : "Just me"}
                        {!isOwn && " (shared)"}
                      </span>
                    </div>
                    <div className="alert-row-status">
                      {alert.status === "pending" && (
                        <span className="alert-badge alert-badge-pending">
                          pending
                        </span>
                      )}
                      {alert.status === "fired" && (
                        <span className="alert-badge alert-badge-fired">
                          fired
                          {alert.firedAt
                            ? ` · ${new Date(alert.firedAt).toLocaleString()}`
                            : ""}
                        </span>
                      )}
                      {alert.status === "cancelled" && (
                        <span className="alert-badge alert-badge-cancelled">
                          cancelled
                        </span>
                      )}
                    </div>
                    {isOwn && alert.status === "pending" && (
                      <div className="alert-row-actions">
                        <button
                          type="button"
                          className="alert-row-action-btn"
                          aria-label="Edit alert"
                          onClick={() => handleStartEdit(alert)}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="alert-row-action-btn"
                          aria-label="Cancel alert"
                          onClick={() => void onCancelAlert(alert.id)}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="alert-form">
            <div className="alert-form-title">
              {editingAlertId ? "Edit Alert" : "Add Alert"}
            </div>
            <input
              className="portal-input"
              type="text"
              placeholder="Note"
              value={formData.note}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, note: e.target.value }))
              }
              maxLength={2000}
            />
            <input
              className="portal-input"
              type="datetime-local"
              value={formData.fireAt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fireAt: e.target.value }))
              }
            />
            <div className="modal-access-opts">
              <label>
                <input
                  type="radio"
                  name="alert-scope"
                  checked={formData.scope === "me"}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, scope: "me" }))
                  }
                />{" "}
                Just me
              </label>
              <label>
                <input
                  type="radio"
                  name="alert-scope"
                  checked={formData.scope === "all"}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, scope: "all" }))
                  }
                />{" "}
                Everyone with access
              </label>
            </div>
            <div className="alert-form-actions">
              {editingAlertId && (
                <button
                  type="button"
                  className="portal-btn-secondary"
                  disabled={saving}
                  onClick={resetForm}
                >
                  Cancel edit
                </button>
              )}
              <button
                type="button"
                className="portal-btn-primary"
                disabled={saving || !formData.note.trim() || !formData.fireAt}
                onClick={() => void handleSave()}
              >
                {saving
                  ? "Saving…"
                  : editingAlertId
                    ? "Update alert"
                    : "Save alert"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
