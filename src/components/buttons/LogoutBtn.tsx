import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { authClient } from "@/services/api/api.instance";
import type { LogoutBtnProps } from "./ButtonTypes";

const LOGOUT_PATH = import.meta.env.VITE_AUTH_LOGOUT as string;

const cleanUp = () => {
  localStorage.clear();
  sessionStorage.clear();
};

const logoutBtnStyles = [
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-2",
  "rounded-lg",
  "border",
  "border-transparent",
  "px-3",
  "py-2",
  "text-sm",
  "font-medium",
  "text-text-secondary",
  "transition-colors",
  "duration-200",
  "hover:border-danger/40",
  "hover:bg-danger/10",
  "hover:text-danger",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-accent",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
].join(" ");

export const LogoutBtn = ({ className = "" }: LogoutBtnProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await authClient.post(LOGOUT_PATH);
    } finally {
      cleanUp();
      window.location.assign("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="Log out"
      aria-busy={isPending}
      disabled={isPending}
      className={`${logoutBtnStyles} ${className}`}
    >
      {isPending ? (
        <Loader2 size={18} aria-hidden="true" className="animate-spin" />
      ) : (
        <LogOut size={18} aria-hidden="true" />
      )}
      <span>{isPending ? "Logging out…" : "Log out"}</span>
    </button>
  );
};
