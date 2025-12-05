import { useState, useEffect } from "react";
import AdminSidebarLayout from "../../components/AdminSidebarLayout";
import HorarioFormModal from "../../components/HorarioFormModal";
import AulaFormModal from "../../components/AulaFormModal";
import { getClases, deleteClase } from "../../api/horarios";
import "./GestionHorarios.css";

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const HORAS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00"
];

export default function GestionHorarios() {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vistaActual, setVistaActual] = useState("calendario"); // calendario | lista
  const [filtros, setFiltros] = useState({
    grupoId: "",
    docenteId: "",
    dia: "",
    aulaId: "",
  });

  // Modales
  const [isHorarioModalOpen, setIsHorarioModalOpen] = useState(false);
  const [isAulaModalOpen, setIsAulaModalOpen] = useState(false);
  const [claseToEdit, setClaseToEdit] = useState(null);

  useEffect(() => {
    fetchClases();
  }, [filtros]);

  const fetchClases = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtros.grupoId) params.grupoId = filtros.grupoId;
      if (filtros.docenteId) params.docenteId = filtros.docenteId;
      if (filtros.dia) params.dia = filtros.dia;
      if (filtros.aulaId) params.aulaId = filtros.aulaId;

      const res = await getClases(params);
      setClases(res.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar clases:", err);
      setError("Error al cargar el horario");
      setClases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClase = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta clase?")) return;

    try {
      await deleteClase(id);
      alert("Clase eliminada exitosamente");
      fetchClases();
    } catch (err) {
      console.error("Error al eliminar clase:", err);
      alert(err.response?.data?.error || "Error al eliminar la clase");
    }
  };

  const handleOpenCreateModal = () => {
    setClaseToEdit(null);
    setIsHorarioModalOpen(true);
  };

  const handleOpenEditModal = (clase) => {
    setClaseToEdit(clase);
    setIsHorarioModalOpen(true);
  };

  const getClasesForDiaYHora = (dia, hora) => {
    return clases.filter((clase) => {
      if (clase.dia !== dia) return false;

      const horaInicio = new Date(clase.horaInicio);
      const horaFin = new Date(clase.horaFin);
      const [horaActual] = hora.split(":");

      const horaInicioStr = horaInicio.getHours().toString().padStart(2, "0");
      const horaFinStr = horaFin.getHours().toString().padStart(2, "0");

      return horaActual >= horaInicioStr && horaActual < horaFinStr;
    });
  };

  const formatHora = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  };

  if (loading && clases.length === 0) {
    return (
      <AdminSidebarLayout title="Gestión de Horarios">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando horarios...</p>
        </div>
      </AdminSidebarLayout>
    );
  }

  return (
    <AdminSidebarLayout title="Gestión de Horarios">
      {/* HEADER CON ACCIONES */}
      <div className="horarios-header">
        <div className="horarios-header-left">
          <h2>Control de Clases y Horarios</h2>
          <p className="horarios-subtitle">
            Administra los horarios de clases, docentes y aulas
          </p>
        </div>
        <div className="horarios-header-right">
          <button
            className="btn-secondary"
            onClick={() => setIsAulaModalOpen(true)}
          >
            🏫 Gestionar Aulas
          </button>
          <button className="btn-primary" onClick={handleOpenCreateModal}>
            ➕ Nueva Clase
          </button>
        </div>
      </div>

      {/* BARRA DE FILTROS Y VISTA */}
      <div className="horarios-toolbar">
        <div className="horarios-filters">
          <select
            value={filtros.dia}
            onChange={(e) => setFiltros({ ...filtros, dia: e.target.value })}
            className="filter-select"
          >
            <option value="">Todos los días</option>
            {DIAS_SEMANA.map((dia) => (
              <option key={dia} value={dia}>
                {dia}
              </option>
            ))}
          </select>

          {filtros.dia && (
            <button
              className="btn-clear-filter"
              onClick={() => setFiltros({ ...filtros, dia: "" })}
            >
              ✕ Limpiar filtro
            </button>
          )}
        </div>

        <div className="horarios-view-toggle">
          <button
            className={`view-btn ${vistaActual === "calendario" ? "active" : ""}`}
            onClick={() => setVistaActual("calendario")}
          >
            📅 Calendario
          </button>
          <button
            className={`view-btn ${vistaActual === "lista" ? "active" : ""}`}
            onClick={() => setVistaActual("lista")}
          >
            📋 Lista
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
          <button onClick={fetchClases}>Reintentar</button>
        </div>
      )}

      {/* VISTA DE CALENDARIO */}
      {vistaActual === "calendario" && (
        <div className="horario-calendario">
          <div className="calendario-grid">
            {/* HEADER CON DÍAS */}
            <div className="calendario-header">
              <div className="calendario-cell hora-header">Hora</div>
              {DIAS_SEMANA.map((dia) => (
                <div key={dia} className="calendario-cell dia-header">
                  {dia}
                </div>
              ))}
            </div>

            {/* FILAS DE HORAS */}
            {HORAS.map((hora) => (
              <div key={hora} className="calendario-row">
                <div className="calendario-cell hora-cell">{hora}</div>
                {DIAS_SEMANA.map((dia) => {
                  const clasesEnCelda = getClasesForDiaYHora(dia, hora);
                  return (
                    <div key={`${dia}-${hora}`} className="calendario-cell clase-cell">
                      {clasesEnCelda.map((clase) => (
                        <div
                          key={clase.id}
                          className="clase-card"
                          onClick={() => handleOpenEditModal(clase)}
                        >
                          <div className="clase-card-header">
                            <span className="clase-asignatura">
                              {clase.asignatura.nombre}
                            </span>
                            <span className="clase-grupo">
                              Grupo {clase.grupo.nombre}
                            </span>
                          </div>
                          <div className="clase-card-body">
                            <p className="clase-docente">
                              👨‍🏫 {clase.docente.usuario.nombre}{" "}
                              {clase.docente.usuario.apellidoPaterno}
                            </p>
                            <p className="clase-aula">
                              🏫 {clase.aula.nombre}
                            </p>
                            <p className="clase-horario">
                              🕐 {formatHora(clase.horaInicio)} -{" "}
                              {formatHora(clase.horaFin)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA DE LISTA */}
      {vistaActual === "lista" && (
        <div className="horario-lista">
          <div className="lista-table-container">
            <table className="lista-table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Horario</th>
                  <th>Asignatura</th>
                  <th>Grupo</th>
                  <th>Docente</th>
                  <th>Aula</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clases.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      No hay clases programadas
                    </td>
                  </tr>
                ) : (
                  clases.map((clase) => (
                    <tr key={clase.id}>
                      <td>{clase.dia}</td>
                      <td>
                        {formatHora(clase.horaInicio)} - {formatHora(clase.horaFin)}
                      </td>
                      <td>{clase.asignatura.nombre}</td>
                      <td>Grupo {clase.grupo.nombre}</td>
                      <td>
                        {clase.docente.usuario.nombre}{" "}
                        {clase.docente.usuario.apellidoPaterno}
                      </td>
                      <td>{clase.aula.nombre}</td>
                      <td className="actions-cell">
                        <button
                          className="btn-edit"
                          onClick={() => handleOpenEditModal(clase)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteClase(clase.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALES */}
      {isHorarioModalOpen && (
        <HorarioFormModal
          isOpen={isHorarioModalOpen}
          onClose={() => setIsHorarioModalOpen(false)}
          onSuccess={fetchClases}
          clase={claseToEdit}
        />
      )}

      {isAulaModalOpen && (
        <AulaFormModal
          isOpen={isAulaModalOpen}
          onClose={() => setIsAulaModalOpen(false)}
        />
      )}
    </AdminSidebarLayout>
  );
}
