import { createContext } from "react";

const ACTIONS = ["add", "edit", "delete", "recover", "hard-delete"] as const;

type Action = (typeof ACTIONS)[number];

type ActionContextType = {
  action: Action | null;
  setAction: (action: Action | null) => void;
};

const ActionContext = createContext<ActionContextType | null>(null);

export { ACTIONS, type Action, type ActionContextType, ActionContext }