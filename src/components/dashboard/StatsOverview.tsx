import {
  Building2,
  Clock,
  CheckCircle2,
  Users,
  IndianRupee,
  Trophy,
} from "lucide-react";
import StatCard from "./StatCard";
import "../../styles/superadmin/dashboard.css";

const STATS = [
  {
    title: "Total Academies",
    value: 128,
    change: "12.5%",
    subtitle: "Total Registered",
    color: "purple" as const,
    icon: <Building2 size={22} />,
  },
  {
    title: "Pending Approvals",
    value: 16,
    subtitle: "0 Pending Review",
    color: "cyan" as const,
    icon: <Clock size={22} />,
  },
  {
    title: "Approved Academies",
    value: 98,
    change: "8.7%",
    subtitle: "Active Academies",
    color: "green" as const,
    icon: <CheckCircle2 size={22} />,
  },
  {
    title: "Total Students",
    value: "24,560",
    change: "15.3%",
    subtitle: "Across All Academies",
    color: "blue" as const,
    icon: <Users size={22} />,
  },
  {
    title: "Total Revenue",
    value: "₹48.75 L",
    change: "18.6%",
    subtitle: "This Month",
    color: "orange" as const,
    icon: <IndianRupee size={22} />,
  },
  {
    title: "Total Tournaments",
    value: 156,
    change: "11.2%",
    subtitle: "This Month",
    color: "yellow" as const,
    icon: <Trophy size={22} />,
  },
];

export default function StatsOverview() {
  return (
    <div className="stats-grid">
      {STATS.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
