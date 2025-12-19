import React, { useEffect, useState } from "react";
import "./PasoDatosAcademicos.css";
import {
  obtenerGrupos,
  obtenerGruposCarrera,
  obtenerCarrerasPorGrupo,
  obtenerAsignaturasPorGrupo,
} from "../api/catalogos";

export default function PasoDatosAcademicos({
  formData,
  setFormData,
  onNext,
  onBack,
}) {
  const [grupos, setGrupos] = useState([]);               // Grupos académicos
  const [gruposCarrera, setGruposCarrera] = useState([]); // Grupos de carreras
  const [carreras, setCarreras] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ======================================================
     CARGA INICIAL (SIN MODALIDADES)
  ====================================================== */
  useEffect(() => {
    const fetchInicial = async () => {
      try {
        const [g, gc] = await Promise.all([
          obtenerGrupos(),
          obtenerGruposCarrera(),
        ]);
        setGrupos(g.data);
        setGruposCarrera(gc.data);
      } catch (err) {
        console.error("❌ Error carga inicial:", err);
      }
    };
    fetchInicial();
  }, []);

  /* ======================================================
     GRUPOS FILTRADOS POR MODALIDAD (YA ELEGIDA)
  ====================================================== */
  const gruposFiltrados = grupos.filter(
    (g) => g.modalidad?.id === formData.modalidadId
  );

  /* ======================================================
     ASIGNATURAS POR GRUPO ACADÉMICO
  ====================================================== */
  useEffect(() => {
    if (!formData.grupoId) {
      setAsignaturas([]);
      return;
    }

    obtenerAsignaturasPorGrupo(formData.grupoId)
      .then((res) => setAsignaturas(res.data))
      .catch((err) => console.error("❌ Error asignaturas:", err));
  }, [formData.grupoId]);

  /* ======================================================
     CARRERAS POR GRUPO DE CARRERAS
  ====================================================== */
  useEffect(() => {
    if (!formData.grupoCarreraId) {
      setCarreras([]);
      return;
    }

    setLoading(true);
    obtenerCarrerasPorGrupo(formData.grupoCarreraId)
      .then((res) => setCarreras(res.data))
      .catch((err) => console.error("❌ Error carreras:", err))
      .finally(() => setLoading(false));
  }, [formData.grupoCarreraId]);

  /* ======================================================
     HANDLER GENERAL
  ====================================================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "grupoId":
        setFormData({
          ...formData,
          grupoId: Number(value),
        });
        break;

      case "grupoCarreraId":
        setFormData({
          ...formData,
          grupoCarreraId: Number(value),
          carreraPrincipalId: "",
          carreraSecundariaId: "",
        });
        break;

      case "carreraPrincipalId":
        setFormData({
          ...formData,
          carreraPrincipalId: Number(value),
        });
        break;

      case "carreraSecundariaId":
        setFormData({
          ...formData,
          carreraSecundariaId: Number(value),
        });
        break;

      default:
        break;
    }
  };

  const formValido =
    formData.modalidadId &&
    formData.grupoId &&
    formData.grupoCarreraId &&
    formData.carreraPrincipalId;

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className="step-container">
      <h2>Datos Académicos</h2>
      <p className="subtitle">
        Completa la información académica para tu matrícula.
      </p>

      <form className="form-grid">
        {/* MODALIDAD (SOLO LECTURA) */}
        <div className="form-group">
          <label>Modalidad seleccionada</label>
          <input
            type="text"
            value={formData.modalidadNombre}
            disabled
          />
        </div>

        {/* GRUPO ACADÉMICO */}
        <div className="form-group">
          <label>Grupo Académico *</label>
          <select
            name="grupoId"
            value={formData.grupoId || ""}
            onChange={handleChange}
          >
            <option value="">Seleccionar grupo</option>
            {gruposFiltrados.map((g) => (
              <option key={g.id} value={g.id}>
                Grupo {g.letra}
              </option>

            ))}
          </select>
        </div>

        {/* GRUPO DE CARRERAS */}
        <div className="form-group">
          <label>Área / Grupo de Carreras *</label>
          <select
            name="grupoCarreraId"
            value={formData.grupoCarreraId || ""}
            onChange={handleChange}
          >
            <option value="">Seleccionar área</option>
            {gruposCarrera.map((g) => (
              <option key={g.id} value={g.id}>
                {g.letra}
              </option>
            ))}
          </select>
        </div>

        {/* CARRERAS */}
        {loading ? (
          <p>Cargando carreras...</p>
        ) : (
          carreras.length > 0 && (
            <>
              <div className="form-group">
                <label>Carrera Principal *</label>
                <select
                  name="carreraPrincipalId"
                  value={formData.carreraPrincipalId || ""}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar carrera</option>
                  {carreras.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Carrera Secundaria (opcional)</label>
                <select
                  name="carreraSecundariaId"
                  value={formData.carreraSecundariaId || ""}
                  onChange={handleChange}
                >
                  <option value="">Opcional</option>
                  {carreras.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )
        )}

        {/* ASIGNATURAS */}
        {asignaturas.length > 0 && (
          <div className="form-group">
            <label>Asignaturas del grupo</label>
            <ul>
              {asignaturas.map((a) => (
                <li key={a.id}>
                  {a.nombre} ({a.preguntas} preguntas)
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* BOTONES */}
        <div className="button-container">
          <button type="button" onClick={onBack}>
            ← Atrás
          </button>
          <button
            type="button"
            disabled={!formValido}
            onClick={onNext}
          >
            Siguiente →
          </button>
        </div>
      </form>
    </div>
  );
}
