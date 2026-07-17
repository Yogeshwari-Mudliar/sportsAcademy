import { useEffect } from "react";
import { Users, GraduationCap, CalendarCheck } from "lucide-react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Admin Dashboard",
        breadcrumb: ["Admin", "Dashboard"],
      })
    );
  }, [dispatch]);

  return (
    <div className="dashboard-page">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Students", value: "128", icon: GraduationCap },
          { label: "Coaches", value: "12", icon: Users },
          { label: "Today Sessions", value: "9", icon: CalendarCheck },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <section key={item.label} className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-card)] p-5">
              <Icon size={22} className="text-[var(--accent)]" />
              <p className="mt-4 text-sm text-[var(--text-muted)]">{item.label}</p>
              <h3 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{item.value}</h3>
            </section>
          );
        })}
      </div>
    </div>
  );
}
