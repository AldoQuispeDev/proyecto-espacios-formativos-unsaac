import "./StatCard.css";

export default function StatCard({ icon, title, value, subtitle, color = "blue", trend }) {
  const colorClasses = {
    blue: "stat-card-blue",
    green: "stat-card-green",
    orange: "stat-card-orange",
    purple: "stat-card-purple",
    red: "stat-card-red",
    yellow: "stat-card-yellow",
  };

  return (
    <div className={`stat-card ${colorClasses[color]}`}>
      <div className="stat-card-icon">
        <span>{icon}</span>
      </div>
      <div className="stat-card-content">
        <h3 className="stat-card-title">{title}</h3>
        <p className="stat-card-value">{value}</p>
        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
        {trend && (
          <div className={`stat-card-trend ${trend.type}`}>
            <span>{trend.type === "up" ? "↑" : "↓"}</span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
