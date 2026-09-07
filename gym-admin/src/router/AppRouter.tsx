import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

export const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading.....</div>}>
      <Routes>
        <Route path="/" element={<div>Lading Page</div>} />
        <Route path="/auth" caseSensitive>
          <Route index element={<div>Index auth page</div>}/>
          <Route path="login" element={<div>Login page</div>}/>
          <Route path="register" element={<div>Page page</div>}/>
        </Route>
      </Routes>
    </Suspense>
  );
};
