import { useState } from "react";
import "../css/PanelDocente.css";

export default function PanelDocente() {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="docente-layout">
      {/* SIDEBAR */}
      <aside className="docente-sidebar">
        <div className="docente-profile">
          <img
            src="https://via.placeholder.com/70"
            alt="Docente"
          />
          <span>Docente</span>
        </div>

        <nav className="docente-menu">
          {[
            "Dashboard",
            "Mis Grupos",
            "Registro Académico",
            "Repositorio",
            "Evaluaciones",
            "Configuración",
          ].map((item) => (
            <button
              key={item}
              className={`menu-btn ${active === item ? "active" : ""}`}
              onClick={() => setActive(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="docente-content">
        <h1>{active}</h1>
        <ModuleContent active={active} />
      </main>
    </div>
  );
}

function ModuleContent({ active }) {
  switch (active) {
    case "Dashboard":
      return <p>Resumen general del docente.</p>;
    case "Mis Grupos":
      return <p>Listado de cursos y grupos asignados.</p>;
    case "Registro Académico":
      return <p>Notas, asistencia y auditoría.</p>;
    case "Repositorio":
      return <p>Material académico por semanas.</p>;
    case "Evaluaciones":
      return <p>Creación y gestión de evaluaciones.</p>;
    case "Configuración":
      return <p>Preferencias del docente.</p>;
    default:
      return null;
  }
}
