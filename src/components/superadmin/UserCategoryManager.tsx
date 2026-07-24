import React, { useState, useEffect, useMemo } from "react";
import { Search, UserCheck, ShieldAlert, Sparkles, RotateCcw } from "lucide-react";
import TableRowActions from "@/components/table/TableRowActions";
import TableAddButton from "@/components/table/TableAddButton";
import TablePagination from "@/components/table/TablePagination";
import StatusDot from "@/components/table/StatusDot";
import { useCanManageTables } from "@/hooks/useCanManageTables";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface User {
  id: number;
  name: string;
  category: string;
  email: string;
  status?: "Active" | "Inactive";
}

interface UserCategoryManagerProps {
  role: "Super Admin" | "Admin" | "Coach" | "Student";
}

const defaultUsers: User[] = [
  {
    id: 1,
    name: "Superadmin User",
    category: "Super Admin",
    email: "superadmin@sportsacademy.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    category: "Admin",
    email: "rahul@gmail.com",
    status: "Active",
  },
  {
    id: 3,
    name: "Amit Patel",
    category: "Coach",
    email: "amit@gmail.com",
    status: "Active",
  },
  {
    id: 4,
    name: "Neha Jain",
    category: "Student",
    email: "neha@gmail.com",
    status: "Active",
  },
   {
    id: 5,
    name: "Karan Singh",
    category: "Student",
    email: "karan@gmail.com",
    status: "Inactive",
  },
];

const UserCategoryManager: React.FC<UserCategoryManagerProps> = ({ role }) => {
  const canManage = useCanManageTables();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [newCategory, setNewCategory] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [viewing, setViewing] = useState<User | null>(null);
  const [editing, setEditing] = useState<User | null>(null);
  const [adding, setAdding] = useState(false);

  // Load users from localStorage or default
  useEffect(() => {
    const loadUsers = () => {
      const savedUsers = localStorage.getItem("users");
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers) as Array<User & { archived?: boolean }>;
        setUsers(
          parsed.map((u) => ({
            ...u,
            status: u.status ?? (u.archived ? "Inactive" : "Active"),
          }))
        );
      } else {
        setUsers(defaultUsers);
        localStorage.setItem("users", JSON.stringify(defaultUsers));
      }
    };

    loadUsers();

    // Listen to localStorage changes in other tabs/components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "users" && e.newValue) {
        setUsers(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    
    // Custom event listener for same-window updates
    const handleLocalUpdate = () => {
      const saved = localStorage.getItem("users");
      if (saved) setUsers(JSON.parse(saved));
    };
    window.addEventListener("usersUpdated", handleLocalUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("usersUpdated", handleLocalUpdate);
    };
  }, []);

  // Filter users by the selected role and search query
  const filteredUsers = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    return users.filter((user) => {
      const matchesRole = user.category === role;
      const matchesSearch = !query || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
      const matchesStatus = !statusFilter || (user.status ?? "Active") === statusFilter;
      return matchesRole && matchesSearch && matchesStatus;
    });
  }, [users, role, debouncedSearch, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, role, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const persist = (updated: User[]) => {
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    window.dispatchEvent(new Event("usersUpdated"));
  };

  const handleToggleStatus = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const nextStatus = (user.status ?? "Active") === "Active" ? "Inactive" : "Active";
    const label = nextStatus === "Active" ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${label} this user?`)) return;
    persist(users.map((u) => (u.id === id ? { ...u, status: nextStatus } : u)));
    setViewing((v) => (v?.id === id ? { ...v, status: nextStatus } : v));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(filteredUsers.map((u) => u.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleCategoryChange = () => {
    if (!newCategory || selected.length === 0) return;

    const updatedUsers = users.map((user) =>
      selected.includes(user.id) ? { ...user, category: newCategory } : user
    );

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    // Dispatch custom event to notify other components/tabs
    window.dispatchEvent(new Event("usersUpdated"));

    setSelected([]);
    setNewCategory("");
  };

  const getBadgeStyle = (userRole: string) => {
    switch (userRole) {
      case "Super Admin":
        return "bg-rose-50 text-rose-600 border border-rose-100";
      case "Admin":
        return "bg-purple-50 text-purple-600 border border-purple-100";
      case "Coach":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "Student":
        return "bg-green-50 text-green-600 border border-green-100";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-100";
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-[var(--bg-panel)]/30 rounded-2xl backdrop-blur-md">
        

 {/* border border-[var(--border-soft)] backdrop-blur-md */}


        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder={`Search ${role.toLowerCase()}s...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl pl-11 pr-4 py-3  placeholder-[var(--text-faint)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 focus:outline-none transition-all duration-300"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" size={18} />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl px-4 py-3 focus:border-[var(--accent)] outline-none"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStatusFilter("");
          }}
          className="h-[46px] px-3 text-xs font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 inline-flex items-center gap-1"
        >
          <RotateCcw size={14} />
          Reset
        </button>

        {/* Change Category Action */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl px-4 py-3  focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 focus:outline-none transition-all duration-300"
          >
            <option value="" className="bg-[var(--bg-panel)]">Change Role</option>
            <option value="Super Admin" disabled={role === "Super Admin"} className="bg-[var(--bg-panel)] disabled:opacity-50">Super Admin</option>
            <option value="Admin" disabled={role === "Admin"} className="bg-[var(--bg-panel)] disabled:opacity-50">Admin</option>
            <option value="Coach" disabled={role === "Coach"} className="bg-[var(--bg-panel)] disabled:opacity-50">Coach</option>
            <option value="Student" disabled={role === "Student"} className="bg-[var(--bg-panel)] disabled:opacity-50">Student</option>
          </select>

          <button
            onClick={handleCategoryChange}
            disabled={selected.length === 0 || !newCategory}
            className="bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none disabled:transform-none flex items-center gap-2"
          >
            <UserCheck size={18} />
            Apply Change
          </button>
          <TableAddButton label={`Add ${role}`} show={canManage} onClick={() => setAdding(true)} />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-panel)]/20 backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-soft)] bg-[var(--bg-input)]">
                <th className=" w-16 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredUsers.length > 0 &&
                      selected.length === filteredUsers.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-3 h-3 accent-[var(--accent)] rounded border-[var(--border-soft)] bg-[var(--bg-input)] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className=" text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Name
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Category
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Email
                </th>
                {canManage && (
                  <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)] text-sm">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => {
                  const isRowSelected = selected.includes(user.id);
                  return (
                    <tr
                      key={user.id}
                      className={`transition-colors duration-200 hover:bg-[var(--bg-panel)]/40 ${
                        isRowSelected
                          ? "bg-[var(--accent-soft)] border-l-2 border-[var(--accent)]"
                          : ""
                      }`}
                    >
                      <td className="px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isRowSelected}
                          onChange={() => handleSelect(user.id)}
                          className="w-3 h-3 accent-[var(--accent)] rounded border-[var(--border-soft)] bg-[var(--bg-input)] focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-sm flex items-center justify-center font-bold shadow-sm ${
                            role === "Super Admin" ? "bg-rose-50 text-rose-600" :
                            role === "Admin" ? "bg-purple-50 text-purple-600" :
                            role === "Coach" ? "bg-blue-50 text-blue-600" :
                            "bg-green-50 text-green-600"
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold flex items-center gap-1.5 min-w-0">
                              <span className="truncate" title={user.name}>{user.name}</span>
                              <StatusDot status={user.status ?? "Active"} className="shrink-0" />
                              {role === "Admin" && (
                                <Sparkles size={14} className="text-yellow-400 shrink-0" />
                              )}
                              {role === "Super Admin" && (
                                <Sparkles size={14} className="text-rose-400 shrink-0" />
                              )}
                            </p>
                            <p className="text-xs text-[var(--text-faint)] font-mono">
                              ID: #{user.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${getBadgeStyle(
                            user.category
                          )}`}
                        >
                          {user.category}
                        </span>
                      </td>
                      <td className="p-2 text-[var(--text-muted)] font-medium">
                        {user.email}
                      </td>
                      {canManage && (
                        <td className="p-2">
                          <TableRowActions
                            onView={() => setViewing(user)}
                            onEdit={() => setEditing(user)}
                            onToggleStatus={() => handleToggleStatus(user.id)}
                            isActive={(user.status ?? "Active") === "Active"}
                          />
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={canManage ? 5 : 4} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500/80 animate-pulse">
                        <ShieldAlert size={28} />
                      </div>
                      <p className="text-[var(--text-muted)] font-medium">
                        No {role.toLowerCase()}s found matching search criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredUsers.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        label={`${role.toLowerCase()}s`}
      />

      {(viewing || editing || adding) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => { setViewing(null); setEditing(null); setAdding(false); }} aria-label="Close" />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-bold mb-3">{adding ? "Add" : editing ? "Edit" : "View"} {role}</h3>
            {viewing && !editing && !adding ? (
              <div className="text-sm space-y-1">
                <p><strong>Name:</strong> {viewing.name}</p>
                <p><strong>Email:</strong> {viewing.email}</p>
                <p><strong>Category:</strong> {viewing.category}</p>
                <button type="button" className="mt-4 px-4 py-2 bg-[var(--accent)] text-white rounded-lg" onClick={() => { setEditing(viewing); setViewing(null); }}>Edit</button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const next: User = {
                    ...(editing ?? {}),
                    id: editing?.id ?? Date.now(),
                    name: String(fd.get("name")),
                    email: String(fd.get("email")),
                    category: role,
                    status: (String(fd.get("status") || "Active") as "Active" | "Inactive"),
                  };
                  const updated = editing
                    ? users.map((u) => (u.id === next.id ? next : u))
                    : [next, ...users];
                  persist(updated);
                  setEditing(null);
                  setAdding(false);
                }}
                className="space-y-3"
              >
                <input name="name" defaultValue={editing?.name} placeholder="Name" required className="w-full h-10 px-3 border rounded-xl" />
                <input name="email" type="email" defaultValue={editing?.email} placeholder="Email" required className="w-full h-10 px-3 border rounded-xl" />
                <select name="status" defaultValue={editing?.status ?? "Active"} className="w-full h-10 px-3 border rounded-xl">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <button type="submit" className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg">Save</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCategoryManager;
