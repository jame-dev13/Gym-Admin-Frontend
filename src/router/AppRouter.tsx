import { EmailInput } from "@/components/input/Input";
import { getAuthRouter } from "@/features/auth/services/AuthRouter";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const { AuthLayout, Register, Login, Verification, PasswordReset } =
  getAuthRouter();

export const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading.....</div>}>
      <Routes>
        <Route path="/" element={<div>Lading Page</div>} />
        <Route path="/auth" caseSensitive>
          <Route index element={<AuthLayout />} />
          <Route path="login" element={<Login />} caseSensitive />
          <Route path="register" element={<Register />} caseSensitive />
          <Route path="verification" element={<Verification />} caseSensitive />
          <Route path="password-reset" element={<PasswordReset />} caseSensitive />
        </Route>
        <Route
          path="/test"
          element={
            <div className="size-80">
              <EmailInput />
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};
