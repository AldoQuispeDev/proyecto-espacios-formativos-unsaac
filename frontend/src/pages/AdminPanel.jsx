import React from "react";

const AdminPanel = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f7f8fa",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          textAlign: "center",
          width: "400px",
        }}
      >
        <h2>Panel del Administrador</h2>
        <p style={{ fontSize: "18px", color: "#555", marginTop: "10px" }}>
          🔧 Esta sección está pendiente de implementación.
        </p>
        <p style={{ color: "#888", fontSize: "14px" }}>
          Pronto aquí podrás revisar y gestionar las matrículas de los estudiantes.
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;
