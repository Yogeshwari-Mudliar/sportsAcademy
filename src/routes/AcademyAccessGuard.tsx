import { Navigate, Outlet, useParams } from "react-router-dom";
import { getCurrentUser } from "@/data/account";
import { ROLES } from "@/constants/roles";
import { getAcademyById } from "@/data/academies";

export default function AcademyAccessGuard() {
  const { id } = useParams<{ id: string }>();
  const academyId = Number(id);
  const user = getCurrentUser();
  const academy = getAcademyById(academyId);

  if (!academy) {
    return <Navigate to="/admin/academies" replace />;
  }

  if (user?.role === ROLES.admin && user.academyId !== academyId) {
    if (user.academyId) {
      return <Navigate to={`/admin/academies/${user.academyId}/students`} replace />;
    }
    return <Navigate to="/admin/academies" replace />;
  }

  return <Outlet />;
}
