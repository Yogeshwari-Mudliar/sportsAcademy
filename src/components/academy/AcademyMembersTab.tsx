import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { AcademyMember, AcademyMemberRole } from "@/data/academyMembers";
import { getMembersByAcademyAndRole } from "@/data/academyMembers";

const ROLE_LABELS: Record<AcademyMemberRole, string> = {
  student: "Student",
  coach: "Coach",
  admin: "Admin",
  accessory: "Accessory",
};

const statusStyles: Record<AcademyMember["status"], string> = {
  Active: "bg-green-50 text-green-600 border border-green-100",
  Inactive: "bg-red-50 text-red-500 border border-red-100",
  Pending: "bg-orange-50 text-orange-600 border border-orange-100",
};

interface AcademyMembersTabProps {
  academyId: number;
  memberRole: AcademyMemberRole;
}

export default function AcademyMembersTab({ academyId, memberRole }: AcademyMembersTabProps) {
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const members = useMemo(
    () => getMembersByAcademyAndRole(academyId, memberRole),
    [academyId, memberRole]
  );

  const filtered = useMemo(() => {
    const query = activeSearch.toLowerCase().trim();
    if (!query) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.phone.includes(query)
    );
  }, [members, activeSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearch, memberRole, academyId]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleSearch = () => setActiveSearch(search);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            {ROLE_LABELS[memberRole]}s
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {filtered.length} {ROLE_LABELS[memberRole].toLowerCase()}
            {filtered.length !== 1 ? "s" : ""} in this academy
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder={`Search ${ROLE_LABELS[memberRole].toLowerCase()}s...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full h-9 pl-3 pr-9 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:border-[var(--accent)] transition"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--accent)]"
            aria-label="Search"
          >
            <Search size={15} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-gray-400 font-medium text-sm">
          No {ROLE_LABELS[memberRole].toLowerCase()}s found for this academy.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-2">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">
                  <th className="py-3 px-3">Member</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Joined On</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {paginated.map((member) => (
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
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-1">
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
            </div>
          )}
        </>
      )}
    </div>
  );
}
