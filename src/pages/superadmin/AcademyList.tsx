import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";
import AcademyList from "../../components/superadmin/AcademyList";

export default function AcademyListPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Academy List",
        breadcrumb: ["Dashboard", "Academies", "Academy List"],
      })
    );
  }, [dispatch]);

  return (
    <div className="dashboard-page w-full min-w-0 max-w-full">
      <AcademyList />
    </div>
  );
}
