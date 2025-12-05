// src/components/DocenteFormModal.jsx
import "./DocenteFormModal.css";
import React, { useState, useEffect } from "react";
import { createDocente, updateDocente } from "../api/docentes";

const initialFormState = {
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  dni: "",
  correo: "",
  celular: "",
  especialidad: "",
  titulo: "",
  password: "",
};

export default function DocenteFormModal({ isOpen, onClose, onSuccess, docente }) {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEditMode = !!docente;

  // 1. Cargar datos si es modo edición
  useEffect(() => {
    if (docente) {
      setForm({
        nombre: docente.usuario.nombre,
        apellidoPaterno: docente.usuario.apellidoPaterno,
        apellidoMaterno: docente.usuario.apellidoMaterno,
        dni: docente.usuario.dni,
        correo: docente.usuario.correo,
        celular: docente.usuario.celular || "",
        especialidad: docente.especialidad || "",
        titulo: docente.titulo || "",
        password: "", 
      });
    } else {
      setForm(initialFormState);
    }
  }, [docente]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isEditMode) {
        // En edición, no enviar password si está vacío
        const dataToSend = form.password 
          ? form 
          : (({ password, ...rest }) => rest)(form);
          
        await updateDocente(docente.usuario.id, dataToSend);
      } else {
        await createDocente(form);
      }

      onSuccess(); 
      onClose();  
    } catch (err) {
      console.error("Error en la operación:", err.response?.data?.error || err);
      setError(err.response?.data?.error || "Error de conexión o datos duplicados (DNI/Correo).");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="docente-modal-overlay">
      <div className="docente-modal-content">
        <h3 className="docente-modal-title mb-4">{isEditMode ? "Editar Docente" : "Crear Nuevo Docente"}</h3>
        
        {error && <div className="alert alert-danger mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="docente-form-grid">
          
          {/* Datos del Usuario (Comunes) */}
          <div className="mb-3">
            <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="form-control docente-form-input" />
          </div>
          <div className="mb-3">
            <input name="apellidoPaterno" placeholder="Apellido Paterno" value={form.apellidoPaterno} onChange={handleChange} required className="form-control docente-form-input" />
          </div>
          <div className="mb-3">
            <input name="apellidoMaterno" placeholder="Apellido Materno" value={form.apellidoMaterno} onChange={handleChange} required className="form-control docente-form-input" />
          </div>
          <div className="mb-3">
            <input name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} required maxLength={8} className="form-control docente-form-input" />
          </div>
          <div className="mb-3" style={{gridColumn: 'span 2'}}>
            <input name="correo" type="email" placeholder="Correo" value={form.correo} onChange={handleChange} required className="form-control docente-form-input" disabled={isEditMode} />
          </div>
          <div className="mb-3" style={{gridColumn: 'span 2'}}>
            <input name="celular" placeholder="Celular (9 dígitos)" value={form.celular} onChange={handleChange} required maxLength={9} className="form-control docente-form-input" />
          </div>
          
          {/* Datos del Docente (Específicos) */}
          <div className="mb-3">
            <input name="especialidad" placeholder="Especialidad (Ej: Matemáticas)" value={form.especialidad} onChange={handleChange} className="form-control docente-form-input" required />
          </div>
          <div className="mb-3">
            <input name="titulo" placeholder="Título académico (Opcional)" value={form.titulo} onChange={handleChange} className="form-control docente-form-input" />
          </div>

          {/* Contraseña */}
          <div className="mb-3" style={{gridColumn: 'span 2'}}>
            <input name="password" type="password" placeholder={isEditMode ? "Nueva Contraseña (Dejar vacío para no cambiar)" : "Contraseña"} value={form.password} onChange={handleChange} required={!isEditMode} className="form-control docente-form-input" />
          </div>

          {/* Botones */}
          <div className="docente-form-buttons d-flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="btn docente-btn-cancel flex-fill">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn docente-btn-submit flex-fill">
              {loading ? "Guardando..." : (isEditMode ? "Guardar Cambios" : "Crear Docente")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
