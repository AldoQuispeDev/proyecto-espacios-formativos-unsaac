// src/pages/admin/ValidarMatricula.jsx

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
// 🛑 CORRECCIÓN CLAVE: El nombre del componente importado debe coincidir con el nombre de uso.
import AdminSidebarLayout from "../../components/AdminSidebarLayout"; 
import api from "../../api/client"; 

export default function ValidarMatricula() {
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Cargar matrículas pendientes
  const fetchMatriculas = async () => {
    setLoading(true);
    try {
      const res = await api.get("/matriculas"); 
      const pendientes = res.data.filter(
        (m) => m.estado?.trim().toUpperCase() === "PENDIENTE"
      );
      setMatriculas(pendientes);
    } catch (error) {
      console.error("Error al obtener matrículas:", error);
      alert("Error al cargar matrículas. Asegúrate de estar logueado como Admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatriculas();
  }, []);

  // Aprobar matrícula
  const aprobarMatricula = async (id) => {
    if (!window.confirm("¿Confirmar APROBACIÓN de la matrícula?")) return;
    try {
      await api.put(`/matriculas/${id}/aprobar`, {});
      alert("✅ Matrícula aprobada correctamente");
      setMatriculas((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error al aprobar matrícula:", error);
      alert("❌ Error al aprobar matrícula");
    }
  };

  // Rechazar matrícula
  const rechazarMatricula = async (id) => {
    const motivo = prompt("Ingrese el motivo del rechazo:");
    if (!motivo) return;

    try {
      await api.put(`/matriculas/${id}/rechazar`, { motivo });
      alert(`🚫 Matrícula rechazada. Motivo: ${motivo}`);
      setMatriculas((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error al rechazar matrícula:", error);
      alert("❌ Error al rechazar matrícula");
    }
  };

  // 🛑 Renderizado del Layout Sidebar
  if (loading) {
    return (
      <AdminSidebarLayout title="Validar Matrículas">
        <p className="text-gray-500">Cargando matrículas...</p>
      </AdminSidebarLayout>
    );
  }

  return (
    <AdminSidebarLayout title="Validar Matrículas">
    <h1 className="text-2xl font-bold mb-6">Matrículas Pendientes</h1>
      {matriculas.length === 0 ? (
        <div className="text-center p-10 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xl font-medium text-yellow-800">🎉 No hay matrículas pendientes de validación.</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 bg-white tabla-matriculas">
            <thead className="bg-gray-50">
              <tr>
                <th>#</th>
                <th>Nombre y Apellidos</th>
                <th>DNI / Teléfono</th>
                <th>Modalidad / Grupo</th>
                <th>Carrera Principal</th>
                <th>Tipo Pago</th>
                <th>Comprobante</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {matriculas.map((m, i) => (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  <td>{i + 1}</td>
                  <td>{`${m.nombre ?? "—"} ${m.apellidoPaterno ?? ""} ${m.apellidoMaterno ?? ""}`}</td>
                  <td>{`${m.dni ?? "—"} / ${m.telefono ?? "—"}`}</td>
                  <td>{`${m.modalidad?.nombre ?? "—"} / ${m.grupo?.nombre ?? "—"}`}</td>
                  <td>{m.carreraPrincipal?.nombre ?? "—"}</td>
                  <td>{m.tipoPago ?? "—"}</td>
                  <td>
                    {m.comprobanteUrl ? (
                      <a
                        href={`http://localhost:4000${m.comprobanteUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Ver Comprobante
                      </a>
                    ) : (
                      "Falta Cbt."
                    )}
                  </td>
                  <td className="p-4 flex flex-col space-y-1">
                    <button
                      onClick={() => aprobarMatricula(m.id)}
                      className="bg-green-500 text-white px-3 py-1 text-xs rounded hover:bg-green-600 transition"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => rechazarMatricula(m.id)}
                      className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600 transition"
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminSidebarLayout>
  );
}