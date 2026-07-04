import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";
import StatsOverview from "../../components/dashboard/StatsOverview";
import { 
  MapPin, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight,
  GraduationCap,
  Users,
  CreditCard,
  BadgeDollarSign
} from "lucide-react";
import "../../styles/superadmin/dashboard.css";

const RECENT_ACADEMIES = [
  {
    id: 1,
    name: "Mumbai Cricket Club",
    location: "Mumbai, MH",
    registeredOn: "30 Jun, 2026",
    status: "Approved",
    initials: "MC",
    avatarBg: "bg-orange-100 text-orange-600"
  },
  {
    id: 2,
    name: "Delhi Cricket Academy",
    location: "New Delhi, DL",
    registeredOn: "29 Jun, 2026",
    status: "Pending",
    initials: "DA",
    avatarBg: "bg-purple-100 text-purple-600"
  },
  {
    id: 3,
    name: "Bangalore Sports Hub",
    location: "Bangalore, KA",
    registeredOn: "28 Jun, 2026",
    status: "Approved",
    initials: "BS",
    avatarBg: "bg-green-100 text-green-600"
  },
  {
    id: 4,
    name: "Pune Cricket Training",
    location: "Pune, MH",
    registeredOn: "27 Jun, 2026",
    status: "Approved",
    initials: "PC",
    avatarBg: "bg-blue-100 text-blue-600"
  },
  {
    id: 5,
    name: "Chennai Super Kings Acad.",
    location: "Chennai, TN",
    registeredOn: "26 Jun, 2026",
    status: "Pending",
    initials: "CS",
    avatarBg: "bg-yellow-100 text-yellow-600"
  }
];

const BOTTOM_WIDGETS = [
  {
    title: "Total Coaches",
    value: "1,245",
    change: "9.3%",
    icon: <GraduationCap size={20} />,
    color: "orange"
  },
  {
    title: "Active Students",
    value: "18,752",
    change: "13.2%",
    icon: <Users size={20} />,
    color: "blue"
  },
  {
    title: "Total Payments",
    value: "2,856",
    change: "11.5%",
    icon: <CreditCard size={20} />,
    color: "purple"
  },
  {
    title: "Subscriptions",
    value: "1,024",
    change: "7.8%",
    icon: <BadgeDollarSign size={20} />,
    color: "green"
  }
];

export default function Dashboard() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Dashboard",
        breadcrumb: ["Dashboard"],
      })
    );
  }, [dispatch]);

  return (
    <div className="dashboard-page space-y-6">
      {/* Top 6 Stat Cards */}
      <StatsOverview />

      {/* Middle Panels: Recent Academies & Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Academies Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--border-soft)] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Recent Academies</h3>
              <button className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 text-[var(--text-muted)] transition">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3">Academy Name</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Registered On</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {RECENT_ACADEMIES.map((academy) => (
                    <tr key={academy.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3.5 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${academy.avatarBg}`}>
                          {academy.initials}
                        </div>
                        <span className="font-semibold text-[var(--text-primary)]">{academy.name}</span>
                      </td>
                      <td className="py-3.5 text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400" />
                          <span>{academy.location}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-gray-500">{academy.registeredOn}</td>
                      <td className="py-3.5 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          academy.status === "Approved" 
                            ? "bg-green-50 text-green-600 border border-green-100" 
                            : "bg-orange-50 text-orange-600 border border-orange-100"
                        }`}>
                          {academy.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 mt-4">
            <span className="text-xs text-gray-400 font-medium">Showing 5 of 128 results</span>
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 transition" aria-label="Previous page">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-[var(--text-primary)] text-white text-xs font-semibold flex items-center justify-center">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-gray-50 text-gray-600 text-xs font-semibold flex items-center justify-center">2</button>
              <button className="w-8 h-8 rounded-lg hover:bg-gray-50 text-gray-600 text-xs font-semibold flex items-center justify-center">3</button>
              <span className="text-gray-400 px-1 font-semibold text-xs">...</span>
              <button className="w-8 h-8 rounded-lg hover:bg-gray-50 text-gray-600 text-xs font-semibold flex items-center justify-center">26</button>
              <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 transition" aria-label="Next page">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Revenue Analytics Panel with Custom SVG Chart */}
        <div className="bg-white rounded-2xl border border-[var(--border-soft)] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Revenue Analytics</h3>
              <button className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition flex items-center gap-1.5">
                This Month <ChevronDown size={14} />
              </button>
            </div>

            <div className="mb-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Revenue</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h4 className="text-2xl font-bold text-[var(--text-primary)]">₹48.75 L</h4>
                <span className="text-xs font-bold text-green-500 flex items-center">
                  <ArrowUpRight size={14} /> 18.6%
                </span>
                <span className="text-[11px] text-gray-400 font-medium">vs last month</span>
              </div>
            </div>

            {/* Custom Responsive SVG Chart */}
            <div className="relative w-full h-44 mt-6">
              <svg viewBox="0 0 500 180" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Grids */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="55" x2="480" y2="55" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="90" x2="480" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="125" x2="480" y2="125" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="150" x2="480" y2="150" stroke="#f1f5f9" strokeWidth="1.5" />

                {/* Y Axis Labels */}
                <text x="30" y="24" fill="#94a3b8" fontSize="10" textAnchor="end">₹20L</text>
                <text x="30" y="59" fill="#94a3b8" fontSize="10" textAnchor="end">₹15L</text>
                <text x="30" y="94" fill="#94a3b8" fontSize="10" textAnchor="end">₹10L</text>
                <text x="30" y="129" fill="#94a3b8" fontSize="10" textAnchor="end">₹5L</text>
                <text x="30" y="154" fill="#94a3b8" fontSize="10" textAnchor="end">₹0</text>

                {/* Area Gradient Fill */}
                <path
                  d="M 50 142 
                     C 100 135, 120 105, 140 108 
                     C 160 110, 200 120, 220 100 
                     C 240 80, 270 85, 300 70 
                     C 330 55, 380 65, 410 40 
                     C 440 15, 460 30, 480 20 
                     L 480 150 L 50 150 Z"
                  fill="url(#chart-area-grad)"
                />

                {/* Line Path */}
                <path
                  d="M 50 142 
                     C 100 135, 120 105, 140 108 
                     C 160 110, 200 120, 220 100 
                     C 240 80, 270 85, 300 70 
                     C 330 55, 380 65, 410 40 
                     C 440 15, 460 30, 480 20"
                  stroke="#ff6b00"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="50" cy="142" r="4.5" fill="#ff6b00" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="140" cy="108" r="4.5" fill="#ff6b00" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="220" cy="100" r="4.5" fill="#ff6b00" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="300" cy="70" r="4.5" fill="#ff6b00" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="410" cy="40" r="4.5" fill="#ff6b00" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="480" cy="20" r="4.5" fill="#ff6b00" stroke="#ffffff" strokeWidth="2.5" />

                {/* X Axis Labels */}
                <text x="50" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">1 Jun</text>
                <text x="140" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">7 Jun</text>
                <text x="220" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">14 Jun</text>
                <text x="300" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">21 Jun</text>
                <text x="410" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">28 Jun</text>
                <text x="480" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">30 Jun</text>

                {/* Definitions */}
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

      {/* Bottom Row of 4 Smaller Horizontal Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {BOTTOM_WIDGETS.map((widget) => (
          <div key={widget.title} className="bg-white rounded-2xl border border-[var(--border-soft)] p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                widget.color === "orange" ? "bg-orange-50 text-orange-600" :
                widget.color === "blue" ? "bg-blue-50 text-blue-600" :
                widget.color === "purple" ? "bg-purple-50 text-purple-600" :
                "bg-green-50 text-green-600"
              }`}>
                {widget.icon}
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">{widget.title}</span>
                <span className="text-lg font-bold text-[var(--text-primary)] mt-0.5 block">{widget.value}</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-green-500">
              ↑ {widget.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
