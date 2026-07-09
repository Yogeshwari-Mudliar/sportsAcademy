import { Navigate, useParams } from "react-router-dom";
import AcademyDetail from "@/pages/academy/AcademyDetail";
import { getCurrentUser } from "@/data/account";
import { getAcademyById } from "@/data/academies";
import { ROLES } from "@/constants/roles";
import { useAppBase } from "@/hooks/useAppBase";

export default function AcademyDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const academyId = Number(id);
  const user = getCurrentUser();
  const basePath = useAppBase();
  const academy = getAcademyById(academyId);

  if (!academy) {
    return <Navigate to={`${basePath}/academies`} replace />;
  }

  if (user?.role === ROLES.admin && user.academyId !== academy.brandId) {
    return <Navigate to={`${basePath}/academies`} replace />;
  }

  const breadcrumbRoot = user?.role === ROLES.admin ? "Admin" : "Dashboard";

  return (
    <AcademyDetail
      basePath={`${basePath}/academies`}
      listPath={`${basePath}/academies`}
      breadcrumbRoot={breadcrumbRoot}
    />
  );
}
