// frontend/src/pages/docente/EstudiantesDocente.jsx

import { useState, useEffect } from "react";
import DocenteLayout from "../../components/DocenteLayout";
import { getMisEstudiantes } from "../../api/docente";
import "./EstudiantesDocente.css";

export default function EstudiantesDocente() {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroGrupo, setFiltroGrupo] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      setLoading(true);
      const res = await getMisEstudiantes();
      setGrupos(res.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar estudiantes:", err);
      setError("No se pudieron cargar los estudiantes");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar grupos
  const gruposFiltrados = grupos.filter((grupo) => {
    if (filtroGrupo !== "todos" && grupo.grupoId !== parseInt(filtroGrupo)) {
      return false;
    }
    return true;
  });

  // Aplanar estudiantes con info del grupo
  const estudiantesFiltrados = gruposFiltrados.flatMap((grupo) =>
    grupo.estudiantes
      .filter((est) => {
        if (!busqueda) return true;
        const nombreCompleto = `${est.usuario.nombre} ${est.usuario.apellidoPaterno} ${est.usuario.apellidoMaterno}`.toLowerCase();
        return (
          nombreCompleto.includes(busqueda.toLowerCase()) ||
          est.usuario.dni.includes(busqueda)
        );
      })
      .map((est) => ({
        ...est,
        grupo: grupo.grupoNombre,
        asignatura: grupo.asignatura,
      }))
  );

  const totalEstudiantes = grupos.reduce(
    (acc, grupo) => acc + grupo.estudiantes.length,
    0
  );

  if (loading) {
    return (
      <DocenteLayout title="Mis Estudiantes">
        <div className="estudiantes-loading">
          <div className="spinner"></div>
          <p>Cargando estudiantes...</p>
        </div>
      </DocenteLayout>
    );
  }

  if (error) {
    return (
      <DocenteLayout title="Mis Estudiantes">
        <div className="estudiantes-error">
          <p>⚠️ {error}</p>
          <button onClick={fetchEstudiantes} className="btn-retry">
            Reintentar
          </button>
        </div>
      </DocenteLayout>
    );
  }

  return (
    <DocenteLayout title="Mis Estudiantes">
      {/* RESUMEN */}
      <div className="estudiantes-summary">
        <div className="summary-card">
          <span className="summary-icon">👥</span>
          <div className="summary-info">
            <h3>{totalEstudiantes}</h3>
            <p>Estudiantes totales</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">📚</span>
          <div className="summary-info">
            <h3>{grupos.length}</h3>
            <p>Grupos asignados</p>
          </div>
        </div>
      </div>

      {grupos.length === 0 ? (
        <div className="estudiantes-empty">
          <span className="empty-icon">📋</span>
          <h3>No tienes grupos asignados</h3>
          <p>Aún no tienes clases con estudiantes matriculados.</p>
        </div>
      ) : (
        <>
          {/* FILTROS */}
          <div className="estudiantes-filters">
            <div className="filter-group">
              <label>🔍 Buscar:</label>
              <input
                type="text"
                placeholder="Nombre o DNI..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <label>📚 Grupo:</label>
              <select
                value={filtroGrupo}
                onChange={(e) => setFiltroGrupo(e.target.value)}
                className="filter-select"
              >
                <option value="todos">Todos los grupos</option>
                {grupos.map((grupo) => (
                  <option key={grupo.grupoId} value={grupo.grupoId}>
                    {grupo.grupoNombre} - {grupo.asignatura}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLA */}
          <div className="estudiantes-table-container">
            <table className="estudiantes-table">
              <thead>
                <tr>
                  <th>DNI</th>
                  <th>Nombre Completo</th>
                  <th>Correo</th>
                  <th>Celular</th>
                  <th>Grupo</th>
                  <th>Asignatura</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesFiltrados.length > 0 ? (
                  estudiantesFiltrados.map((estudiante, index) => (
                    <tr key={`${estudiante.id}-${index}`}>
                      <td>{estudiante.usuario.dni}</td>
                      <td className="nombre-completo">
                        {estudiante.usuario.nombre}{" "}
                        {estudiante.usuario.apellidoPaterno}{" "}
                        {estudiante.usuario.apellidoMaterno}
                      </td>
                      <td>{estudiante.usuario.correo}</td>
                      <td>{estudiante.usuario.celular || "N/A"}</td>
                      <td>
                        <span className="badge-grupo">{estudiante.grupo}</span>
                      </td>
                      <td>{estudiante.asignatura}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-results">
                      No se encontraron estudiantes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </DocenteLayout>
  );
}
