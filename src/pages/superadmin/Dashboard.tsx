import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";
import StatsOverview from "../../components/dashboard/StatsOverview";
import { getCurrentUser } from "@/data/account";
import { getAcademies, getAcademiesByBrandId, getLocationIdsByBrandId, updateAcademyStatus } from "@/data/academies";
import { getMembersForScope } from "@/data/academyMembers";
import { ROLES } from "@/constants/roles";
import { useAppBase } from "@/hooks/useAppBase";
import { useCanManageTables } from "@/hooks/useCanManageTables";
import TableRowActions from "@/components/table/TableRowActions";
import TablePagination from "@/components/table/TablePagination";
import StatusDot from "@/components/table/StatusDot";
import AcademyViewModal from "@/components/superadmin/AcademyViewModal";
import AcademyEditModal from "@/components/superadmin/AcademyEditModal";
import type { AcademyListItem } from "@/types/academy";
import {
  MapPin,
  ChevronDown,
  ArrowUpRight,
  GraduationCap,
  Users,
  CreditCard,
  BadgeDollarSign,
} from "lucide-react";
import "../../styles/superadmin/dashboard.css";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const user = getCurrentUser();
  const basePath = useAppBase();
  const isAdmin = user?.role === ROLES.admin;
  const canManage = useCanManageTables();
  const [viewing, setViewing] = useState<AcademyListItem | null>(null);
  const [editing, setEditing] = useState<AcademyListItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [academyList, setAcademyList] = useState<AcademyListItem[]>(() =>
    isAdmin && user?.academyId ? getAcademiesByBrandId(user.academyId) : getAcademies()
  );

  const academies = useMemo(() => {
    if (isAdmin && user?.academyId) {
      return getAcademiesByBrandId(user.academyId);
    }
    return getAcademies();
  }, [isAdmin, user?.academyId, academyList]);

  const coachCount = getMembersForScope("coach", {
    allowedAcademyIds: isAdmin && user?.academyId ? getLocationIdsByBrandId(user.academyId) : undefined,
  }).length;

  const studentCount = getMembersForScope("student", {
    allowedAcademyIds: isAdmin && user?.academyId ? getLocationIdsByBrandId(user.academyId) : undefined,
  }).length;

  const recentAcademies = academies;
  const totalPages = Math.max(1, Math.ceil(recentAcademies.length / pageSize));
  const paginatedAcademies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return recentAcademies.slice(start, start + pageSize);
  }, [recentAcademies, currentPage, pageSize]);

  const bottomWidgets = [
    {
      title: isAdmin ? "Academy Coaches" : "Total Coaches",
      value: String(coachCount),
      change: "9.3%",
      icon: <GraduationCap size={20} />,
      color: "orange",
    },
    {
      title: isAdmin ? "Academy Students" : "Active Students",
      value: String(studentCount),
      change: "13.2%",
      icon: <Users size={20} />,
      color: "blue",
    },
    {
      title: "Total Payments",
      value: isAdmin ? "186" : "2,856",
      change: "11.5%",
      icon: <CreditCard size={20} />,
      color: "purple",
    },
    {
      title: "Subscriptions",
      value: isAdmin ? "42" : "1,024",
      change: "7.8%",
      icon: <BadgeDollarSign size={20} />,
      color: "green",
    },
  ];

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Dashboard",
        breadcrumb: ["Dashboard"],
      })
    );
  }, [dispatch]);

  return (
    <div className="dashboard-page space-y-4 sm:space-y-6 w-full min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {bottomWidgets.map((widget) => (
          <div
            key={widget.title}
            className="bg-white rounded-2xl border border-[var(--border-soft)] p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  widget.color === "orange"
                    ? "bg-orange-50 text-orange-600"
                    : widget.color === "blue"
                    ? "bg-blue-50 text-blue-600"
                    : widget.color === "purple"
                    ? "bg-purple-50 text-purple-600"
                    : "bg-green-50 text-green-600"
                }`}
              >
                {widget.icon}
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  {widget.title}
                </span>
                <span className="text-lg font-bold text-[var(--text-primary)] mt-0.5 block">
                  {widget.value}
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-green-500">↑ {widget.change}</span>
          </div>
        ))}
      </div>

      <StatsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--border-soft)] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {isAdmin ? "My Academy" : "Recent Academies"}
              </h3>
              <Link
                to={`${basePath}/academies`}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 text-[var(--text-muted)] transition"
              >
                View All
              </Link>
            </div>

            <div className="w-full overflow-hidden">
              <table className="w-full table-fixed text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 w-[45%]">Academy Name</th>
                    <th className="pb-3 w-[25%]">Location</th>
                    <th className="pb-3 w-[15%]">Students</th>
                    {canManage && <th className="pb-3 w-[15%] text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {paginatedAcademies.map((academy) => (
                    <tr key={academy.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3.5 overflow-hidden pr-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={academy.logo}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                          />
                          <span
                            className="font-semibold text-[var(--text-primary)] truncate min-w-0"
                            title={academy.name}
                          >
                            {academy.name}
                          </span>
                          <StatusDot status={academy.status} className="shrink-0" />
                        </div>
                      </td>
                      <td className="py-3.5 text-gray-500 overflow-hidden pr-2">
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin size={14} className="text-gray-400 shrink-0" />
                          <span className="truncate">{academy.city}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-gray-500">{academy.studentCount}</td>
                      {canManage && (
                        <td className="py-3.5 text-center">
                          <TableRowActions
                            onView={() => setViewing(academy)}
                            onEdit={() => setEditing(academy)}
                            onToggleStatus={() => {
                              const next = academy.status === "Active" ? "Inactive" : "Active";
                              const label = next === "Active" ? "activate" : "deactivate";
                              if (!window.confirm(`Are you sure you want to ${label} this academy?`)) return;
                              setAcademyList(updateAcademyStatus(academy.id, next));
                            }}
                            isActive={academy.status === "Active"}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={recentAcademies.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            label="academies"
          />
        </div>

        <div className="bg-white rounded-2xl border border-[var(--border-soft)] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Revenue Analytics</h3>
              <button className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition flex items-center gap-1.5">
                This Month <ChevronDown size={14} />
              </button>
            </div>

            <div className="mb-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Revenue
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <h4 className="text-2xl font-bold text-[var(--text-primary)]">
                  {isAdmin ? "₹4.2 L" : "₹48.75 L"}
                </h4>
                <span className="text-xs font-bold text-green-500 flex items-center">
                  <ArrowUpRight size={14} /> 18.6%
                </span>
                <span className="text-[11px] text-gray-400 font-medium">vs last month</span>
              </div>
            </div>

            <div className="relative w-full h-44 mt-6">
              <svg viewBox="0 0 500 180" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="55" x2="480" y2="55" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="90" x2="480" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="125" x2="480" y2="125" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="150" x2="480" y2="150" stroke="#f1f5f9" strokeWidth="1.5" />
                <text x="30" y="24" fill="#94a3b8" fontSize="10" textAnchor="end">
                  ₹20L
                </text>
                <text x="30" y="59" fill="#94a3b8" fontSize="10" textAnchor="end">
                  ₹15L
                </text>
                <text x="30" y="94" fill="#94a3b8" fontSize="10" textAnchor="end">
                  ₹10L
                </text>
                <text x="30" y="129" fill="#94a3b8" fontSize="10" textAnchor="end">
                  ₹5L
                </text>
                <text x="30" y="154" fill="#94a3b8" fontSize="10" textAnchor="end">
                  ₹0
                </text>
                <path
                  d="M 50 142 C 100 135, 120 105, 140 108 C 160 110, 200 120, 220 100 C 240 80, 270 85, 300 70 C 330 55, 380 65, 410 40 C 440 15, 460 30, 480 20 L 480 150 L 50 150 Z"
                  fill="url(#chart-area-grad)"
                />
                <path
                  d="M 50 142 C 100 135, 120 105, 140 108 C 160 110, 200 120, 220 100 C 240 80, 270 85, 300 70 C 330 55, 380 65, 410 40 C 440 15, 460 30, 480 20"
                  stroke="#ff6b00"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="142" r="4.5" fill="#ff6b00" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="140" cy="108" r="4.5" fill="#ff6b00" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="220" cy="100" r="4.5" fill="#ff6b00" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="300" cy="70" r="4.5" fill="#ff6b00" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="410" cy="40" r="4.5" fill="#ff6b00" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="480" cy="20" r="4.5" fill="#ff6b00" stroke="#ffffff" strokeWidth="2.5" />
                <text x="50" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">
                  1 Jun
                </text>
                <text x="140" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">
                  7 Jun
                </text>
                <text x="220" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">
                  14 Jun
                </text>
                <text x="300" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">
                  21 Jun
                </text>
                <text x="410" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">
                  28 Jun
                </text>
                <text x="480" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">
                  30 Jun
                </text>
                <defs>
                  <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b00" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#ff6b00" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {viewing && (
        <AcademyViewModal
          academy={viewing}
          onClose={() => setViewing(null)}
          onEdit={(id) => {
            const academy = academyList.find((a) => a.id === id) ?? academies.find((a) => a.id === id);
            if (academy) {
              setViewing(null);
              setEditing(academy);
            }
          }}
        />
      )}

      {editing && (
        <AcademyEditModal
          academy={editing}
          onClose={() => setEditing(null)}
          onSaved={() => setAcademyList(getAcademies())}
        />
      )}
    </div>
  );
}
