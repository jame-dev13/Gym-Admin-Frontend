import { getAuthRouter } from "@/features/auth/services/AuthRouter";
import { TablePreview } from "@/pages/TablePreview";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const { AuthLayout, Register, Login, Verification, PasswordReset } =
  getAuthRouter();

export const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading.....</div>}>
      <Routes>
        <Route path="/" element={<div>Lading Page</div>} />
        {/* TEMPORARY preview route — remove before merging to main. */}
        <Route path="/table-preview" element={<TablePreview />} />
        <Route path="/auth" caseSensitive>
          <Route index element={<AuthLayout />} />
          <Route path="login" element={<Login />} caseSensitive />
          <Route path="register" element={<Register />} caseSensitive />
          <Route path="verification" element={<Verification />} caseSensitive />
          <Route path="password-reset" element={<PasswordReset />} caseSensitive />
        </Route>
      </Routes>
    </Suspense>
  );
};
