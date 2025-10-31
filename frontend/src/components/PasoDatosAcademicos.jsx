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
  const [errores, setErrores] = useState({});

  // Cargar modalidades y grupos al inicio
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
        console.error("Error al cargar modalidades y grupos:", error);
      }
    };
    fetchBaseData();
  }, []);

  // Cargar carreras y asignaturas al seleccionar grupo
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
        console.error("Error al cargar carreras/asignaturas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalles();
  }, [formData.grupoId]);

  const validarCampo = (name, value) => {
    let error = "";
    switch (name) {
      case "modalidadId":
        if (!value) error = "Debe seleccionar una modalidad";
        break;
      case "grupoId":
        if (!value) error = "Debe seleccionar un grupo";
        break;
      case "carreraPrincipalId":
        if (!value) error = "Debe seleccionar una carrera principal";
        break;
      default:
        break;
    }
    setErrores((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    validarCampo(name, value);

    switch (name) {
      case "modalidadId":
        const modalidadSeleccionada = modalidades.find(
          (m) => m.id === Number(value)
        );
        setFormData({
          ...formData,
          modalidadId: Number(value),
          modalidadNombre: modalidadSeleccionada?.nombre || "",
          grupoId: "",
          carreraPrincipalId: "",
          carreraSecundariaId: "",
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

  const formValido =
    formData.modalidadId &&
    formData.grupoId &&
    formData.carreraPrincipalId &&
    Object.values(errores).every((e) => !e);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValido) {
      onNext();
    } else {
      alert("Por favor, completa todos los campos obligatorios.");
    }
  };

  return (
    <div className="step-container">
      <h2>Datos Académicos</h2>
      <p className="subtitle">
        Selecciona la modalidad, grupo y carrera a la que deseas postularte.
      </p>

      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Modalidad:</label>
          <select
            name="modalidadId"
            value={formData.modalidadId || ""}
            onChange={handleChange}
            className={errores.modalidadId ? "error" : "success"}
            required
          >
            <option value="">Seleccione modalidad</option>
            {modalidades.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
          {errores.modalidadId && (
            <span className="error-text">{errores.modalidadId}</span>
          )}
        </div>

        <div className="form-group">
          <label>Grupo:</label>
          <select
            name="grupoId"
            value={formData.grupoId || ""}
            onChange={handleChange}
            className={errores.grupoId ? "error" : "success"}
            required
          >
            <option value="">Seleccione grupo</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.id}>
                Grupo {g.nombre}
              </option>
            ))}
          </select>
          {errores.grupoId && (
            <span className="error-text">{errores.grupoId}</span>
          )}
        </div>

        {carreras.length > 0 && (
          <>
            <div className="form-group">
              <label>Carrera Principal:</label>
              <select
                name="carreraPrincipalId"
                value={formData.carreraPrincipalId || ""}
                onChange={handleChange}
                className={errores.carreraPrincipalId ? "error" : "success"}
                required
              >
                <option value="">Seleccione carrera principal</option>
                {carreras.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              {errores.carreraPrincipalId && (
                <span className="error-text">{errores.carreraPrincipalId}</span>
              )}
            </div>

            <div className="form-group">
              <label>Carrera Secundaria (opcional):</label>
              <select
                name="carreraSecundariaId"
                value={formData.carreraSecundariaId || ""}
                onChange={handleChange}
                className="success"
              >
                <option value="">Seleccione segunda opción</option>
                {carreras.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {loading ? (
          <p className="loading-text">Cargando asignaturas...</p>
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
          <button type="submit" className="btn-next" disabled={!formValido}>
            Siguiente →
          </button>
        </div>
      </form>
    </div>
  );
}
