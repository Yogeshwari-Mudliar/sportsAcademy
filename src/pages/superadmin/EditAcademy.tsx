import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";
import AcademyForm from "../../components/forms/AcademyForm";
import { getAcademyById, updateAcademy } from "../../data/academies";
import { academyToFormData, type AcademyFormData } from "../../types/academy";

export default function EditAcademy() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const academy = useMemo(() => {
    const numId = Number(id);
    if (!Number.isFinite(numId)) return undefined;
    return getAcademyById(numId);
  }, [id]);

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: academy ? `Edit ${academy.name}` : "Edit Academy",
        breadcrumb: ["Dashboard", "Academies", "Edit Academy"],
      })
    );
  }, [dispatch, academy]);

  if (!academy) {
    return (
      <div className="dashboard-page w-full min-w-0">
        <div className="bg-white rounded-2xl border border-[var(--border-soft)] p-8 text-center">
          <p className="text-gray-500 font-medium">Academy not found.</p>
          <button
            type="button"
            onClick={() => navigate("/superadmin/academies")}
            className="mt-4 h-10 px-4 text-xs font-semibold rounded-xl bg-[var(--accent)] text-white"
          >
            Back to Academy List
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (data: AcademyFormData) => {
    updateAcademy(academy.id, data);
    navigate("/superadmin/academies");
  };

  return (
    <div className="dashboard-page w-full min-w-0">
      <AcademyForm
        mode="edit"
        initialData={academyToFormData(academy)}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/superadmin/academies")}
      />
    </div>
  );
}
