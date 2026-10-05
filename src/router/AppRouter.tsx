import { getAdministrationRouter } from "@/features/administration/services/AdministrationRouter";
import { administrationPanelRoutes } from "@/features/administration/services/AdministrationPanels";
import { getAuthRouter } from "@/features/auth/services/AuthRouter";
import { getLandingRouter } from "@/features/landing-page/services/LandingRouter";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const { AuthLayout, Register, Login, Verification, PasswordReset, SetPassword, Recovery } =
  getAuthRouter();
const { Landing } = getLandingRouter();
const { Administration, AdminOverview, AdministrationPanel } = getAdministrationRouter();

export const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading.....</div>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/administration" element={<Administration />} caseSensitive>
          <Route index element={<AdminOverview />} />
          {administrationPanelRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <AdministrationPanel
                  title={route.title}
                  description={route.description}
                />
              }
              caseSensitive
            />
          ))}
        </Route>
        <Route path="/auth" caseSensitive>
          <Route index element={<AuthLayout />} />
          <Route path="login" element={<Login />} caseSensitive />
          <Route path="register" element={<Register />} caseSensitive />
          <Route path="verification" element={<Verification />} caseSensitive />
          <Route path="password-reset" element={<PasswordReset />} caseSensitive />
          <Route path="set-password" element={<SetPassword />} caseSensitive />
          <Route path="recover" element={<Recovery />} caseSensitive />
        </Route>
      </Routes>
    </Suspense>
  );
};
