import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";
import StatsOverview from "../../components/dashboard/StatsOverview";
import AcademyForm from "../../components/forms/AcademyForm";
import { createAcademy } from "../../data/academies";
import type { AcademyFormData } from "../../types/academy";

export default function CreateAcademy() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Create New Academy",
        breadcrumb: ["Dashboard", "Academies", "Create Academy"],
      })
    );
  }, [dispatch]);

  const handleSubmit = (data: AcademyFormData) => {
    createAcademy(data);
    navigate("/superadmin/academies");
  };

  return (
    <div className="dashboard-page">
      <StatsOverview />
      <AcademyForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/superadmin/academies")}
      />
    </div>
  );
}
