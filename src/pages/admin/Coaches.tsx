import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";

export default function AdminCoaches() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageHeader({ title: "Coaches", breadcrumb: ["Admin", "Coaches"] }));
  }, [dispatch]);

  return (
    <div className="dashboard-page">
      <section className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-card)] p-5">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Coach Access</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Admin can view and manage coach records from this section.
        </p>
      </section>
    </div>
  );
}
