import React from "react";
import "./PasoDatosPersonales.css";

export default function PasoDatosPersonales({ formData, setFormData, onNext }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="step-container">
      <h2>🧍‍♂️ Datos Personales del Estudiante</h2>
      <p className="subtitle">
        Completa tus datos antes de continuar con la matrícula
      </p>

      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
      >
        {/* Nombre */}
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Apellidos */}
        <div className="form-group">
          <label>Apellido Paterno:</label>
          <input
            type="text"
            name="apellidoPaterno"
            value={formData.apellidoPaterno || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellido Materno:</label>
          <input
            type="text"
            name="apellidoMaterno"
            value={formData.apellidoMaterno || ""}
            onChange={handleChange}
            required
          />
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
            required
          />
        </div>

        {/* Fecha de nacimiento */}
        <div className="form-group">
          <label>Fecha de nacimiento:</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Teléfonos */}
        <div className="form-group">
          <label>Teléfono del estudiante:</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Nombre del apoderado (opcional):</label>
          <input
            type="text"
            name="nombreApoderado"
            value={formData.nombreApoderado || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Teléfono del apoderado:</label>
          <input
            type="text"
            name="telefonoApoderado"
            value={formData.telefonoApoderado || ""}
            onChange={handleChange}
          />
        </div>

        {/* Botón siguiente */}
        <div className="button-container">
          <button type="submit" className="btn-next">
            Siguiente →
          </button>
        </div>
      </form>
    </div>
  );
}
