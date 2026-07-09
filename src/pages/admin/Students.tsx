import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";

export default function AdminStudents() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageHeader({ title: "Students", breadcrumb: ["Admin", "Students"] }));
  }, [dispatch]);

  return (
    <div className="dashboard-page">
      <section className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-card)] p-5">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Student Access</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Admin can manage academy students from this section.
        </p>
      </section>
    </div>
  );
}
