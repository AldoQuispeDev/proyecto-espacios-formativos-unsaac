// src/components/DocenteFormModal.jsx

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4">{isEditMode ? "Editar Docente" : "Crear Nuevo Docente"}</h3>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          
          {/* Datos del Usuario (Comunes) */}
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="col-span-1 p-2 border rounded" />
          <input name="apellidoPaterno" placeholder="Apellido Paterno" value={form.apellidoPaterno} onChange={handleChange} required className="col-span-1 p-2 border rounded" />
          <input name="apellidoMaterno" placeholder="Apellido Materno" value={form.apellidoMaterno} onChange={handleChange} required className="col-span-1 p-2 border rounded" />
          <input name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} required maxLength={8} className="col-span-1 p-2 border rounded" />
          <input name="correo" type="email" placeholder="Correo" value={form.correo} onChange={handleChange} required className="col-span-2 p-2 border rounded" disabled={isEditMode} />
          <input name="celular" placeholder="Celular (9 dígitos)" value={form.celular} onChange={handleChange} required maxLength={9} className="col-span-2 p-2 border rounded" />
          
          {/* Datos del Docente (Específicos) */}
          <input name="especialidad" placeholder="Especialidad (Ej: Matemáticas)" value={form.especialidad} onChange={handleChange} className="col-span-1 p-2 border rounded" required />
          <input name="titulo" placeholder="Título académico (Opcional)" value={form.titulo} onChange={handleChange} className="col-span-1 p-2 border rounded" />

          {/* Contraseña */}
          <div className="col-span-2">
            <input name="password" type="password" placeholder={isEditMode ? "Nueva Contraseña (Dejar vacío para no cambiar)" : "Contraseña"} value={form.password} onChange={handleChange} required={!isEditMode} className="p-2 border rounded w-full" />
          </div>

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? "Guardando..." : (isEditMode ? "Guardar Cambios" : "Crear Docente")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}