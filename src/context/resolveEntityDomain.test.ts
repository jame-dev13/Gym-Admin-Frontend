import type { Domain, Entity } from "@/context/EntityDomainContext";
import { resolveEntityDomain } from "@/context/resolveEntityDomain";

type ResolutionCase = {
  pathname: string;
  entity: Entity | null;
  domain: Domain | null;
};

const cases: ResolutionCase[] = [
  { pathname: "/administration/services/users", entity: "user", domain: "services" },
  { pathname: "/administration/services/customers", entity: "customer", domain: "services" },
  {
    pathname: "/administration/services/subscriptions",
    entity: "subscription",
    domain: "services",
  },
  { pathname: "/administration/services/dumps", entity: "dump", domain: "services" },
  { pathname: "/administration/recycle/users", entity: "user", domain: "recycle" },
  { pathname: "/administration/recycle/backups", entity: "backup", domain: "recycle" },
  { pathname: "/administration/overview/subscriptions", entity: null, domain: null },
  { pathname: "/administration/overview/customers", entity: null, domain: null },
  { pathname: "/administration/overview/ratings", entity: null, domain: null },
  { pathname: "/administration/overview/billing", entity: null, domain: null },
  { pathname: "/administration/support/guide", entity: null, domain: null },
  { pathname: "/administration/support/comments", entity: null, domain: null },
  { pathname: "/administration/support/help-center", entity: null, domain: null },
  { pathname: "/administration/services/users/123", entity: "user", domain: "services" },
  { pathname: "/administration/services/users/", entity: "user", domain: "services" },
  { pathname: "/administration/services", entity: null, domain: "services" },
  { pathname: "/administration/recycle", entity: null, domain: "recycle" },
  { pathname: "/administration/services/audit-logs", entity: null, domain: "services" },
  { pathname: "/administration", entity: null, domain: null },
  { pathname: "/", entity: null, domain: null },
  { pathname: "/auth/login", entity: null, domain: null },
  { pathname: "/administration/Services/users", entity: null, domain: null },
  {
    pathname: "/administration/services/users/recycle/backups",
    entity: "user",
    domain: "services",
  },
];

describe("resolveEntityDomain", () => {
  it.each(cases)("resolves $pathname", ({ pathname, entity, domain }) => {
    expect(resolveEntityDomain(pathname)).toEqual({ entity, domain });
  });
});
