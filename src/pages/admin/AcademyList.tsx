import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { setPageHeader } from "@/features/ui/uiSlice";
import AcademyList from "@/components/superadmin/AcademyList";
import { getUserAcademyId } from "@/data/account";

export default function AdminAcademyListPage() {
  const dispatch = useAppDispatch();
  const academyId = getUserAcademyId();

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "My Academy",
        breadcrumb: ["Admin", "Academies"],
      })
    );
  }, [dispatch]);

  return (
    <div className="dashboard-page w-full min-w-0 max-w-full">
      <AcademyList
        detailBasePath="/admin/academies"
        filterAcademyIds={academyId ? [academyId] : []}
        showCreateButton={false}
      />
    </div>
  );
}
