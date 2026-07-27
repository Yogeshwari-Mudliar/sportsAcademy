import { useState, useEffect, useMemo } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";
import { 
  Search, 
  RotateCcw, 
  MapPin, 
  Calendar
} from "lucide-react";
import TableRowActions from "@/components/table/TableRowActions";
import TableAddButton from "@/components/table/TableAddButton";
import TablePagination from "@/components/table/TablePagination";
import TableImportExport from "@/components/table/TableImportExport";
import StatusDot from "@/components/table/StatusDot";
import { useCanManageTables } from "@/hooks/useCanManageTables";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { downloadCsv, parseCsv, readFileAsText, toCsv } from "@/utils/csv";

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Coach" | "Student";
  academy: string;
  location: string;
  phone: string;
  status: "Active" | "Inactive";
  joinedOn: string;
  avatar: string;
}

const INITIAL_USERS: UserItem[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    role: "Admin",
    academy: "Mumbai Cricket Club",
    location: "Mumbai, MH",
    phone: "+91 98765 43210",
    status: "Active",
    joinedOn: "30 Jun, 2026",
    avatar: "https://i.pravatar.cc/100?img=33"
  },
  {
    id: 2,
    name: "Arjun Mehta",
    email: "arjun.mehta@gmail.com",
    role: "Coach",
    academy: "Delhi Cricket Academy",
    location: "New Delhi, DL",
    phone: "+91 91234 56789",
    status: "Active",
    joinedOn: "29 Jun, 2026",
    avatar: "https://i.pravatar.cc/100?img=11"
  },
  {
    id: 3,
    name: "Sneha Iyer",
    email: "sneha.iyer@gmail.com",
    role: "Student",
    academy: "Bangalore Sports Hub",
    location: "Bangalore, KA",
    phone: "+91 99876 54321",
    status: "Active",
    joinedOn: "28 Jun, 2026",
    avatar: "https://i.pravatar.cc/100?img=47"
  },
  {
    id: 4,
    name: "Vikram Singh",
    email: "vikram.singh@gmail.com",
    role: "Coach",
    academy: "Pune Cricket Training",
    location: "Pune, MH",
    phone: "+91 98712 34567",
    status: "Inactive",
    joinedOn: "27 Jun, 2026",
    avatar: "https://i.pravatar.cc/100?img=12"
  },
  {
    id: 5,
    name: "Priya Patel",
    email: "priya.patel@gmail.com",
    role: "Student",
    academy: "Chennai Super Kings Acad.",
    location: "Chennai, TN",
    phone: "+91 91234 87654",
    status: "Inactive",
    joinedOn: "26 Jun, 2026",
    avatar: "https://i.pravatar.cc/100?img=49"
  },
  {
    id: 6,
    name: "Karan Verma",
    email: "karan.verma@gmail.com",
    role: "Admin",
    academy: "Kolkata Cricket Academy",
    location: "Kolkata, WB",
    phone: "+91 90000 11122",
    status: "Active",
    joinedOn: "25 Jun, 2026",
    avatar: "https://i.pravatar.cc/100?img=59"
  }
];

const STORAGE_KEY = "manage_users";

export default function ManageUsers() {
  const dispatch = useAppDispatch();
  const canManage = useCanManageTables();
  
  const [users, setUsers] = useState<UserItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Array<UserItem & { status: string }>;
        return parsed.map((u) => ({
          ...u,
          status: (u.status === "Active" ? "Active" : "Inactive") as UserItem["status"],
        }));
      }
    } catch {
      /* use defaults */
    }
    return INITIAL_USERS;
  });
  const [viewing, setViewing] = useState<UserItem | null>(null);
  const [editing, setEditing] = useState<UserItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [academyFilter, setAcademyFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Manage Users",
        breadcrumb: ["Dashboard", "Manage Users"],
      })
    );
  }, [dispatch]);

  const persistUsers = (next: UserItem[]) => {
    setUsers(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleReset = () => {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
    setAcademyFilter("");
    setDateFilter("");
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query);

      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus = !statusFilter || user.status === statusFilter;
      const matchesAcademy = !academyFilter || user.academy === academyFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesAcademy;
    });
  }, [users, debouncedSearch, roleFilter, statusFilter, academyFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, roleFilter, statusFilter, academyFilter, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleToggleStatus = (user: UserItem) => {
    const nextStatus = user.status === "Active" ? "Inactive" : "Active";
    const label = nextStatus === "Active" ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${label} this user?`)) return;
    persistUsers(
      users.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    setViewing((v) => (v?.id === user.id ? { ...v, status: nextStatus } : v));
  };

  const handleSaveUser = (user: UserItem) => {
    const exists = users.some((u) => u.id === user.id);
    const next = exists
      ? users.map((u) => (u.id === user.id ? { ...u, ...user } : u))
      : [user, ...users];
    persistUsers(next);
    setEditing(null);
    setAdding(false);
  };

  const handleExport = () => {
    const headers = ["name", "email", "phone", "role", "academy", "location", "status", "joinedOn"];
    downloadCsv(
      "users-export.csv",
      toCsv(
        headers,
        filteredUsers.map((u) => ({
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          academy: u.academy,
          location: u.location,
          status: u.status,
          joinedOn: u.joinedOn,
        }))
      )
    );
  };

  const handleImport = async (file: File) => {
    const text = await readFileAsText(file);
    const { rows } = parseCsv(text);
    const nextIdBase = users.reduce((max, u) => Math.max(max, u.id), 0);
    const imported: UserItem[] = [];
    rows.forEach((row, index) => {
      const name = (row.name || "").trim();
      const email = (row.email || "").trim();
      if (!name || !email) return;
      const roleRaw = (row.role || "Student").trim();
      const role: UserItem["role"] =
        roleRaw === "Admin" || roleRaw === "Coach" ? roleRaw : "Student";
      const statusRaw = (row.status || "Active").trim();
      imported.push({
        id: nextIdBase + index + 1,
        name,
        email,
        phone: (row.phone || "").trim(),
        role,
        academy: (row.academy || "").trim() || "—",
        location: (row.location || "").trim() || "—",
        status: statusRaw.toLowerCase() === "inactive" ? "Inactive" : "Active",
        joinedOn:
          (row.joinedon || row.joinedOn || "").trim() ||
          new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a56db&color=fff`,
      });
    });
    if (!imported.length) {
      window.alert("CSV must include name and email columns.");
      return;
    }
    persistUsers([...imported, ...users]);
    window.alert(`Imported ${imported.length} users.`);
  };

  return (
    <div className="space-y-6">
      {/* Table Container Card */}
      <div className="bg-white rounded-2xl border border-[var(--border-soft)] shadow-sm overflow-hidden p-4 sm:p-6">
        
        {/* Card Header Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">All Users</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">Manage and monitor all users across the platform.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <TableImportExport
              show={canManage}
              onExport={handleExport}
              onImportFile={handleImport}
            />
            <TableAddButton label="Add User" show={canManage} onClick={() => setAdding(true)} />
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 py-6 items-center">
          
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-3 pr-9 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:border-[var(--accent)] transition"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          </div>

          {/* Role */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 px-3 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none text-[var(--text-primary)] focus:border-[var(--accent)] cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Coach">Coach</option>
            <option value="Student">Student</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none text-[var(--text-primary)] focus:border-[var(--accent)] cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Academy */}
          <select
            value={academyFilter}
            onChange={(e) => setAcademyFilter(e.target.value)}
            className="h-10 px-3 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none text-[var(--text-primary)] focus:border-[var(--accent)] cursor-pointer"
          >
            <option value="">All Academies</option>
            <option value="Mumbai Cricket Club">Mumbai Cricket Club</option>
            <option value="Delhi Cricket Academy">Delhi Cricket Academy</option>
            <option value="Bangalore Sports Hub">Bangalore Sports Hub</option>
            <option value="Pune Cricket Training">Pune Cricket Training</option>
            <option value="Chennai Super Kings Acad.">Chennai Super Kings Acad.</option>
            <option value="Kolkata Cricket Academy">Kolkata Cricket Academy</option>
          </select>

          {/* Date Selector */}
          <div className="relative">
            <input
              type="text"
              placeholder="Select Date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full h-10 pl-3 pr-9 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:border-[var(--accent)] transition"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full lg:w-auto">
            <button
              onClick={handleReset}
              className="h-10 px-3 text-xs font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 text-[var(--text-primary)] transition flex items-center justify-center gap-1"
              title="Reset Filters"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="w-full overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[720px] table-fixed border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">
                  <th className="py-3 px-2 w-[5%] text-center">#</th>
                  <th className="py-3 px-2 w-[18%]">User</th>
                  <th className="py-3 px-2 w-[10%]">Role</th>
                  <th className="py-3 px-2 w-[18%]">Academy</th>
                  <th className="py-3 px-2 w-[18%]">Email</th>
                  <th className="py-3 px-2 w-[12%]">Phone</th>
                  <th className="py-3 px-2 w-[10%]">Joined On</th>
                  {canManage && <th className="py-3 px-2 w-[7%] text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user, idx) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3.5 px-2 text-center text-gray-400 font-semibold">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="py-3.5 px-2 overflow-hidden">
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5 min-w-0">
                              <span className="truncate" title={user.name}>{user.name}</span>
                              <StatusDot status={user.status} className="shrink-0" />
                            </p>
                            <p className="text-xs text-[var(--text-faint)] truncate" title={user.email}>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 overflow-hidden">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block max-w-full truncate ${
                          user.role === "Admin" ? "bg-purple-50 text-purple-600 border border-purple-100" :
                          user.role === "Coach" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                          "bg-green-50 text-green-600 border border-green-100"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 overflow-hidden">
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--text-primary)] truncate" title={user.academy}>{user.academy}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5 min-w-0">
                            <MapPin size={11} className="shrink-0" />
                            <span className="truncate">{user.location}</span>
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 text-gray-600 font-medium overflow-hidden">
                        <span className="block truncate" title={user.email}>{user.email}</span>
                      </td>
                      <td className="py-3.5 px-2 text-gray-600 font-medium overflow-hidden">
                        <span className="block truncate" title={user.phone}>{user.phone}</span>
                      </td>
                      <td className="py-3.5 px-2 text-gray-500 overflow-hidden">
                        <span className="block truncate">{user.joinedOn}</span>
                      </td>
                      {canManage && (
                      <td className="py-3.5 px-2 text-center">
                        <TableRowActions
                          onView={() => setViewing(user)}
                          onEdit={() => setEditing(user)}
                          onToggleStatus={() => handleToggleStatus(user)}
                          isActive={user.status === "Active"}
                        />
                      </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={canManage ? 8 : 7} className="py-12 text-center text-gray-400 font-medium">
                      No users found matching search/filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
          label="users"
        />

      </div>

      {(viewing || editing || adding) && (
        <UserCrudModal
          mode={adding ? "add" : editing ? "edit" : "view"}
          user={viewing ?? editing ?? undefined}
          onClose={() => {
            setViewing(null);
            setEditing(null);
            setAdding(false);
          }}
          onSave={handleSaveUser}
          onEdit={() => {
            if (viewing) {
              setEditing(viewing);
              setViewing(null);
            }
          }}
        />
      )}
    </div>
  );
}

function UserCrudModal({
  mode,
  user,
  onClose,
  onSave,
  onEdit,
}: {
  mode: "view" | "edit" | "add";
  user?: UserItem;
  onClose: () => void;
  onSave: (user: UserItem) => void;
  onEdit: () => void;
}) {
  const isView = mode === "view";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSave({
      ...(user ?? {}),
      id: user?.id ?? Date.now(),
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      role: String(fd.get("role")) as UserItem["role"],
      academy: String(fd.get("academy")),
      location: String(fd.get("location")),
      phone: String(fd.get("phone")),
      status: String(fd.get("status")) as UserItem["status"],
      joinedOn: user?.joinedOn ?? new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      avatar: user?.avatar ?? `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close" />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">
          {mode === "add" ? "Add User" : mode === "edit" ? "Edit User" : "View User"}
        </h3>
        {isView && user ? (
          <div className="space-y-2 text-sm">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Academy:</strong> {user.academy}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Status:</strong> {user.status}</p>
            <div className="flex justify-end gap-2 pt-4">
              <button type="button" className="px-4 py-2 border rounded-lg" onClick={onClose}>Close</button>
              <button type="button" className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg" onClick={onEdit}>Edit</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="name" defaultValue={user?.name} placeholder="Name" required className="w-full h-10 px-3 border rounded-xl" />
            <input name="email" type="email" defaultValue={user?.email} placeholder="Email" required className="w-full h-10 px-3 border rounded-xl" />
            <select name="role" defaultValue={user?.role ?? "Student"} className="w-full h-10 px-3 border rounded-xl">
              <option value="Admin">Admin</option>
              <option value="Coach">Coach</option>
              <option value="Student">Student</option>
            </select>
            <input name="academy" defaultValue={user?.academy} placeholder="Academy" className="w-full h-10 px-3 border rounded-xl" />
            <input name="location" defaultValue={user?.location} placeholder="Location" className="w-full h-10 px-3 border rounded-xl" />
            <input name="phone" defaultValue={user?.phone} placeholder="Phone" className="w-full h-10 px-3 border rounded-xl" />
            <select name="status" defaultValue={user?.status ?? "Active"} className="w-full h-10 px-3 border rounded-xl">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="px-4 py-2 border rounded-lg" onClick={onClose}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg">Save</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
