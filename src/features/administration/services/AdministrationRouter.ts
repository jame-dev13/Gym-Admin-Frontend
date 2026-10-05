import { lazy } from "react";

export const getAdministrationRouter = () => AdministrationRouter;

const AdministrationRouter = {
  Administration: lazy(
    () => import("@/features/administration/layouts/AdministrationLayout"),
  ),
  AdministrationHome: lazy(
    () => import("@/features/administration/components/AdministrationHomePage"),
  ),
};
