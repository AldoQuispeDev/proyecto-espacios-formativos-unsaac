import React, { useEffect, useState } from "react";
import "./PasoDatosAcademicos.css";
import {
  obtenerModalidades,
  obtenerGrupos,
  obtenerCarrerasPorGrupo,
  obtenerAsignaturasPorGrupo,
} from "../api/catalogos";

export default function PasoDatosAcademicos({
  formData,
  setFormData,
  onNext,
  onBack,
}) {
  const [modalidades, setModalidades] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar modalidades y grupos al inicio
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [resModalidades, resGrupos] = await Promise.all([
          obtenerModalidades(),
          obtenerGrupos(),
        ]);
        setModalidades(resModalidades.data);
        setGrupos(resGrupos.data);
      } catch (error) {
        console.error("❌ Error al cargar modalidades y grupos:", error);
      }
    };
    fetchBaseData();
  }, []);

  // 🔹 Cuando se selecciona un grupo, cargar carreras y asignaturas
  useEffect(() => {
    const fetchDetalles = async () => {
      if (!formData.grupoId) {
        setCarreras([]);
        setAsignaturas([]);
        return;
      }
      setLoading(true);
      try {
        const [resCarreras, resAsignaturas] = await Promise.all([
          obtenerCarrerasPorGrupo(formData.grupoId),
          obtenerAsignaturasPorGrupo(formData.grupoId),
        ]);
        setCarreras(resCarreras.data);
        setAsignaturas(resAsignaturas.data);
      } catch (error) {
        console.error("❌ Error al cargar carreras/asignaturas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalles();
  }, [formData.grupoId]);

  // 🔹 Manejar cambios del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "modalidadId":
        const modalidadSeleccionada = modalidades.find(
          (m) => m.id === Number(value)
        );
        setFormData({
          ...formData,
          modalidadId: Number(value),
          modalidadNombre: modalidadSeleccionada?.nombre || "",
        });
        break;

      case "grupoId":
        const grupoSeleccionado = grupos.find((g) => g.id === Number(value));
        setFormData({
          ...formData,
          grupoId: Number(value),
          grupoNombre: grupoSeleccionado?.nombre || "",
          carreraPrincipalId: "",
          carreraSecundariaId: "",
        });
        break;

      case "carreraPrincipalId":
        const carreraP = carreras.find((c) => c.id === Number(value));
        setFormData({
          ...formData,
          carreraPrincipalId: Number(value),
          carreraPrincipalNombre: carreraP?.nombre || "",
        });
        break;

      case "carreraSecundariaId":
        const carreraS = carreras.find((c) => c.id === Number(value));
        setFormData({
          ...formData,
          carreraSecundariaId: Number(value),
          carreraSecundariaNombre: carreraS?.nombre || "",
        });
        break;

      default:
        setFormData({ ...formData, [name]: value });
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.modalidadId || !formData.grupoId || !formData.carreraPrincipalId) {
      alert("Por favor, completa los campos obligatorios.");
      return;
    }
    onNext();
  };

  return (
    <div className="step-container">
      <h2>🎓 Datos Académicos</h2>
      <p className="subtitle">
        Selecciona la modalidad, grupo y carrera a la que deseas postularte.
      </p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Modalidad:</label>
          <select
            name="modalidadId"
            value={formData.modalidadId || ""}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione modalidad</option>
            {modalidades.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Grupo:</label>
          <select
            name="grupoId"
            value={formData.grupoId || ""}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione grupo</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.id}>
                Grupo {g.nombre}
              </option>
            ))}
          </select>
        </div>

        {carreras.length > 0 && (
          <div className="form-group">
            <label>Carrera Principal:</label>
            <select
              name="carreraPrincipalId"
              value={formData.carreraPrincipalId || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione carrera principal</option>
              {carreras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {carreras.length > 0 && (
          <div className="form-group">
            <label>Carrera Secundaria (opcional):</label>
            <select
              name="carreraSecundariaId"
              value={formData.carreraSecundariaId || ""}
              onChange={handleChange}
            >
              <option value="">Seleccione segunda opción</option>
              {carreras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <p style={{ color: "#007bff" }}>Cargando asignaturas...</p>
        ) : (
          asignaturas.length > 0 && (
            <div className="form-group asignaturas">
              <label>Asignaturas del grupo:</label>
              <ul>
                {asignaturas.map((a) => (
                  <li key={a.id}>
                    {a.nombre} ({a.preguntas} preguntas)
                  </li>
                ))}
              </ul>
            </div>
          )
        )}

        <div className="button-container">
          <button type="button" className="btn-back" onClick={onBack}>
            ← Atrás
          </button>
          <button type="submit" className="btn-next">
            Siguiente →
          </button>
        </div>
      </form>
    </div>
  );
}
