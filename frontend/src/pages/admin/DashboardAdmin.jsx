// src/pages/admin/DashboardAdmin.jsx

import { useNavigate } from "react-router-dom";
import AdminSidebarLayout from "../../components/AdminSidebarLayout";

const MODULOS = [
  { id: 1, title: "Validación de Matrículas", description: "Revisa, aprueba o rechaza los comprobantes de pago de los nuevos estudiantes.", path: "/admin/validarMatricula", icon: "📝" },
  { id: 2, title: "Gestión de Docentes", description: "Crea, edita y desactiva las fichas de los profesores y personal administrativo.", path: "/admin/docentes", icon: "👨‍🏫" },
  { id: 3, title: "Catálogos Académicos", description: "Administra las Modalidades, Grupos, Carreras y Asignaturas.", path: "/admin/catalogos", icon: "📚" },
];

export default function DashboardAdmin() {
  const navigate = useNavigate();

  return (
    <AdminSidebarLayout title="Dashboard del Administrador">
      
      <p className="dashboard-text mb-8 text-gray-700">
        Aquí encontrarás un resumen de las métricas clave del sistema y los accesos rápidos a la gestión.
      </p>

      {/* GRID DE MÓDULOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULOS.map((modulo) => (
          <div 
            key={modulo.id}
            className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(modulo.path)}
          >
            <div className="text-4xl mb-4">{modulo.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{modulo.title}</h3>
            <p className="text-gray-600 text-sm">{modulo.description}</p>
          </div>
        ))}
      </div>

    </AdminSidebarLayout>
  );
}
