// src/components/EstudianteFormModal.jsx (CÓDIGO COMPLETO Y FINAL)
import "./EstudianteFormModal.css";
import React, { useState, useEffect } from "react";
import { updateEstudiante, createEstudiante } from "../api/estudiantes"; 

const formatFecha = (dateString) => {
    if (!dateString) return '';
    return dateString.substring(0, 10); 
};

const initialFormState = {
    nombre: "", apellidoPaterno: "", apellidoMaterno: "", dni: "", correo: "", 
    celular: "", fechaNacimiento: "", nombreApoderado: "", telefonoApoderado: "", 
    password: "",
};

export default function EstudianteFormModal({ isOpen, onClose, onSuccess, estudiante }) {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const isEditMode = !!estudiante;

  useEffect(() => {
    if (estudiante) {
      setForm({
        nombre: estudiante.usuario.nombre,
        apellidoPaterno: estudiante.usuario.apellidoPaterno,
        apellidoMaterno: estudiante.usuario.apellidoMaterno,
        dni: estudiante.usuario.dni,
        correo: estudiante.usuario.correo,
        celular: estudiante.usuario.celular || "",
        fechaNacimiento: formatFecha(estudiante.fechaNacimiento),
        nombreApoderado: estudiante.nombreApoderado || "",
        telefonoApoderado: estudiante.telefonoApoderado || "",
        password: "", 
      });
    } else {
        setForm(initialFormState);
    }
  }, [estudiante]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setValidationErrors({}); 
  };

  const validateForm = () => {
    const errors = {};
    if (!form.nombre?.trim()) errors.nombre = "Nombre es obligatorio.";
    if (!form.apellidoPaterno?.trim()) errors.apellidoPaterno = "Apellido Paterno es obligatorio.";
    if (!/^\d{8}$/.test(form.dni || '')) errors.dni = "DNI requiere 8 dígitos.";
    if (!/^\d{9}$/.test(form.celular || '')) errors.celular = "Celular requiere 9 dígitos.";
    if (!form.fechaNacimiento) errors.fechaNacimiento = "Fecha es obligatoria.";
    if (!isEditMode && !form.password) errors.password = "Contraseña es obligatoria para la creación.";
    if (form.telefonoApoderado && !/^\d{9}$/.test(form.telefonoApoderado)) {
        errors.telefonoApoderado = "Teléfono de apoderado requiere 9 dígitos.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
        setError("Por favor, corrige los errores de validación en el formulario.");
        return;
    }

    setLoading(true);

    try {
        const successMessage = isEditMode ? "actualizado" : "creado";
        
        if (isEditMode) {
            const dataToSend = form.password ? form : (({ password, ...rest }) => rest)(form);
            await updateEstudiante(estudiante.usuario.id, dataToSend);
        } else {
            await createEstudiante(form);
        }
        
        alert(`Estudiante ${successMessage} correctamente.`);
        onSuccess();
        onClose();
    } catch (err) {
      console.error("Error en la operación:", err);
      setError(err.response?.data?.error || "Error de conexión o datos duplicados (DNI/Correo).");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="estudiante-modal-overlay">
      <div className="estudiante-modal-content">
        <h3 className="estudiante-modal-title mb-4">
          {isEditMode ? "Editar Perfil de Estudiante" : "Añadir Nuevo Estudiante"}
        </h3>
        
        {error && <div className="alert alert-danger mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="estudiante-form-grid">
          
          {/* Nombre */}
          <div className="mb-3">
            <input 
              name="nombre" 
              placeholder="Nombre" 
              value={form.nombre || ""} 
              onChange={handleChange} 
              required 
              className={`form-control estudiante-form-input ${validationErrors.nombre ? 'is-invalid' : ''}`} 
            />
            {validationErrors.nombre && <div className="invalid-feedback d-block">{validationErrors.nombre}</div>}
          </div>

          {/* Apellido Paterno */}
          <div className="mb-3">
            <input 
              name="apellidoPaterno" 
              placeholder="Apellido Paterno" 
              value={form.apellidoPaterno || ""} 
              onChange={handleChange} 
              required 
              className={`form-control estudiante-form-input ${validationErrors.apellidoPaterno ? 'is-invalid' : ''}`} 
            />
            {validationErrors.apellidoPaterno && <div className="invalid-feedback d-block">{validationErrors.apellidoPaterno}</div>}
          </div>
          
          {/* Apellido Materno */}
          <div className="mb-3">
            <input 
              name="apellidoMaterno" 
              placeholder="Apellido Materno" 
              value={form.apellidoMaterno || ""} 
              onChange={handleChange} 
              required 
              className="form-control estudiante-form-input" 
            />
          </div>

          {/* DNI */}
          <div className="mb-3">
            <input 
              name="dni" 
              placeholder="DNI" 
              value={form.dni || ""} 
              onChange={handleChange} 
              required 
              maxLength={8} 
              className={`form-control estudiante-form-input ${validationErrors.dni ? 'is-invalid' : ''}`} 
            />
            {validationErrors.dni && <div className="invalid-feedback d-block">{validationErrors.dni}</div>}
          </div>
          
          {/* Correo */}
          <div className="mb-3" style={{gridColumn: 'span 2'}}>
            <input 
              name="correo" 
              type="email" 
              placeholder="Correo" 
              value={form.correo || ""} 
              onChange={handleChange} 
              required 
              className="form-control estudiante-form-input" 
            />
          </div>
          
          {/* Celular */}
          <div className="mb-3" style={{gridColumn: 'span 2'}}>
            <input 
              name="celular" 
              placeholder="Celular (9 dígitos)" 
              value={form.celular || ""} 
              onChange={handleChange} 
              required 
              maxLength={9} 
              className={`form-control estudiante-form-input ${validationErrors.celular ? 'is-invalid' : ''}`} 
            />
            {validationErrors.celular && <div className="invalid-feedback d-block">{validationErrors.celular}</div>}
          </div>

          {/* Fecha Nacimiento */}
          <div className="mb-3">
            <label className="form-label estudiante-form-label">Fecha Nacimiento:</label>
            <input 
              name="fechaNacimiento" 
              type="date" 
              value={form.fechaNacimiento || ""} 
              onChange={handleChange} 
              required 
              className={`form-control estudiante-form-input ${validationErrors.fechaNacimiento ? 'is-invalid' : ''}`} 
            />
            {validationErrors.fechaNacimiento && <div className="invalid-feedback d-block">{validationErrors.fechaNacimiento}</div>}
          </div>
          
          {/* Nombre Apoderado */}
          <div className="mb-3">
            <input 
              name="nombreApoderado" 
              placeholder="Nombre Apoderado" 
              value={form.nombreApoderado || ""} 
              onChange={handleChange} 
              className="form-control estudiante-form-input" 
            />
          </div>
          
          {/* Teléfono Apoderado */}
          <div className="mb-3" style={{gridColumn: 'span 2'}}>
            <input 
              name="telefonoApoderado" 
              placeholder="Teléfono Apoderado (Opcional)" 
              value={form.telefonoApoderado || ""} 
              onChange={handleChange} 
              maxLength={9} 
              className={`form-control estudiante-form-input ${validationErrors.telefonoApoderado ? 'is-invalid' : ''}`} 
            />
            {validationErrors.telefonoApoderado && <div className="invalid-feedback d-block">{validationErrors.telefonoApoderado}</div>}
          </div>

          {/* Contraseña */}
          <div className="mb-3" style={{gridColumn: 'span 2'}}>
            <input 
              name="password" 
              type="password" 
              placeholder={isEditMode ? "Nueva Contraseña (Dejar vacío)" : "Contraseña (Obligatoria)"} 
              value={form.password || ""} 
              onChange={handleChange} 
              required={!isEditMode} 
              className={`form-control estudiante-form-input ${validationErrors.password ? 'is-invalid' : ''}`} 
            />
            {validationErrors.password && <div className="invalid-feedback d-block">{validationErrors.password}</div>}
          </div>

          {/* Botones */}
          <div className="estudiante-form-buttons d-flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="btn estudiante-btn-cancel flex-fill">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn estudiante-btn-submit flex-fill">
              {loading ? "Guardando..." : (isEditMode ? "Guardar Cambios" : "Crear Estudiante")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
