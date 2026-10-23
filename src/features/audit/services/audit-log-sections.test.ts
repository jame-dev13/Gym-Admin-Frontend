// @vitest-environment node
// Pure unit tests: no DOM or API access.
import type { AuditLogResponse } from "@/features/audit/types";
import { AUDIT_EMPTY_VALUE } from "@/features/audit/services/audit-log-normalizer";
import { buildAuditLogSections } from "@/features/audit/services/audit-log-sections";

const buildAuditLog = (
  overrides: Partial<AuditLogResponse> = {},
): AuditLogResponse => ({
  entity: { type: "customer", entityId: { id: 24 } },
  action: "UPDATE",
  actor: { userId: { id: 7 }, username: "ana" },
  payload: {
    type: "CRUD",
    before: { name: "Old" },
    after: { name: "New" },
  },
  metadata: { ip: "192.168.1.10", userAgent: "Vitest" },
  success: true,
  createdAt: "2026-10-23T12:00:00.000Z",
  ...overrides,
});

describe("buildAuditLogSections", () => {
  it("builds CRUD sections with their presentation metadata", () => {
    const sections = buildAuditLogSections(buildAuditLog());

    expect(sections.map(({ id }) => id)).toEqual([
      "action",
      "entity",
      "before",
      "after",
      "metadata",
    ]);

    expect(sections[0]).toMatchObject({
      label: "Action",
      tone: "success",
      badgeVariant: "emerald",
      accentClassName: "bg-success",
      data: { action: "UPDATE", result: "Succeeded" },
    });
    expect(sections[1]).toMatchObject({
      label: "Entity",
      tone: "info",
      data: { type: "customer", id: "#24" },
    });
    expect(sections[2]).toMatchObject({
      label: "Before",
      tone: "danger",
      data: { name: "Old" },
    });
    expect(sections[3]).toMatchObject({
      label: "After",
      tone: "success",
      data: { name: "New" },
    });
    expect(sections[4].data).toEqual({
      performedBy: "ana",
      actorId: "7",
      performedAt: "2026-10-23T12:00:00.000Z",
      ipAddress: "192.168.1.10",
      userAgent: "Vitest",
    });
  });

  it("marks failed actions as danger", () => {
    const [action] = buildAuditLogSections(
      buildAuditLog({ success: false }),
    );

    expect(action).toMatchObject({
      tone: "danger",
      badgeVariant: "rose",
      data: { action: "UPDATE", result: "Failed" },
    });
  });

  it("builds an error section for error payloads", () => {
    const sections = buildAuditLogSections(
      buildAuditLog({
        payload: { type: "ERROR", error: { message: "Boom" } },
      }),
    );
    const errorSection = sections.find(({ id }) => id === "error");

    expect(errorSection).toMatchObject({
      label: "Error",
      tone: "danger",
      data: { message: "Boom" },
    });
  });

  it("distinguishes authentication and verification payloads", () => {
    const authentication = buildAuditLogSections(
      buildAuditLog({
        payload: { type: "AUTHENTICATION", info: { email: "ana@gym.io" } },
      }),
    ).find(({ id }) => id === "authentication");

    const verification = buildAuditLogSections(
      buildAuditLog({
        payload: { type: "VERIFICATION", info: { channel: "email" } },
      }),
    ).find(({ id }) => id === "verification");

    expect(authentication).toMatchObject({
      label: "Authentication",
      tone: "purple",
      badgeVariant: "purple",
    });
    expect(verification).toMatchObject({
      label: "Verification",
      tone: "info",
      badgeVariant: "blue",
    });
  });

  it("falls back to a details section for unknown payloads", () => {
    const sections = buildAuditLogSections(
      buildAuditLog({
        payload: {
          type: "CUSTOM",
          info: { reason: "unsupported" },
        } as unknown as AuditLogResponse["payload"],
      }),
    );

    expect(sections.find(({ id }) => id === "details")).toMatchObject({
      label: "Details",
      tone: "neutral",
      data: { reason: "unsupported" },
    });
  });

  it("defaults missing entity ids", () => {
    const sections = buildAuditLogSections(
      buildAuditLog({
        entity: { type: "customer", entityId: { id: null } },
      }),
    );

    expect(sections.find(({ id }) => id === "entity")?.data.id).toBe(
      AUDIT_EMPTY_VALUE,
    );
  });
});
