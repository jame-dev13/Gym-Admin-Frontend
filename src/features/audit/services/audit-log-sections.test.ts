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
  id: overrides.id ?? 1,
});

describe("buildAuditLogSections", () => {
  it("builds CRUD sections with a field-level change list", () => {
    const sections = buildAuditLogSections(buildAuditLog());

    expect(sections.map(({ id }) => id)).toEqual([
      "action",
      "entity",
      "changes",
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
      label: "Changes",
      tone: "purple",
      badgeVariant: "purple",
      changes: [
        {
          field: "name",
          label: "Name",
          before: "Old",
          after: "New",
          kind: "changed",
        },
      ],
    });
    expect(sections[3].data).toEqual({
      performedBy: "ana",
      actorId: "7",
      performedAt: "2026-10-23T12:00:00.000Z",
      ipAddress: "192.168.1.10",
      userAgent: "Vitest",
    });
  });

  it("classifies added, removed, changed, and unchanged fields", () => {
    const sections = buildAuditLogSections(
      buildAuditLog({
        payload: {
          type: "CRUD",
          before: {
            name: "Old",
            email: "ana@gym.io",
            role: "USER",
            deleted: "yes",
          },
          after: {
            name: "New",
            email: "ana@gym.io",
            role: "ADMIN",
            created: "today",
          },
        },
      }),
    );
    const changes = sections.find(({ id }) => id === "changes")?.changes;

    expect(changes).toEqual([
      {
        field: "name",
        label: "Name",
        before: "Old",
        after: "New",
        kind: "changed",
      },
      {
        field: "role",
        label: "Role",
        before: "USER",
        after: "ADMIN",
        kind: "changed",
      },
      {
        field: "created",
        label: "Created",
        before: AUDIT_EMPTY_VALUE,
        after: "today",
        kind: "added",
      },
      {
        field: "deleted",
        label: "Deleted",
        before: "yes",
        after: AUDIT_EMPTY_VALUE,
        kind: "removed",
      },
      {
        field: "email",
        label: "Email",
        before: "ana@gym.io",
        after: "ana@gym.io",
        kind: "unchanged",
      },
    ]);
  });

  it("normalizes nested CRUD values before diffing", () => {
    const sections = buildAuditLogSections(
      buildAuditLog({
        payload: {
          type: "CRUD",
          before: { profile: { city: "Madrid" } },
          after: { profile: { city: "Barcelona" } },
        },
      }),
    );
    const changes = sections.find(({ id }) => id === "changes")?.changes;

    expect(changes).toEqual([
      {
        field: "profile",
        label: "Profile",
        before: "city: Madrid",
        after: "city: Barcelona",
        kind: "changed",
      },
    ]);
  });

  it("returns an empty change list when CRUD payload maps are missing", () => {
    const sections = buildAuditLogSections(
      buildAuditLog({
        payload: { type: "CRUD" } as unknown as AuditLogResponse["payload"],
      }),
    );

    expect(sections.find(({ id }) => id === "changes")?.changes).toEqual([]);
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
