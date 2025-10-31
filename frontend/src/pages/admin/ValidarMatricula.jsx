import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ValidarMatricula.css";
import Layout from "../../components/Layout";
import { AuthContext } from "../../context/AuthContext";

export default function ValidarMatricula() {
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cerrarSesion } = useContext(AuthContext);

  // Cargar matrículas pendientes
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
        console.error("Error al obtener matrículas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatriculas();
  }, []);

  // Aprobar matrícula
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
      console.error("Error al aprobar matrícula:", error);
      alert("❌ Error al aprobar matrícula");
    }
  };

  // Rechazar matrícula
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
      console.error("Error al rechazar matrícula:", error);
      alert("❌ Error al rechazar matrícula");
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <Layout
        title="Validar Matrículas"
        onBack={() => navigate("/admin")}
        onLogout={cerrarSesion}
      >
        <p className="loading-text">Cargando matrículas...</p>
      </Layout>
    );
  }

  return (
    <Layout
      title="Matrículas Pendientes por Confirmar"
      onBack={() => navigate("/admin")}
      onLogout={cerrarSesion}
    >
      {matriculas.length === 0 ? (
        <p className="no-data-text">No hay matrículas pendientes.</p>
      ) : (
        <div className="tabla-container">
          <table className="tabla-matriculas">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Ap. Paterno</th>
                <th>Ap. Materno</th>
                <th>DNI</th>
                <th>Teléfono</th>
                <th>Apoderado</th>
                <th>Tel. Apoderado</th>
                <th>Modalidad</th>
                <th>Grupo</th>
                <th>Carrera Principal</th>
                <th>Carrera Secundaria</th>
                <th>Pago</th>
                <th>Comprobante</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {matriculas.map((m, i) => (
                <tr key={m.id}>
                  <td>{i + 1}</td>
                  <td>{m.nombre ?? "—"}</td>
                  <td>{m.apellidoPaterno ?? "—"}</td>
                  <td>{m.apellidoMaterno ?? "—"}</td>
                  <td>{m.dni ?? "—"}</td>
                  <td>{m.telefono ?? "—"}</td>
                  <td>{m.nombreApoderado ?? "—"}</td>
                  <td>{m.telefonoApoderado ?? "—"}</td>
                  <td>{m.modalidad?.nombre ?? "—"}</td>
                  <td>{m.grupo?.nombre ?? "—"}</td>
                  <td>{m.carreraPrincipal?.nombre ?? "—"}</td>
                  <td>{m.carreraSecundaria?.nombre ?? "—"}</td>
                  <td>{m.tipoPago ?? "—"}</td>
                  <td>
                    {m.comprobanteUrl ? (
                      <a
                        href={`http://localhost:4000${m.comprobanteUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="link-ver"
                      >
                        Ver
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="acciones">
                    <button
                      onClick={() => aprobarMatricula(m.id)}
                      className="btn-aprobar"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => rechazarMatricula(m.id)}
                      className="btn-rechazar"
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
