interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  subtitle?: string;
  color?: "purple" | "blue" | "green" | "cyan" | "orange" | "yellow";
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  subtitle,
  color = "blue",
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <p className="stat-title">{title}</p>
        <div className={`stat-icon ${color}`}>{icon}</div>
      </div>

      <div className="stat-value-row">
        <h2>{value}</h2>
        {change && <span className="stat-change">↑ {change}</span>}
      </div>

      {subtitle && <p className="stat-subtitle">{subtitle}</p>}
    </div>
  );
}
