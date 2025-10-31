import React, { useState } from "react";
import "./PasoDatosPersonales.css";

export default function PasoDatosPersonales({ formData, setFormData, onNext }) {
  const [errores, setErrores] = useState({});

  const validarCampo = (name, value) => {
    let error = "";

    switch (name) {
      case "nombre":
      case "apellidoPaterno":
      case "apellidoMaterno":
        if (!value.trim()) error = "Campo obligatorio";
        break;

      case "dni":
        if (!/^\d{8}$/.test(value)) error = "Debe tener 8 dígitos numéricos";
        break;

      case "fechaNacimiento":
        if (new Date(value) > new Date())
          error = "La fecha no puede ser futura";
        break;

      case "telefono":
        if (!/^\d{9}$/.test(value)) error = "Debe tener 9 dígitos numéricos";
        break;

      case "telefonoApoderado":
        if (value && !/^\d{9}$/.test(value))
          error = "Debe tener 9 dígitos numéricos";
        break;

      default:
        break;
    }

    setErrores((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validarCampo(name, value);
  };

  const formValido =
    Object.values(errores).every((e) => !e) &&
    formData.nombre &&
    formData.apellidoPaterno &&
    formData.apellidoMaterno &&
    formData.dni &&
    formData.fechaNacimiento &&
    formData.telefono;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValido) onNext();
  };

  return (
    <div className="step-container">
      <h2>Datos Personales del Estudiante</h2>
      <p className="subtitle">
        Completa tus datos antes de continuar con la matrícula
      </p>

      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        {/* Nombre */}
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            className={errores.nombre ? "error" : "success"}
            required
          />
          {errores.nombre && <span className="error-text">{errores.nombre}</span>}
        </div>

        {/* Apellidos */}
        <div className="form-group">
          <label>Apellido Paterno:</label>
          <input
            type="text"
            name="apellidoPaterno"
            value={formData.apellidoPaterno || ""}
            onChange={handleChange}
            className={errores.apellidoPaterno ? "error" : "success"}
            required
          />
          {errores.apellidoPaterno && (
            <span className="error-text">{errores.apellidoPaterno}</span>
          )}
        </div>

        <div className="form-group">
          <label>Apellido Materno:</label>
          <input
            type="text"
            name="apellidoMaterno"
            value={formData.apellidoMaterno || ""}
            onChange={handleChange}
            className={errores.apellidoMaterno ? "error" : "success"}
            required
          />
          {errores.apellidoMaterno && (
            <span className="error-text">{errores.apellidoMaterno}</span>
          )}
        </div>

        {/* DNI */}
        <div className="form-group">
          <label>DNI:</label>
          <input
            type="text"
            name="dni"
            maxLength="8"
            value={formData.dni || ""}
            onChange={handleChange}
            className={errores.dni ? "error" : "success"}
            required
          />
          {errores.dni && <span className="error-text">{errores.dni}</span>}
        </div>

        {/* Fecha de nacimiento */}
        <div className="form-group">
          <label>Fecha de nacimiento:</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento || ""}
            onChange={handleChange}
            className={errores.fechaNacimiento ? "error" : "success"}
            required
          />
          {errores.fechaNacimiento && (
            <span className="error-text">{errores.fechaNacimiento}</span>
          )}
        </div>

        {/* Teléfonos */}
        <div className="form-group">
          <label>Teléfono del estudiante:</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono || ""}
            onChange={handleChange}
            className={errores.telefono ? "error" : "success"}
            required
          />
          {errores.telefono && (
            <span className="error-text">{errores.telefono}</span>
          )}
        </div>

        <div className="form-group">
          <label>Nombre del apoderado (opcional):</label>
          <input
            type="text"
            name="nombreApoderado"
            value={formData.nombreApoderado || ""}
            onChange={handleChange}
            className="success"
          />
        </div>

        <div className="form-group">
          <label>Teléfono del apoderado:</label>
          <input
            type="text"
            name="telefonoApoderado"
            value={formData.telefonoApoderado || ""}
            onChange={handleChange}
            className={errores.telefonoApoderado ? "error" : "success"}
          />
          {errores.telefonoApoderado && (
            <span className="error-text">{errores.telefonoApoderado}</span>
          )}
        </div>

        {/* Botón siguiente */}
        <div className="button-container">
          <button
            type="submit"
            className="btn-next"
            disabled={!formValido}
          >
            Siguiente →
          </button>
        </div>
      </form>
    </div>
  );
}
