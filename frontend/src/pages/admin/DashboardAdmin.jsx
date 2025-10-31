import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import Layout from "../../components/Layout";
import { AuthContext } from "../../context/AuthContext";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const { cerrarSesion } = useContext(AuthContext);

  // 🔹 Función para ir a la sección de validación
  const irAValidar = () => {
    navigate("/admin/validarMatricula");
  };

  return (
    <Layout title="⚙️ Panel del Administrador" onLogout={cerrarSesion}>
      <div className="text-gray-700">
        <p className="mb-4">
          Bienvenido al panel administrativo. Desde aquí podrás gestionar todo
          el proceso académico de la academia:
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>Revisar y validar matrículas pendientes</li>
          <li>Ver estudiantes registrados</li>
          <li>Administrar modalidades, grupos y carreras</li>
        </ul>

        <div className="flex justify-center">
          <button
            onClick={irAValidar}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
          >
            📋 Ir a Validar Matrículas
          </button>
        </div>
      </div>
    </Layout>
  );
}
