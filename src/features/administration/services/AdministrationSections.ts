import { LayoutDashboard } from "lucide-react";
import type { SidebarSection } from "@/types/Types";

export const ADMINISTRATION_SECTIONS: SidebarSection[] = [
  {
    label: "Resources",
    links: [{ to: "/administration", label: "Overview", Icon: LayoutDashboard }],
  },
];
