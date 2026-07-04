import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "@/pages/auth/LoginPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/superadmin/Dashboard";
import CreateAcademy from "@/pages/superadmin/CreateAcademy";
import Settings from "@/pages/superadmin/Settings";
import NotFound from "@/pages/NotFound";
import ChangeCategories from "@/pages/superadmin/ChangeCategories";
import Admin from "@/pages/superadmin/Admin";
import Coach from "@/pages/superadmin/Coach";
import Student from "@/pages/superadmin/Student";
import ManageUsers from "@/pages/superadmin/ManageUsers";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/superadmin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ManageUsers" element={<ManageUsers />} />
          <Route path="academies/create" element={<CreateAcademy />} />
          <Route path="settings" element={<Settings />} />
          <Route path="ChangeCategories" element={<ChangeCategories />}>
            <Route index element={<Navigate to="admin" replace />} />
            <Route path="admin" element={<Admin />} />
            <Route path="coach" element={<Coach />} />
            <Route path="student" element={<Student />} />
          </Route>

        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
