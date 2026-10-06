import { createContext } from "react";

const ENTITIES = ["user", "customer", "subscription", "dump", "backup"] as const;

const DOMAINS = ["services", "recycle"] as const;

type Entity = (typeof ENTITIES)[number];

type Domain = (typeof DOMAINS)[number];

type EntityDomainContextType = {
  entity: Entity | null;
  domain: Domain | null;
};

const EntityDomainContext = createContext<EntityDomainContextType | null>(null);

export {
  DOMAINS,
  ENTITIES,
  EntityDomainContext,
  type Domain,
  type Entity,
  type EntityDomainContextType,
};
