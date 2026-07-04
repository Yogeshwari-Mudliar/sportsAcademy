import { useState, useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";
import { 
  Search, 
  Download, 
  Plus, 
  Filter, 
  RotateCcw, 
  Edit3, 
  Trash2, 
  MapPin, 
  Calendar, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Coach" | "Student";
  academy: string;
  location: string;
  phone: string;
  status: "Active" | "Inactive" | "Pending";
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
    status: "Pending",
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

export default function ManageUsers() {
  const dispatch = useAppDispatch();
  
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [academyFilter, setAcademyFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  const [activeRole, setActiveRole] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [activeAcademy, setActiveAcademy] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Manage Users",
        breadcrumb: ["Dashboard", "Manage Users"],
      })
    );
  }, [dispatch]);

  const handleFilter = () => {
    setActiveSearch(search);
    setActiveRole(roleFilter);
    setActiveStatus(statusFilter);
    setActiveAcademy(academyFilter);
  };

  const handleReset = () => {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
    setAcademyFilter("");
    setDateFilter("");
    
    setActiveSearch("");
    setActiveRole("");
    setActiveStatus("");
    setActiveAcademy("");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      !activeSearch ||
      user.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(activeSearch.toLowerCase()) ||
      user.phone.includes(activeSearch);

    const matchesRole = !activeRole || user.role === activeRole;
    const matchesStatus = !activeStatus || user.status === activeStatus;
    const matchesAcademy = !activeAcademy || user.academy === activeAcademy;

    return matchesSearch && matchesRole && matchesStatus && matchesAcademy;
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Table Container Card */}
      <div className="bg-white rounded-2xl border border-[var(--border-soft)] shadow-sm overflow-hidden p-6">
        
        {/* Card Header Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">All Users</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">Manage and monitor all users across the platform.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-10 px-4 text-xs font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 text-[var(--text-primary)] transition flex items-center gap-2">
              <Download size={15} />
              Export
            </button>
            <button className="h-10 px-4 text-xs font-semibold rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white transition flex items-center gap-2 shadow-sm">
              <Plus size={16} />
              Add User
            </button>
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
            <option value="Pending">Pending</option>
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
              onClick={handleFilter}
              className="h-10 flex-1 px-4 text-xs font-semibold rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Filter size={14} />
              Filter
            </button>
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
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle px-6">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Academy</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined On</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, idx) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3.5 px-4 text-center text-gray-400 font-semibold">{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                          <div>
                            <p className="font-semibold text-[var(--text-primary)]">{user.name}</p>
                            <p className="text-xs text-[var(--text-faint)]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === "Admin" ? "bg-purple-50 text-purple-600 border border-purple-100" :
                          user.role === "Coach" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                          "bg-green-50 text-green-600 border border-green-100"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{user.academy}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
                            <MapPin size={11} /> {user.location}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">{user.email}</td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">{user.phone}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.status === "Active" ? "bg-green-50 text-green-600 border border-green-100" :
                          user.status === "Inactive" ? "bg-red-50 text-red-500 border border-red-100" :
                          "bg-orange-50 text-orange-600 border border-orange-100"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">{user.joinedOn}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 rounded-lg border border-blue-100 text-blue-600 hover:bg-blue-50 transition" aria-label="Edit user">
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition"
                            aria-label="Delete user"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-400 font-medium">
                      No users found matching search/filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 mt-4">
          <span className="text-xs text-gray-400 font-medium">Showing 1 to {filteredUsers.length} of 128 results</span>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 transition" aria-label="Previous page">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded-lg hover:bg-gray-50 text-gray-600 text-xs font-semibold flex items-center justify-center">2</button>
            <button className="w-8 h-8 rounded-lg hover:bg-gray-50 text-gray-600 text-xs font-semibold flex items-center justify-center">3</button>
            <span className="text-gray-400 px-1 font-semibold text-xs">...</span>
            <button className="w-8 h-8 rounded-lg hover:bg-gray-50 text-gray-600 text-xs font-semibold flex items-center justify-center">21</button>
            <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 transition" aria-label="Next page">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
