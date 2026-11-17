import { lazy } from "react";

export const getHomeRouter = () => HomeRouter;

const HomeRouter = {
  HomeOverview: lazy(
    () => import("@/features/home/components/HomeOverview"),
  ),
  HomePanel: lazy(() => import("@/features/home/components/HomePanel")),
};
