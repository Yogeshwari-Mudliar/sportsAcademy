import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";

const tabs = [
  { title: "Super Admin", path: "superadmin" },
  { title: "Admin", path: "admin" },
  { title: "Coach", path: "coach" },
  { title: "Student", path: "student" },
];

export default function ChangeCategories() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Manage Users",
        breadcrumb: ["Dashboard", "Manage Users", "Change Categories"],
      })
    );
  }, [dispatch]);

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-soft)] shadow-2xl overflow-hidden">
      {/* Tabs Header */}
      <div className="flex items-end px-6 pt-6 bg-[var(--bg-panel)]/40 border-b border-[var(--border-soft)]">
        {tabs.map((tab) => {
        const currentTab = location.pathname.split("/").pop();
const active = currentTab === tab.path;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`
                relative
                px-8 py-3.5
                text-[15px]
                font-semibold
                rounded-t-xl
                transition-all
                duration-300
                border-t border-x
                mr-2
                -mb-px
                cursor-pointer
                ${
                  active
                    ? "bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-soft)] border-b-transparent shadow-[0_-4px_12px_rgba(0,0,0,0.15)] z-10"
                    : "bg-transparent text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)]/20"
                }
              `}
            >
              {tab.title}
              {active && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent)] rounded-t-xl" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panel Content */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
