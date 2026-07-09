import { useEffect } from "react";
import { CalendarDays, Trophy, UserCheck } from "lucide-react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";

export default function StudentDashboard() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Student Dashboard",
        breadcrumb: ["Student", "Dashboard"],
      })
    );
  }, [dispatch]);

  return (
    <div className="dashboard-page">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Upcoming Sessions", value: "4", icon: CalendarDays },
          { label: "Attendance", value: "92%", icon: UserCheck },
          { label: "Achievements", value: "6", icon: Trophy },
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
