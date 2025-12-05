import { useState, useEffect } from "react";
import { createClase, updateClase } from "../api/horarios";
import { getDocentes } from "../api/docentes";
import { getGrupos, getAsignaturas } from "../api/catalogos";
import { getAulas } from "../api/horarios";
import "./HorarioFormModal.css";

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function HorarioFormModal({ isOpen, onClose, onSuccess, clase }) {
  const isEditMode = !!clase;

  const [formData, setFormData] = useState({
    docenteId: "",
    asignaturaId: "",
    grupoId: "",
    aulaId: "",
    dia: "",
    horaInicio: "",
    horaFin: "",
  });

  const [docentes, setDocentes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (isEditMode) {
        const horaInicio = new Date(clase.horaInicio);
        const horaFin = new Date(clase.horaFin);

        setFormData({
          docenteId: clase.docenteId.toString(),
          asignaturaId: clase.asignaturaId.toString(),
          grupoId: clase.grupoId.toString(),
          aulaId: clase.aulaId.toString(),
          dia: clase.dia,
          horaInicio: `${horaInicio.getHours().toString().padStart(2, "0")}:${horaInicio.getMinutes().toString().padStart(2, "0")}`,
          horaFin: `${horaFin.getHours().toString().padStart(2, "0")}:${horaFin.getMinutes().toString().padStart(2, "0")}`,
        });
      }
    }
  }, [isOpen, clase, isEditMode]);

  const fetchData = async () => {
    try {
      const [docentesRes, gruposRes, asignaturasRes, aulasRes] = await Promise.all([
        getDocentes(),
        getGrupos(),
        getAsignaturas(),
        getAulas(),
      ]);

      setDocentes(docentesRes.data);
      setGrupos(gruposRes.data);
      setAsignaturas(asignaturasRes.data);
      setAulas(aulasRes.data);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("Error al cargar los datos del formulario");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convertir horas a formato DateTime
      const baseDate = "2024-01-01"; // Fecha base para las horas
      const dataToSend = {
        ...formData,
        horaInicio: `${baseDate}T${formData.horaInicio}:00.000Z`,
        horaFin: `${baseDate}T${formData.horaFin}:00.000Z`,
      };

      if (isEditMode) {
        await updateClase(clase.id, dataToSend);
      } else {
        await createClase(dataToSend);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al guardar clase:", err);
      setError(err.response?.data?.error || "Error al guardar la clase");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content horario-modal">
        <div className="modal-header">
          <h2>{isEditMode ? "Editar Clase" : "Nueva Clase"}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="horario-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-grid">
            {/* Grupo */}
            <div className="form-group">
              <label htmlFor="grupoId">
                Grupo <span className="required">*</span>
              </label>
              <select
                id="grupoId"
                name="grupoId"
                value={formData.grupoId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar grupo</option>
                {grupos.map((grupo) => (
                  <option key={grupo.id} value={grupo.id}>
                    Grupo {grupo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Asignatura */}
            <div className="form-group">
              <label htmlFor="asignaturaId">
                Asignatura <span className="required">*</span>
              </label>
              <select
                id="asignaturaId"
                name="asignaturaId"
                value={formData.asignaturaId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar asignatura</option>
                {asignaturas.map((asignatura) => (
                  <option key={asignatura.id} value={asignatura.id}>
                    {asignatura.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Docente */}
            <div className="form-group">
              <label htmlFor="docenteId">
                Docente <span className="required">*</span>
              </label>
              <select
                id="docenteId"
                name="docenteId"
                value={formData.docenteId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar docente</option>
                {docentes.map((docente) => (
                  <option key={docente.usuarioId} value={docente.usuarioId}>
                    {docente.usuario.nombre} {docente.usuario.apellidoPaterno}{" "}
                    {docente.usuario.apellidoMaterno}
                  </option>
                ))}
              </select>
            </div>

            {/* Aula */}
            <div className="form-group">
              <label htmlFor="aulaId">
                Aula <span className="required">*</span>
              </label>
              <select
                id="aulaId"
                name="aulaId"
                value={formData.aulaId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar aula</option>
                {aulas.map((aula) => (
                  <option key={aula.id} value={aula.id}>
                    {aula.nombre}
                    {aula.capacidad && ` (Cap: ${aula.capacidad})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Día */}
            <div className="form-group">
              <label htmlFor="dia">
                Día <span className="required">*</span>
              </label>
              <select
                id="dia"
                name="dia"
                value={formData.dia}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar día</option>
                {DIAS_SEMANA.map((dia) => (
                  <option key={dia} value={dia}>
                    {dia}
                  </option>
                ))}
              </select>
            </div>

            {/* Hora Inicio */}
            <div className="form-group">
              <label htmlFor="horaInicio">
                Hora Inicio <span className="required">*</span>
              </label>
              <input
                type="time"
                id="horaInicio"
                name="horaInicio"
                value={formData.horaInicio}
                onChange={handleChange}
                required
              />
            </div>

            {/* Hora Fin */}
            <div className="form-group">
              <label htmlFor="horaFin">
                Hora Fin <span className="required">*</span>
              </label>
              <input
                type="time"
                id="horaFin"
                name="horaFin"
                value={formData.horaFin}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Guardando..." : isEditMode ? "Actualizar" : "Crear Clase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
