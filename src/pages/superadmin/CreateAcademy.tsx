import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";
import StatsOverview from "../../components/dashboard/StatsOverview";
import AcademyForm from "../../components/forms/AcademyForm";

export default function CreateAcademy() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Create New Academy",
        breadcrumb: ["Dashboard", "Academies", "Create Academy"],
      })
    );
  }, [dispatch]);

  return (
    <div className="dashboard-page">
      <StatsOverview />
      <AcademyForm />
    </div>
  );
}
