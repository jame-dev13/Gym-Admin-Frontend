import { Outlet, useOutlet } from "react-router-dom";
import LandingPage from "@/features/landing-page/components/LandingPage";

const LandingLayout = () => {
  const outlet = useOutlet();
  if (outlet) {
    return <Outlet />;
  }
  return <LandingPage />;
};

export default LandingLayout;
