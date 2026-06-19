import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "@/pages/auth/LoginPage";
import Dashboard from "@/pages/superadmin/Dashboard";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/superadmin/dashboard"
          element={<Dashboard />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;