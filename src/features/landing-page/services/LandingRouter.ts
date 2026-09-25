import { lazy } from "react";

export const getLandingRouter = () => LandingRouter;

const LandingRouter = {
  Landing: lazy(() => import("@/features/landing-page/layouts/LandingLayout")),
};
