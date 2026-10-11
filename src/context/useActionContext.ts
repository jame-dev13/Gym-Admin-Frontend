import { ActionContext } from "@/context/ActionContext";
import { useContext } from "react";

const useActionContext = () => {
  const ctx = useContext(ActionContext);
  if (!ctx) throw new Error("ActionContext is required.");
  return ctx;
};

export { useActionContext };
