import { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { setPageHeader } from "@/features/ui/uiSlice";
import { getAcademyById } from "@/data/academies";

const tabs = [
  { title: "Students", path: "students" },
  { title: "Coach", path: "coaches" },
  { title: "Admin", path: "admins" },
  { title: "Accessory", path: "accessory" },
];

interface AcademyDetailProps {
  basePath: string;
  listPath: string;
  breadcrumbRoot: string;
}

export default function AcademyDetail({ basePath, listPath, breadcrumbRoot }: AcademyDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const academyId = Number(id);
  const academy = getAcademyById(academyId);

  useEffect(() => {
    if (academy) {
      dispatch(
        setPageHeader({
          title: academy.name,
          breadcrumb: [breadcrumbRoot, "Academies", academy.name],
        })
      );
    }
  }, [dispatch, academy, breadcrumbRoot]);

  if (!academy) {
    return (
      <div className="dashboard-page">
        <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-8 text-center">
          <p className="text-[var(--text-muted)]">Academy not found.</p>
          <button
            type="button"
            onClick={() => navigate(listPath)}
            className="mt-4 text-sm text-[var(--accent)] font-semibold hover:underline"
          >
            Back to Academy List
          </button>
        </div>
      </div>
    );
  }

  const currentTab = location.pathname.split("/").pop();
  const isTabPath = tabs.some((t) => t.path === currentTab);

  if (!isTabPath) {
    return <Navigate to={`${basePath}/${academyId}/students`} replace />;
  }

  return (
    <div className="dashboard-page w-full min-w-0 max-w-full">
      <button
        type="button"
        onClick={() => navigate(listPath)}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition"
      >
        <ArrowLeft size={16} />
        Back to Academy List
      </button>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img
            src={academy.logo}
            alt=""
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-gray-200 shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] truncate">
              {academy.name}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] truncate">
              {academy.city} · {academy.type} · {academy.studentCount} students
            </p>
          </div>
        </div>
        <span
          className={`self-start sm:self-auto shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
            academy.status === "Active"
              ? "bg-green-50 text-green-600 border border-green-100"
              : "bg-red-50 text-red-500 border border-red-100"
          }`}
        >
          {academy.status}
        </span>
      </div>

      <div className="bg-[var(--bg-card)] rounded-xl sm:rounded-2xl border border-[var(--border-soft)] shadow-sm overflow-hidden">
        <div className="flex items-stretch gap-1 px-2 sm:px-4 pt-3 sm:pt-4 bg-[var(--bg-panel)]/40 border-b border-[var(--border-soft)] overflow-x-auto overflow-y-hidden scrollbar-thin">
          {tabs.map((tab) => {
            const active = currentTab === tab.path;
            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => navigate(`${basePath}/${academyId}/${tab.path}`)}
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
          <Outlet context={{ academyId }} />
        </div>
      </div>
    </div>
  );
}
