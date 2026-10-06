import {
  DOMAINS,
  type Domain,
  type Entity,
} from "@/context/EntityDomainContext";

const ENTITY_SEGMENTS: Record<string, Entity> = {
  users: "user",
  customers: "customer",
  subscriptions: "subscription",
  dumps: "dump",
  backups: "backup",
};

type ResolvedEntityDomain = {
  entity: Entity | null;
  domain: Domain | null;
};

const isDomainSegment = (segment: string): segment is Domain =>
  DOMAINS.some((domain) => domain === segment);

const resolveEntityDomain = (pathname: string): ResolvedEntityDomain => {
  const segments = pathname.split("/").filter((segment) => segment.length > 0);
  const domain = segments.find(isDomainSegment);
  if (!domain) {
    return { entity: null, domain: null };
  }
  const entitySegment = segments[segments.indexOf(domain) + 1] ?? "";
  const entity = ENTITY_SEGMENTS[entitySegment] ?? null;
  return { entity, domain };
};

export { ENTITY_SEGMENTS, resolveEntityDomain, type ResolvedEntityDomain };
