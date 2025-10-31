import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import "./DashboardAdmin.css";
import Layout from "../../components/Layout";
import { AuthContext } from "../../context/AuthContext";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const { cerrarSesion } = useContext(AuthContext);

  // Redirigir a la sección de validación de matrículas
  const irAValidar = () => {
    navigate("/admin/validarMatricula");
  };

  return (
    <Layout title="Panel del Administrador" onLogout={cerrarSesion}>
      <div className="dashboard-container">
        <h2 className="dashboard-title">Bienvenido al Panel Administrativo</h2>
        <p className="dashboard-text">
          Desde aquí podrás gestionar todo el proceso académico de la academia:
        </p>

        <ul className="dashboard-list">
          <li>Revisar y validar matrículas pendientes</li>
          <li>Ver estudiantes registrados</li>
          <li>Administrar modalidades, grupos y carreras</li>
        </ul>

        <div className="dashboard-actions">
          <button onClick={irAValidar} className="btn-primary">
            Ir a Validar Matrículas
          </button>
        </div>
      </div>
    </Layout>
  );
}
