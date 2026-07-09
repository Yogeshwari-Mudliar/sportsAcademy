import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { setPageHeader } from "@/features/ui/uiSlice";
import { getCurrentUser } from "@/data/account";
import { ROLES } from "@/constants/roles";
import { getAcademyById, getLocationIdsByBrandId } from "@/data/academies";
import {
  getMembersForScope,
  type AcademyMember,
  type AcademyMemberRole,
} from "@/data/academyMembers";

const statusStyles: Record<AcademyMember["status"], string> = {
  Active: "bg-green-50 text-green-600 border border-green-100",
  Inactive: "bg-red-50 text-red-500 border border-red-100",
  Pending: "bg-orange-50 text-orange-600 border border-orange-100",
};

interface MembersListPageProps {
  memberRole: Extract<AcademyMemberRole, "coach" | "student">;
  title: string;
}

export default function MembersListPage({ memberRole, title }: MembersListPageProps) {
  const dispatch = useAppDispatch();
  const user = getCurrentUser();
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const allowedAcademyIds = useMemo(() => {
    if (user?.role === ROLES.admin && user.academyId) {
      return getLocationIdsByBrandId(user.academyId);
    }
    return undefined;
  }, [user]);

  const members = useMemo(
    () =>
      getMembersForScope(memberRole, {
        activeAcademyId: null,
        allowedAcademyIds,
      }),
    [memberRole, allowedAcademyIds]
  );

  const showLocationColumn = user?.role === ROLES.superadmin;

  const filtered = useMemo(() => {
    const query = activeSearch.toLowerCase().trim();
    if (!query) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.phone.includes(query) ||
        getAcademyById(m.academyId)?.name.toLowerCase().includes(query) ||
        getAcademyById(m.academyId)?.city.toLowerCase().includes(query)
    );
  }, [members, activeSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  useEffect(() => {
    dispatch(
      setPageHeader({
        title,
        breadcrumb: [
          "Dashboard",
          user?.role === ROLES.admin ? "My Academy" : "All Academies",
          title,
        ],
      })
    );
  }, [dispatch, title, user?.role]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearch, memberRole]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className="dashboard-page w-full min-w-0 max-w-full">
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[var(--border-soft)] shadow-sm overflow-hidden p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">{title}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {user?.role === ROLES.admin
                ? `Total ${title.toLowerCase()} across all your academy locations`
                : `Total ${title.toLowerCase()} across all academies`}
              {" · "}
              <span className="font-semibold text-[var(--text-primary)]">{filtered.length}</span>{" "}
              records
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setActiveSearch(search)}
              className="w-full h-10 pl-3 pr-9 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:border-[var(--accent)] transition"
            />
            <button
              type="button"
              onClick={() => setActiveSearch(search)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--accent)]"
              aria-label="Search"
            >
              <Search size={15} />
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 font-medium text-sm">
            No {title.toLowerCase()} found.
          </div>
        ) : (
          <>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">
                    <th className="py-3 px-3">Name</th>
                    {showLocationColumn && <th className="py-3 px-3">Academy</th>}
                    {showLocationColumn && <th className="py-3 px-3">Location</th>}
                    {!showLocationColumn && <th className="py-3 px-3">Location</th>}
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Phone</th>
                    <th className="py-3 px-3">Joined On</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {paginated.map((member) => {
                    const academy = getAcademyById(member.academyId);
                    return (
                      <tr key={member.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={member.avatar}
                              alt=""
                              className="w-9 h-9 rounded-full object-cover border border-gray-200"
                            />
                            <span className="font-semibold text-[var(--text-primary)]">
                              {member.name}
                            </span>
                          </div>
                        </td>
                        {showLocationColumn && (
                          <td className="py-3 px-3 text-gray-600 font-medium">
                            {academy?.name ?? "—"}
                          </td>
                        )}
                        <td className="py-3 px-3 text-gray-600 font-medium">
                          {academy?.city ?? "—"}
                        </td>
                        <td className="py-3 px-3 text-gray-600">{member.email}</td>
                        <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{member.phone}</td>
                        <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{member.joinedOn}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyles[member.status]}`}
                          >
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-5 mt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Showing {paginated.length} of {filtered.length} {title.toLowerCase()}
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
