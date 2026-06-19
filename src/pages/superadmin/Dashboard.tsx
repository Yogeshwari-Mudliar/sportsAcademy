import PageTitle from "../../components/dashboard/PageTitle";
import StatCard from "../../components/dashboard/StatCard";
import "../../styles/superadmin/dashboard.css";

import {
  Building2,
  Users,
  GraduationCap,
  IndianRupee,
  Trophy,
  Clock,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Academies",
      value: 128,
      icon: <Building2 size={22} />,
      color: "purple",
      change: "+12.5%",
    },
    {
      title: "Pending Approvals",
      value: 16,
      icon: <Clock size={22} />,
      color: "blue",
      change: "+3%",
    },
    {
      title: "Students",
      value: "24,560",
      icon: <GraduationCap size={22} />,
      color: "green",
      change: "+15.3%",
    },
    {
      title: "Revenue",
      value: "₹48.75L",
      icon: <IndianRupee size={22} />,
      color: "orange",
      change: "+18.6%",
    },
    {
      title: "Tournaments",
      value: 156,
      icon: <Trophy size={22} />,
      color: "yellow",
      change: "+11.2%",
    },
  ];

  return (
    <div className="dashboard-page">
      <PageTitle
        title="Dashboard"
        subtitle="Overview of platform activity"
      />

      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Recent Academies</h3>
          <p>Latest academy registrations...</p>
        </div>

        <div className="dashboard-card">
          <h3>Revenue Analytics</h3>
          <p>Chart goes here...</p>
        </div>

       <div className="dashboard-card full-width">
          <h3>Pending Approvals</h3>
          <p>Approval queue...</p>
        </div>
      </div>
    </div>
  );
}