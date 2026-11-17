import { getAdministrationRouter } from "@/features/administration/services/AdministrationRouter";
import { administrationPanelRoutes } from "@/features/administration/services/AdministrationPanels";
import { getAuthRouter } from "@/features/auth/services/AuthRouter";
import { getLandingRouter } from "@/features/landing-page/services/LandingRouter";
import { homePanelRoutes } from "@/features/home/services/HomePanels";
import { getHomeRouter } from "@/features/home/services/HomeRouter";
import { EntityDomainProvider } from "@/context/EntityDomainProvider";
import { PageSkeleton } from "@/components/skeleton";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { HomeLayout } from "@/features/home/layouts/HomeLayout";

const NotFoundPage = lazy(() => import("@/pages/404Page"));
const WelcomePage = lazy(() => import("@/pages/Welcome"));

const {
  AuthLayout,
  Register,
  Login,
  Verification,
  PasswordReset,
  SetPassword,
  Recovery,
} = getAuthRouter();
const { Landing } = getLandingRouter();
const { Administration, AdminOverview, AdministrationPanel } =
  getAdministrationRouter();
const { HomeOverview, HomePanel } = getHomeRouter();

export const AppRouter = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<HomeLayout />} caseSensitive>
          <Route index element={<HomeOverview />} />
          {homePanelRoutes.map(({ path, title, description, Element }) => (
            <Route
              key={path}
              path={path}
              element={
                Element ? (
                  <Element />
                ) : (
                  <HomePanel title={title} description={description} />
                )
              }
              caseSensitive
            />
          ))}
        </Route>
        <Route path="/welcome" element={<WelcomePage />} caseSensitive />
        <Route
          path="/administration"
          element={
            <EntityDomainProvider>
              <Administration />
            </EntityDomainProvider>
          }
          caseSensitive
        >
          <Route index element={<AdminOverview />} />
          {administrationPanelRoutes.map(
            ({ path, title, description, Element }) => (
              <Route
                key={path}
                path={path}
                element={
                  Element ? (
                    <Element />
                  ) : (
                    <AdministrationPanel
                      title={title}
                      description={description}
                    />
                  )
                }
                caseSensitive
              />
            ),
          )}
        </Route>
        <Route path="/auth" caseSensitive>
          <Route index element={<AuthLayout />} />
          <Route path="login" element={<Login />} caseSensitive />
          <Route path="register" element={<Register />} caseSensitive />
          <Route path="verification" element={<Verification />} caseSensitive />
          <Route
            path="password-reset"
            element={<PasswordReset />}
            caseSensitive
          />
          <Route path="set-password" element={<SetPassword />} caseSensitive />
          <Route path="recover" element={<Recovery />} caseSensitive />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
