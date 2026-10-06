import {
  EntityDomainContext,
  type EntityDomainContextType,
} from "@/context/EntityDomainContext";
import { useContext } from "react";

const useEntityDomainContext = () => {
  const context = useContext<EntityDomainContextType | null>(
    EntityDomainContext,
  );
  if (!context) {
    throw new Error(
      "useEntityDomainContext must be used within an EntityDomainProvider",
    );
  }
  return context;
};

export { useEntityDomainContext };
