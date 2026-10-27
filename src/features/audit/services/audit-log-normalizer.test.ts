// @vitest-environment node
// Pure unit tests: no DOM or API access.
import type { AuditLogResponse } from "@/features/audit/types";
import {
  AUDIT_EMPTY_VALUE,
  extractChanges,
  formatAuditFieldLabel,
  formatAuditValue,
  formatIdentifier,
  getAuditLogKey,
  mapAuditLogMetadata,
  normalizeRecord,
} from "@/features/audit/services/audit-log-normalizer";

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

describe("formatAuditValue", () => {
  it("replaces nullish values with the empty placeholder", () => {
    expect(formatAuditValue(null)).toBe(AUDIT_EMPTY_VALUE);
    expect(formatAuditValue(undefined)).toBe(AUDIT_EMPTY_VALUE);
  });

  it("formats primitive arrays as a comma-separated list", () => {
    expect(formatAuditValue(["MONTHLY", 12, true])).toBe("MONTHLY, 12, true");
  });

  it("formats period arrays one item per line", () => {
    expect(
      formatAuditValue([
        { periodType: "MONTH", periodStr: "October" },
        { periodType: "WEEK", periodStr: "First" },
      ]),
    ).toBe("MONTH: October\nWEEK: First");
  });

  it("formats nested objects and arrays of objects", () => {
    expect(
      formatAuditValue({
        name: "ana",
        address: { city: "Mexico City", zip: null },
      }),
    ).toBe(`name: ana\naddress: city: Mexico City\nzip: ${AUDIT_EMPTY_VALUE}`);

    expect(formatAuditValue([{ id: 1 }, { id: 2 }])).toBe("id: 1\nid: 2");
  });

  it("uses the empty placeholder for empty collections", () => {
    expect(formatAuditValue([])).toBe(AUDIT_EMPTY_VALUE);
    expect(formatAuditValue({})).toBe(AUDIT_EMPTY_VALUE);
  });
});

describe("formatIdentifier", () => {
  it("extracts the id from Identifiable values and accepts scalar ids", () => {
    expect(formatIdentifier({ id: 24 })).toBe("24");
    expect(formatIdentifier(24)).toBe("24");
    expect(formatIdentifier({ id: null })).toBe(AUDIT_EMPTY_VALUE);
    expect(formatIdentifier(null)).toBe(AUDIT_EMPTY_VALUE);
  });
});

describe("formatAuditFieldLabel", () => {
  it("humanizes camelCase, snake_case, and kebab-case keys", () => {
    expect(formatAuditFieldLabel("performedBy")).toBe("Performed by");
    expect(formatAuditFieldLabel("user_agent")).toBe("User agent");
    expect(formatAuditFieldLabel("ip-address")).toBe("Ip address");
  });

  it("keeps known acronyms readable", () => {
    expect(formatAuditFieldLabel("id")).toBe("ID");
    expect(formatAuditFieldLabel("userId")).toBe("User ID");
    expect(formatAuditFieldLabel("ipAddress")).toBe("IP address");
  });
});

describe("getAuditLogKey", () => {
  it("builds a stable composite key without a top-level id", () => {
    expect(getAuditLogKey(buildAuditLog())).toBe(
      "2026-10-23T12:00:00.000Z|UPDATE|CRUD|customer|24|7",
    );
  });
});

describe("normalizeRecord", () => {
  it("normalizes every entry and preserves the original keys", () => {
    expect(
      normalizeRecord({
        name: "ana",
        age: null,
        tags: ["admin", "staff"],
        settings: { active: true },
      }),
    ).toEqual({
      name: "ana",
      age: AUDIT_EMPTY_VALUE,
      tags: "admin, staff",
      settings: "active: true",
    });
  });

  it("returns an empty record for non-object values", () => {
    expect(normalizeRecord(null)).toEqual({});
    expect(normalizeRecord("not-a-record")).toEqual({});
    expect(normalizeRecord([1, 2])).toEqual({});
  });
});

describe("extractChanges", () => {
  it("normalizes CRUD before and after records", () => {
    expect(
      extractChanges({
        type: "CRUD",
        before: { email: null, role: "USER" },
        after: { email: "ana@gym.io", role: "ADMIN" },
      }),
    ).toEqual({
      type: "CRUD",
      before: { email: AUDIT_EMPTY_VALUE, role: "USER" },
      after: { email: "ana@gym.io", role: "ADMIN" },
    });
  });

  it("normalizes error payloads", () => {
    expect(
      extractChanges({
        type: "ERROR",
        error: { message: "Boom", details: null },
      }),
    ).toEqual({
      type: "ERROR",
      error: { message: "Boom", details: AUDIT_EMPTY_VALUE },
    });
  });

  it.each(["AUTHENTICATION", "VERIFICATION"] as const)(
    "normalizes %s info payloads",
    (type) => {
      expect(
        extractChanges({ type, info: { email: "ana@gym.io", code: null } }),
      ).toEqual({
        type,
        info: { email: "ana@gym.io", code: AUDIT_EMPTY_VALUE },
      });
    },
  );

  it("falls back to an unknown section for missing or unrecognized payloads", () => {
    expect(extractChanges(undefined)).toEqual({ type: "UNKNOWN", info: {} });
    expect(
      extractChanges({ type: "CUSTOM", info: { reason: null } }),
    ).toEqual({
      type: "UNKNOWN",
      info: { reason: AUDIT_EMPTY_VALUE },
    });
  });
});

describe("mapAuditLogMetadata", () => {
  it("maps the audit log metadata to display-ready values", () => {
    expect(mapAuditLogMetadata(buildAuditLog())).toEqual({
      performedBy: "ana",
      actorId: "7",
      performedAt: "2026-10-23T12:00:00.000Z",
      ipAddress: "192.168.1.10",
      userAgent: "Vitest",
    });
  });

  it("provides defaults when the nested values are missing", () => {
    const data = {
      ...buildAuditLog(),
      actor: { userId: { id: null }, username: null },
      metadata: { ip: null, userAgent: undefined },
    } as unknown as AuditLogResponse;

    expect(mapAuditLogMetadata(data)).toEqual({
      performedBy: AUDIT_EMPTY_VALUE,
      actorId: AUDIT_EMPTY_VALUE,
      performedAt: "2026-10-23T12:00:00.000Z",
      ipAddress: AUDIT_EMPTY_VALUE,
      userAgent: AUDIT_EMPTY_VALUE,
    });
  });
});
