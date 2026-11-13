import { getAdministrationRouter } from "@/features/administration/services/AdministrationRouter";
import { administrationPanelRoutes } from "@/features/administration/services/AdministrationPanels";
import { getAuthRouter } from "@/features/auth/services/AuthRouter";
import { getLandingRouter } from "@/features/landing-page/services/LandingRouter";
import { EntityDomainProvider } from "@/context/EntityDomainProvider";
import { PageSkeleton } from "@/components/skeleton";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const NotFoundPage = lazy(() => import("@/pages/404Page"));

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

export const AppRouter = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<Landing />} />
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
        <Route
          path="/current"
          element={
            <>
              <button
                className={
                  "flex gap-x-3 w-fit items-center rounded border border-border-emphasis px-3 py-2 bg-surface-secondary-raised cursor-pointer"
                }
              >
                <span className={"flex items-center size-7 rounded-full bg-indigo-700 p-2"}>A</span>
                <div
                  className={"grid max-w-32 overflow-x-hidden"}
                >
                  <p
                    className={"text-start truncate text-text-primary text-sm"}
                    title="Angel Maciel"
                  >
                    Jose Angel Maciel Estrada
                  </p>
                  <p
                    className={"text-start truncate text-text-secondary text-sm"}
                    title="angel@mail.com"
                  >
                    angel@mail.com
                  </p>
                </div>
              </button>
            </>
          }
        />
      </Routes>
    </Suspense>
  );
};
