import "./ModuleCard.css";

export default function ModuleCard({ icon, title, description, onClick, color = "blue" }) {
  return (
    <div className={`module-card module-card-${color}`} onClick={onClick}>
      <div className="module-card-header">
        <div className="module-card-icon">{icon}</div>
        <div className="module-card-arrow">→</div>
      </div>
      <h3 className="module-card-title">{title}</h3>
      <p className="module-card-description">{description}</p>
    </div>
  );
}
