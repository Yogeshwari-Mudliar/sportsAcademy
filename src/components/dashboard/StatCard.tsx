interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  color = "blue",
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        {icon}
      </div>

      <div className="stat-content">
        <p className="stat-title">{title}</p>

        <div className="stat-value-row">
          <h2>{value}</h2>

          {change && (
            <span className="stat-change">
              ↑ {change}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}