import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";

export default function AdminSettings() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageHeader({ title: "Settings", breadcrumb: ["Admin", "Settings"] }));
  }, [dispatch]);

  return (
    <div className="dashboard-page">
      <section className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-card)] p-5">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Admin Settings</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Admin-specific settings will be available here.
        </p>
      </section>
    </div>
  );
}
