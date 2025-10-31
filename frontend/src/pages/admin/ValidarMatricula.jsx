import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";
import { AuthContext } from "../../context/AuthContext";

export default function ValidarMatricula() {
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cerrarSesion } = useContext(AuthContext);

  // 🔹 Cargar matrículas pendientes
  useEffect(() => {
    const fetchMatriculas = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/matriculas", {
          withCredentials: true,
        });
        const pendientes = res.data.filter(
          (m) => m.estado?.trim().toUpperCase() === "PENDIENTE"
        );
        setMatriculas(pendientes);
      } catch (error) {
        console.error("❌ Error al obtener matrículas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatriculas();
  }, []);

  // ✅ Aprobar matrícula
  const aprobarMatricula = async (id) => {
    try {
      await axios.put(
        `http://localhost:4000/api/matriculas/${id}/aprobar`,
        {},
        { withCredentials: true }
      );
      alert("✅ Matrícula aprobada correctamente");
      setMatriculas((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("❌ Error al aprobar matrícula:", error);
      alert("❌ Error al aprobar matrícula");
    }
  };

  // ❌ Rechazar matrícula
  const rechazarMatricula = async (id) => {
    try {
      await axios.put(
        `http://localhost:4000/api/matriculas/${id}/rechazar`,
        {},
        { withCredentials: true }
      );
      alert("🚫 Matrícula rechazada");
      setMatriculas((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("❌ Error al rechazar matrícula:", error);
      alert("❌ Error al rechazar matrícula");
    }
  };

  // ⏳ Estado de carga
  if (loading) {
    return (
      <Layout
        title="📋 Validar Matrículas"
        onBack={() => navigate("/admin")}
        onLogout={cerrarSesion}
      >
        <p className="text-center mt-6 text-gray-600">
          Cargando matrículas...
        </p>
      </Layout>
    );
  }

  return (
    <Layout
      title="📋 Matrículas Pendientes por Confirmar"
      onBack={() => navigate("/admin")}
      onLogout={cerrarSesion}
    >
      {matriculas.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          No hay matrículas pendientes.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-800 font-semibold">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Ap. Paterno</th>
                <th className="p-2 border">Ap. Materno</th>
                <th className="p-2 border">DNI</th>
                <th className="p-2 border">Teléfono</th>
                <th className="p-2 border">Apoderado</th>
                <th className="p-2 border">Tel. Apoderado</th>
                <th className="p-2 border">Modalidad</th>
                <th className="p-2 border">Grupo</th>
                <th className="p-2 border">Carrera Principal</th>
                <th className="p-2 border">Carrera Secundaria</th>
                <th className="p-2 border">Pago</th>
                <th className="p-2 border">Comprobante</th>
                <th className="p-2 border">Acción</th>
              </tr>
            </thead>
            <tbody>
              {matriculas.map((m, i) => (
                <tr
                  key={m.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">{m.nombre ?? "—"}</td>
                  <td className="border p-2">{m.apellidoPaterno ?? "—"}</td>
                  <td className="border p-2">{m.apellidoMaterno ?? "—"}</td>
                  <td className="border p-2 text-center">{m.dni ?? "—"}</td>
                  <td className="border p-2 text-center">{m.telefono ?? "—"}</td>
                  <td className="border p-2">{m.nombreApoderado ?? "—"}</td>
                  <td className="border p-2 text-center">
                    {m.telefonoApoderado ?? "—"}
                  </td>
                  <td className="border p-2 text-center">
                    {m.modalidad?.nombre}
                  </td>
                  <td className="border p-2 text-center">{m.grupo?.nombre}</td>
                  <td className="border p-2 text-center">
                    {m.carreraPrincipal?.nombre}
                  </td>
                  <td className="border p-2 text-center">
                    {m.carreraSecundaria?.nombre ?? "—"}
                  </td>
                  <td className="border p-2 text-center">{m.tipoPago}</td>
                  <td className="border p-2 text-center">
                    <a
                      href={`http://localhost:4000${m.comprobanteUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver
                    </a>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => aprobarMatricula(m.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => rechazarMatricula(m.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
    </Layout>
  );
}
