import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";
import AcademyList from "../../components/superadmin/AcademyList";
import { getCurrentUser } from "@/data/account";
import { ROLES } from "@/constants/roles";
import { useAppBase } from "@/hooks/useAppBase";
import { hasPermission } from "@/data/permissions";

export default function AcademyListPage() {
  const dispatch = useAppDispatch();
  const user = getCurrentUser();
  const basePath = useAppBase();
  const isAdmin = user?.role === ROLES.admin;

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: isAdmin ? "My Academy" : "Academy List",
        breadcrumb: ["Dashboard", "Academies", isAdmin ? "My Academy" : "Academy List"],
      })
    );
  }, [dispatch, isAdmin]);

  return (
    <div className="dashboard-page w-full min-w-0 max-w-full">
      <AcademyList
        detailBasePath={`${basePath}/academies`}
        filterByBrandId={isAdmin && user?.academyId ? user.academyId : undefined}
        showCreateButton={!isAdmin}
        showAddLocationButton={
          isAdmin && !!user && hasPermission(user.role, "createLocation")
        }
        addLocationPath={`${basePath}/academies/add-location`}
      />
    </div>
  );
}
