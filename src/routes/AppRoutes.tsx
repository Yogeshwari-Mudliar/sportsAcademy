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
import SuperAdmin from "@/pages/superadmin/SuperAdmin";
import ManageUsers from "@/pages/superadmin/ManageUsers";
import AcademyListPage from "@/pages/superadmin/AcademyList";
import EditAcademy from "@/pages/superadmin/EditAcademy";
import ChangeEmail from "@/pages/superadmin/ChangeEmail";
import ChangePassword from "@/pages/superadmin/ChangePassword";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminStudents from "@/pages/admin/Students";
import AdminCoaches from "@/pages/admin/Coaches";
import AdminSettings from "@/pages/admin/Settings";
import CoachDashboard from "@/pages/coach/Dashboard";
import StudentDashboard from "@/pages/student/Dashboard";
import RoleGuard from "./RoleGuard";
import PermissionGuard from "./PermissionGuard";
import { ROLES } from "@/constants/roles";
import RolesPermissions from "@/pages/superadmin/RolesPermissions";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<RoleGuard allowedRoles={[ROLES.superadmin]} />}>
          <Route path="/superadmin" element={<DashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route element={<PermissionGuard permission="dashboard" />}>
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<PermissionGuard permission="manageUsers" />}>
              <Route path="ManageUsers" element={<ManageUsers />} />
            </Route>
            <Route element={<PermissionGuard permission="academies" />}>
              <Route path="academies" element={<AcademyListPage />} />
            </Route>
            <Route element={<PermissionGuard permission="createAcademy" />}>
              <Route path="academies/create" element={<CreateAcademy />} />
              <Route path="academies/:id/edit" element={<EditAcademy />} />
            </Route>
            <Route element={<PermissionGuard permission="settings" />}>
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="change-email" element={<ChangeEmail />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route element={<PermissionGuard permission="rolesPermissions" />}>
              <Route path="roles" element={<RolesPermissions />} />
            </Route>
            <Route element={<PermissionGuard permission="changeCategories" />}>
              <Route path="ChangeCategories" element={<ChangeCategories />}>
                <Route index element={<Navigate to="superadmin" replace />} />
                <Route path="superadmin" element={<SuperAdmin />} />
                <Route path="admin" element={<Admin />} />
                <Route path="coach" element={<Coach />} />
                <Route path="student" element={<Student />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route element={<RoleGuard allowedRoles={[ROLES.admin]} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route element={<PermissionGuard permission="dashboard" />}>
              <Route path="dashboard" element={<AdminDashboard />} />
            </Route>
            <Route element={<PermissionGuard permission="students" />}>
              <Route path="students" element={<AdminStudents />} />
            </Route>
            <Route element={<PermissionGuard permission="coaches" />}>
              <Route path="coaches" element={<AdminCoaches />} />
            </Route>
            <Route element={<PermissionGuard permission="settings" />}>
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="change-email" element={<ChangeEmail />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        <Route element={<RoleGuard allowedRoles={[ROLES.coach]} />}>
          <Route path="/coach" element={<DashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route element={<PermissionGuard permission="dashboard" />}>
              <Route path="dashboard" element={<CoachDashboard />} />
            </Route>
            <Route path="change-email" element={<ChangeEmail />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        <Route element={<RoleGuard allowedRoles={[ROLES.student]} />}>
          <Route path="/student" element={<DashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route element={<PermissionGuard permission="dashboard" />}>
              <Route path="dashboard" element={<StudentDashboard />} />
            </Route>
            <Route path="change-email" element={<ChangeEmail />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
