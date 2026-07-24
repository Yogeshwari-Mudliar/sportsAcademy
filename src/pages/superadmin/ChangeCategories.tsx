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
    <div className="bg-[var(--bg-card)] rounded-xl sm:rounded-2xl border border-[var(--border-soft)] shadow-sm overflow-hidden w-full min-w-0">
      <div className="flex items-stretch gap-1 px-2 sm:px-4 pt-3 sm:pt-4 bg-[var(--bg-panel)]/40 border-b border-[var(--border-soft)] overflow-x-auto overflow-y-hidden">
        {tabs.map((tab) => {
          const currentTab = location.pathname.split("/").pop();
          const active = currentTab === tab.path;

          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              className={`
                relative shrink-0
                px-4 sm:px-6 py-2.5 sm:py-3
                text-sm sm:text-[15px]
                font-semibold
                rounded-t-xl
                transition-all duration-200
                border-t border-x
                -mb-px
                cursor-pointer
                whitespace-nowrap
                ${
                  active
                    ? "bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-soft)] border-b-transparent z-10"
                    : "bg-transparent text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]"
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

      <div className="p-3 sm:p-4 md:p-6 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
