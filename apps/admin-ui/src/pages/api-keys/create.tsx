import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  Button,
} from "@platform/ui";
import { fetchWithAuth, API_URL } from "../../lib/api.js";

// Same runtime-config injection pattern already used in authProvider.ts and
// users.tsx — Docker wins over Vite build-time env. Never hardcode "Zitadel"
// or "OpenWind" here: a downstream fork (e.g. an AuthNexus-paired deployment)
// runs the same codebase against a completely different identity provider,
// and this label must reflect THIS deployment's actual configured issuer,
// not the upstream project's name.
declare const window: Window & { __CONFIG__?: Record<string, string> };
const PRIMARY_ISSUER = window.__CONFIG__?.ZITADEL_ISSUER ?? null;

// Spec R8: presets are UI sugar only, mapping to the platform's real
// entity:ticket:<verb> vocabulary — never a stored boolean/enum tier.
const READ_ONLY_SCOPES = ["entity:ticket:read"];
const READ_WRITE_SCOPES = [
  "entity:ticket:create",
  "entity:ticket:read",
  "entity:ticket:comment",
  "entity:ticket:transition",
  "entity:ticket:subticket",
  "entity:ticket:attach",
];
const ALL_VERBS = READ_WRITE_SCOPES;

type ScopeMode = "read-only" | "read-write" | "custom";

// docs/specs/third-party-key-external-org-mapping.md — a key's acting-person
// tokens can come from the platform's own identity provider (default,
// unchanged behavior) or from a different one entirely, when explicitly
// registered. "same"/"external" is UI sugar over the two real API shapes:
// same -> neither field sent; external -> both required.
type IdentityProviderMode = "same" | "external";

export interface CreateApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  /** Called once the key is created and the user dismisses the "copy it now" screen. */
  onCreated: () => void;
}

interface CreateApiKeyFormData {
  applicationName: string;
  applicationDescription: string;
  applicationContactEmail: string;
  oidcClientId: string;
  identityProviderMode: IdentityProviderMode;
  externalIssuer: string;
  externalOrgId: string;
  scopeMode: ScopeMode;
  customScopes: string[];
}

const INITIAL_FORM_DATA: CreateApiKeyFormData = {
  applicationName: "",
  applicationDescription: "",
  applicationContactEmail: "",
  oidcClientId: "",
  identityProviderMode: "same",
  externalIssuer: "",
  externalOrgId: "",
  scopeMode: "read-only",
  customScopes: [],
};

interface FormFieldConfig {
  key:
    | "applicationName"
    | "applicationDescription"
    | "applicationContactEmail"
    | "oidcClientId"
    | "externalIssuer"
    | "externalOrgId";
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  autoFocus?: boolean;
}

const APP_FIELDS: readonly FormFieldConfig[] = [
  {
    key: "applicationName",
    label: "Application Name *",
    placeholder: "e.g. Acme Helpdesk Sync",
    required: true,
    autoFocus: true,
  },
  {
    key: "applicationDescription",
    label: "Description",
    placeholder: "What this integration does",
  },
  {
    key: "applicationContactEmail",
    label: "Application Contact Email *",
    placeholder: "ops@example.com",
    type: "email",
    required: true,
  },
  {
    key: "oidcClientId",
    label: "OIDC Client ID *",
    placeholder: "acme-helpdesk-sync-client",
    required: true,
  },
] as const;

const EXTERNAL_IDP_FIELDS: readonly FormFieldConfig[] = [
  {
    key: "externalIssuer",
    label: "Issuer URL *",
    placeholder: "https://auth.example.com",
    type: "url",
    required: true,
  },
  {
    key: "externalOrgId",
    label: "External Org ID *",
    placeholder: "the org id this application's users belong to on that issuer",
    required: true,
  },
] as const;

export function CreateApiKeyModal({
  open,
  onClose,
  onCreated,
}: CreateApiKeyModalProps): React.ReactElement {
  const [formData, setFormData] =
    useState<CreateApiKeyFormData>(INITIAL_FORM_DATA);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const {
    applicationName,
    applicationDescription,
    applicationContactEmail,
    oidcClientId,
    identityProviderMode,
    externalIssuer,
    externalOrgId,
    scopeMode,
    customScopes,
  } = formData;

  const scopes =
    scopeMode === "read-only"
      ? READ_ONLY_SCOPES
      : scopeMode === "read-write"
        ? READ_WRITE_SCOPES
        : customScopes;

  const isValid =
    applicationName.trim().length > 0 &&
    applicationContactEmail.trim().length > 0 &&
    oidcClientId.trim().length > 0 &&
    scopes.length > 0 &&
    (identityProviderMode === "same" ||
      (externalIssuer.trim().length > 0 && externalOrgId.trim().length > 0));

  function updateField<K extends keyof CreateApiKeyFormData>(
    key: K,
    value: CreateApiKeyFormData[K],
  ): void {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm(): void {
    setFormData(INITIAL_FORM_DATA);
    setError(null);
    setCreatedKey(null);
  }

  function toggleCustomScope(scope: string): void {
    updateField(
      "customScopes",
      customScopes.includes(scope)
        ? customScopes.filter((s) => s !== scope)
        : [...customScopes, scope],
    );
  }

  async function handleCreate(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!isValid) return;
    setSaving(true);
    setError(null);
    try {
      const res = (await fetchWithAuth(`${API_URL}/api-keys`, {
        method: "POST",
        body: JSON.stringify({
          name: applicationName.trim(),
          scopes,
          applicationName: applicationName.trim(),
          applicationDescription: applicationDescription.trim() || undefined,
          applicationContactEmail: applicationContactEmail.trim(),
          oidcClientId: oidcClientId.trim(),
          ...(identityProviderMode === "external"
            ? {
                externalIssuer: externalIssuer.trim(),
                externalOrgId: externalOrgId.trim(),
              }
            : {}),
        }),
      })) as { data: { key: string } };
      setCreatedKey(res.data.key);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key");
    } finally {
      setSaving(false);
    }
  }

  function handleOpenChange(next: boolean): void {
    if (next) return;
    // Closing after a successful create counts as "done" (refresh the list);
    // closing beforehand is a plain cancel.
    if (createdKey) onCreated();
    else onClose();
    resetForm();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} style={{ maxWidth: 480 }}>
        {createdKey ? (
          <>
            <DialogTitle asChild>
              <h2 className="page-title">Key created</h2>
            </DialogTitle>
            <p className="page-subtitle">
              Copy this key now — it cannot be shown again.
            </p>
            <pre
              style={{
                padding: "12px",
                background: "var(--surface-2, #f3f4f6)",
                borderRadius: "8px",
                wordBreak: "break-all",
                userSelect: "all",
              }}
            >
              {createdKey}
            </pre>
            <Button
              variant="primary"
              style={{ marginTop: "20px" }}
              onClick={() => {
                onCreated();
                resetForm();
              }}
            >
              Done
            </Button>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div>
                <DialogTitle asChild>
                  <h2 className="page-title">New API Key</h2>
                </DialogTitle>
                <p className="page-subtitle">
                  Register a third-party application that can access tickets via
                  API.
                </p>
              </div>
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Close"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 20,
                    lineHeight: 1,
                    color: "var(--text-muted)",
                  }}
                >
                  ×
                </button>
              </DialogClose>
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginTop: "16px" }}>
                {error}
              </div>
            )}

            <form onSubmit={(e) => void handleCreate(e)}>
              {APP_FIELDS.map((f) => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input
                    className="form-input"
                    type={f.type ?? "text"}
                    placeholder={f.placeholder}
                    value={formData[f.key]}
                    autoFocus={f.autoFocus}
                    onChange={(e) => updateField(f.key, e.target.value)}
                    required={f.required}
                  />
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">Identity Provider *</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <Button
                    type="button"
                    variant={
                      identityProviderMode === "same" ? "primary" : "secondary"
                    }
                    onClick={() => updateField("identityProviderMode", "same")}
                  >
                    Same auth provider
                  </Button>
                  <Button
                    type="button"
                    variant={
                      identityProviderMode === "external"
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() =>
                      updateField("identityProviderMode", "external")
                    }
                  >
                    External provider
                  </Button>
                </div>
                <p
                  className="page-subtitle"
                  style={{ marginTop: 0, marginBottom: 8 }}
                >
                  {identityProviderMode === "same" ? (
                    <>
                      This key&apos;s acting-person tokens will be verified
                      against this platform&apos;s own identity provider — the
                      default, and correct for almost every key.
                      {PRIMARY_ISSUER && (
                        <>
                          {" "}
                          Currently:{" "}
                          <code style={{ fontSize: 12 }}>{PRIMARY_ISSUER}</code>
                          .
                        </>
                      )}
                    </>
                  ) : (
                    "Only choose this if the application's end users log in through a completely different identity provider than this platform's own — e.g. their own separate OIDC tenant."
                  )}
                </p>
                {identityProviderMode === "external" &&
                  EXTERNAL_IDP_FIELDS.map((f) => (
                    <div key={f.key} className="form-group">
                      <label className="form-label">{f.label}</label>
                      <input
                        className="form-input"
                        type={f.type ?? "text"}
                        placeholder={f.placeholder}
                        value={formData[f.key]}
                        onChange={(e) => updateField(f.key, e.target.value)}
                        required={f.required}
                      />
                    </div>
                  ))}
              </div>

              <div className="form-group">
                <label className="form-label">Permissions *</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <Button
                    type="button"
                    variant={
                      scopeMode === "read-only" ? "primary" : "secondary"
                    }
                    onClick={() => updateField("scopeMode", "read-only")}
                  >
                    Read-only
                  </Button>
                  <Button
                    type="button"
                    variant={
                      scopeMode === "read-write" ? "primary" : "secondary"
                    }
                    onClick={() => updateField("scopeMode", "read-write")}
                  >
                    Read-write
                  </Button>
                  <Button
                    type="button"
                    variant={scopeMode === "custom" ? "primary" : "secondary"}
                    onClick={() => updateField("scopeMode", "custom")}
                  >
                    Custom
                  </Button>
                </div>
                {scopeMode === "custom" && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    {ALL_VERBS.map((scope) => (
                      <label
                        key={scope}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 13,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={customScopes.includes(scope)}
                          onChange={() => toggleCustomScope(scope)}
                        />
                        {scope}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={!isValid || saving}
                style={{ marginTop: "16px" }}
              >
                {saving ? "Creating…" : "Create Key"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
