import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";

const mockFetchWithAuth =
  vi.fn<(url: string, opts?: RequestInit) => Promise<unknown>>();
vi.mock("../../lib/api.js", () => ({
  API_URL: "/api",
  fetchWithAuth: (url: string, opts?: RequestInit): Promise<unknown> =>
    mockFetchWithAuth(url, opts),
}));

vi.mock("../../components/global-alert-dialog.js", () => ({
  showAlert: vi.fn(),
}));

const { NotificationPoliciesPage } = await import("./index.js");

const MOCK_TEAMS = [
  { id: "team-1", name: "Engineering" },
  { id: "team-2", name: "Support" },
];

const MOCK_WORKFLOWS = [{ id: "wf-1", name: "Incident Triage" }];

const MOCK_POLICIES = [
  {
    id: "pol-1",
    teamId: "team-1",
    workflowTypeId: "wf-1",
    severity: "critical" as const,
    channels: ["email" as const, "sms" as const],
    notifyBackup: true,
    notifyEscalationManager: true,
  },
];

describe("NotificationPoliciesPage", () => {
  beforeEach(() => {
    mockFetchWithAuth.mockReset();
    mockFetchWithAuth.mockImplementation((url: string) => {
      if (url.includes("/admin/notification-policies/resolve")) {
        return Promise.resolve({
          data: {
            policyId: "pol-1",
            matchedAt: "team",
            channels: ["email"],
            notifyBackup: true,
            notifyEscalationManager: false,
            recipients: [{ role: "primary", userId: "u-1", name: "Alice" }],
          },
        });
      }
      if (url.includes("/admin/notification-policies")) {
        return Promise.resolve({ data: MOCK_POLICIES });
      }
      if (url.includes("/admin/teams")) {
        return Promise.resolve({ data: MOCK_TEAMS });
      }
      if (url.includes("/workflows")) {
        return Promise.resolve({ data: MOCK_WORKFLOWS });
      }
      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders policies table and resolves names", async () => {
    render(<NotificationPoliciesPage />);

    await waitFor(() => {
      expect(screen.getByText("Notification Policies")).toBeDefined();
    });

    expect(screen.getAllByText("critical").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Engineering").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Incident Triage").length).toBeGreaterThan(0);
    expect(screen.getByText("email, sms")).toBeDefined();
  });

  it("opens create modal and saves new policy", async () => {
    render(<NotificationPoliciesPage />);

    await waitFor(() => {
      expect(screen.getByText("New Policy")).toBeDefined();
    });

    fireEvent.click(screen.getByText("New Policy"));
    expect(screen.getByText("Create policy")).toBeDefined();

    mockFetchWithAuth.mockResolvedValueOnce({ data: { id: "pol-new" } });
    fireEvent.click(screen.getByText("Create policy"));

    await waitFor(() => {
      expect(mockFetchWithAuth).toHaveBeenCalledWith(
        "/api/admin/notification-policies",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  it("executes preview simulation", async () => {
    render(<NotificationPoliciesPage />);

    await waitFor(() => {
      expect(screen.getByText("Preview")).toBeDefined();
    });

    fireEvent.click(screen.getByText("Resolve"));

    await waitFor(() => {
      expect(screen.getByText("Alice (primary)")).toBeDefined();
    });
  });
});
