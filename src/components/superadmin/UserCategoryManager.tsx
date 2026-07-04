import React, { useState, useEffect } from "react";
import { Search, UserCheck, ShieldAlert, Sparkles } from "lucide-react";

interface User {
  id: number;
  name: string;
  category: string;
  email: string;
}

interface UserCategoryManagerProps {
  role: "Admin" | "Coach" | "Student";
}

const defaultUsers: User[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    category: "Admin",
    email: "rahul@gmail.com",
  },
  {
    id: 2,
    name: "Amit Patel",
    category: "Coach",
    email: "amit@gmail.com",
  },
  {
    id: 3,
    name: "Neha Jain",
    category: "Student",
    email: "neha@gmail.com",
  },
   {
    id: 3,
    name: "Neha Jain",
    category: "Student",
    email: "neha@gmail.com",
  },
];

const UserCategoryManager: React.FC<UserCategoryManagerProps> = ({ role }) => {
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Load users from localStorage or default
  useEffect(() => {
    const loadUsers = () => {
      const savedUsers = localStorage.getItem("users");
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
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
  const filteredUsers = users.filter(
    (user) =>
      user.category === role &&
      user.name.toLowerCase().includes(search.toLowerCase())
  );

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

        {/* Change Category Action */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl px-4 py-3  focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 focus:outline-none transition-all duration-300"
          >
            <option value="" className="bg-[var(--bg-panel)]">Change Role</option>
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
                  Categoryp-4
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)] text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
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
                            role === "Admin" ? "bg-purple-50 text-purple-600" :
                            role === "Coach" ? "bg-blue-50 text-blue-600" :
                            "bg-green-50 text-green-600"
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold  flex items-center gap-1.5">
                              {user.name}
                              {role === "Admin" && (
                                <Sparkles size={14} className="text-yellow-400" />
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
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
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
    </div>
  );
};

export default UserCategoryManager;
