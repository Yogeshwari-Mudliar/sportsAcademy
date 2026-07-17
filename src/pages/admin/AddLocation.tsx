import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { setPageHeader } from "@/features/ui/uiSlice";
import AcademyForm from "@/components/forms/AcademyForm";
import { createAcademyLocation, getBrandById } from "@/data/academies";
import { getCurrentUser } from "@/data/account";
import { EMPTY_ACADEMY_FORM, type AcademyFormData } from "@/types/academy";
import { useAppBase } from "@/hooks/useAppBase";

export default function AddLocationPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const basePath = useAppBase();
  const user = getCurrentUser();
  const brandId = user?.academyId;
  const brand = brandId ? getBrandById(brandId) : undefined;

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Add Location",
        breadcrumb: ["Dashboard", "Academies", "Add Location"],
      })
    );
  }, [dispatch]);

  if (!brandId || !brand) {
    return (
      <div className="dashboard-page">
        <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-8 text-center">
          <p className="text-[var(--text-muted)]">No academy brand assigned to your account.</p>
        </div>
      </div>
    );
  }

  const initialData: AcademyFormData = {
    ...EMPTY_ACADEMY_FORM,
    name: brand.name,
    ownerName: brand.ownerName,
    email: brand.email,
    phone: brand.phone,
    academyType: brand.type,
    establishedYear: brand.establishedYear,
    facilities: brand.facilities,
  };

  const handleSubmit = (data: AcademyFormData) => {
    const result = createAcademyLocation(brandId, data);
    if ("error" in result) {
      alert(result.error);
      return;
    }
    navigate(`${basePath}/academies`);
  };

  return (
    <div className="dashboard-page">
      <div className="mb-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4">
        <h3 className="text-base font-bold text-[var(--text-primary)]">{brand.name}</h3>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Add a new branch/location under your academy brand. Existing locations will remain in My
          Academy list.
        </p>
      </div>
      <AcademyForm
        mode="create"
        initialData={initialData}
        lockedFields={["name", "ownerName", "email", "phone"]}
        submitLabel="Add Location"
        onSubmit={handleSubmit}
        onCancel={() => navigate(`${basePath}/academies`)}
      />
    </div>
  );
}
