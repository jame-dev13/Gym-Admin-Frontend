import type { PropsWithChildren } from "@/components/form/FormTypes";
import { ActionContext, type Action } from "@/context/ActionContext";
import { useMemo, useState } from "react";

export const ActionProvider = ({ children }: PropsWithChildren) => {
  const [action, setAction] = useState<Action | null>(null);

  const ctxValue = useMemo(
    () => ({
      action,
      setAction,
    }),
    [action],
  );

  return (
    <ActionContext.Provider value={ctxValue}>{children}</ActionContext.Provider>
  );
};
