import { lazy } from "react";

export const getAdministrationRouter = () => AdministrationRouter;

const AdministrationRouter = {
  Administration: lazy(
    () => import("@/features/administration/layouts/AdministrationLayout"),
  ),
  AdminOverview: lazy(
    () => import("@/features/administration/components/AdminOverview"),
  ),
  AdministrationPanel: lazy(
    () => import("@/features/administration/components/AdministrationPanel"),
  ),
};
