import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import {
  ReviewAccessRequestDialog,
  type ReviewAccessRequestData,
} from "./review-access-request-dialog.js";
import type { OrgUser } from "../assign-dropdown.js";

const USERS: OrgUser[] = [
  { userId: "u1", displayName: "Dev User", email: "dev@example.com" },
];

const REQUEST_DATA: ReviewAccessRequestData = {
  reqId: "req-1",
  requesterId: "u1",
  currentRequestedLevel: "read_only",
};

describe("ReviewAccessRequestDialog", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders requester name and requested access label", () => {
    render(
      <ReviewAccessRequestDialog
        data={REQUEST_DATA}
        users={USERS}
        saving={false}
        onClose={vi.fn()}
        onResolve={vi.fn()}
      />,
    );

    expect(screen.getByText("Review access request")).toBeDefined();
    expect(screen.getByText(/Dev User/)).toBeDefined();
    expect(screen.getByText(/view-only access/)).toBeDefined();
  });

  it("calls onResolve with approve and selected level", () => {
    const handleResolve = vi.fn();
    render(
      <ReviewAccessRequestDialog
        data={REQUEST_DATA}
        users={USERS}
        saving={false}
        onClose={vi.fn()}
        onResolve={handleResolve}
      />,
    );

    fireEvent.click(screen.getByLabelText("Full access"));
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));

    expect(handleResolve).toHaveBeenCalledWith(
      "req-1",
      "approve",
      "read_write",
    );
  });

  it("calls onResolve with reject when reject clicked", () => {
    const handleResolve = vi.fn();
    render(
      <ReviewAccessRequestDialog
        data={REQUEST_DATA}
        users={USERS}
        saving={false}
        onClose={vi.fn()}
        onResolve={handleResolve}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Reject" }));
    expect(handleResolve).toHaveBeenCalledWith("req-1", "reject", "read_only");
  });
});
