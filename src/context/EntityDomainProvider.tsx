import { EntityDomainContext } from "@/context/EntityDomainContext";
import { resolveEntityDomain } from "@/context/resolveEntityDomain";
import type { PropsWithChildren } from "@/components/form/FormTypes";
import { useMemo, type FC } from "react";
import { useLocation } from "react-router-dom";

export const EntityDomainProvider: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();

  const contextValue = useMemo(() => {
    const { entity, domain } = resolveEntityDomain(location.pathname);
    return entity && domain ? { entity, domain } : null;
  }, [location.pathname]);

  return (
    <EntityDomainContext.Provider value={contextValue}>
      {children}
    </EntityDomainContext.Provider>
  );
};
