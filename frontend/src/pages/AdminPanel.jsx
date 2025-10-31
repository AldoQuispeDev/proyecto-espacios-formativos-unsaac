import React from "react";
import "./AdminPanel.css";

export default function AdminPanel() {
  return (
    <div className="admin-container">
      <div className="admin-card">
        <h2>Panel del Administrador</h2>
        <p className="admin-description">
          Esta sección está pendiente de implementación.
        </p>
        <p className="admin-subtext">
          Pronto aquí podrás revisar, aprobar y gestionar las matrículas de los estudiantes.
        </p>

        <div className="admin-placeholder">
          <div className="gear-icon">⚙️</div>
          <p className="placeholder-text">Módulo en desarrollo...</p>
        </div>
      </div>
    </div>
  );
}
