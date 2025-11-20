// src/components/EstudianteFormModal.jsx (CÓDIGO COMPLETO Y FINAL)

import React, { useState, useEffect } from "react";
// 🛑 Importar ambas funciones: update y create
import { updateEstudiante, createEstudiante } from "../api/estudiantes"; 

// Función auxiliar para formatear la fecha
const formatFecha = (dateString) => {
    if (!dateString) return '';
    // Asegura que solo se toma la parte YYYY-MM-DD
    return dateString.substring(0, 10); 
};

// Estado inicial base para el formulario
const initialFormState = {
    nombre: "", apellidoPaterno: "", apellidoMaterno: "", dni: "", correo: "", 
    celular: "", fechaNacimiento: "", nombreApoderado: "", telefonoApoderado: "", 
    password: "",
};


export default function EstudianteFormModal({ isOpen, onClose, onSuccess, estudiante }) {
  const [form, setForm] = useState(initialFormState); // Inicializar con el estado base
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const isEditMode = !!estudiante; // 🛑 Detecta si estamos editando o creando

  // 1. Cargar datos del estudiante al abrir
  useEffect(() => {
    if (estudiante) {
      // Modo Edición: Cargar datos existentes
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
        // Modo Creación: Resetear a valores vacíos
        setForm(initialFormState);
    }
  }, [estudiante]); // Se re-ejecuta cuando el estudiante cambia (ej. al abrir el modal en modo 'Añadir')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setValidationErrors({}); 
  };

  // 🛑 Función de Validación Front-end
  const validateForm = () => {
    const errors = {};
    if (!form.nombre?.trim()) errors.nombre = "Nombre es obligatorio.";
    if (!form.apellidoPaterno?.trim()) errors.apellidoPaterno = "Apellido Paterno es obligatorio.";
    if (!/^\d{8}$/.test(form.dni || '')) errors.dni = "DNI requiere 8 dígitos.";
    if (!/^\d{9}$/.test(form.celular || '')) errors.celular = "Celular requiere 9 dígitos.";
    if (!form.fechaNacimiento) errors.fechaNacimiento = "Fecha es obligatoria.";
    
    // Contraseña es obligatoria solo en CREACIÓN
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
        let response;
        const successMessage = isEditMode ? "actualizado" : "creado";
        
        if (isEditMode) {
            // 🛑 MODO EDICIÓN (PUT)
            // Filtramos la password si está vacía
            const dataToSend = form.password 
                ? form 
                : (({ password, ...rest }) => rest)(form);
            response = await updateEstudiante(estudiante.usuario.id, dataToSend);
        } else {
            // 🛑 MODO CREACIÓN (POST)
            response = await createEstudiante(form);
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
        <h3 className="text-xl font-bold mb-4">{isEditMode ? "Editar Perfil de Estudiante" : "Añadir Nuevo Estudiante"}</h3>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          
          {/* Datos del Usuario */}
          <div className="col-span-1">
            <input name="nombre" placeholder="Nombre" value={form.nombre || ""} onChange={handleChange} required className={`p-2 border rounded w-full ${validationErrors.nombre ? 'border-red-500' : 'border-gray-300'}`} />
            {validationErrors.nombre && <p className="text-red-500 text-xs mt-1">{validationErrors.nombre}</p>}
          </div>

          <div className="col-span-1">
            <input name="apellidoPaterno" placeholder="Apellido Paterno" value={form.apellidoPaterno || ""} onChange={handleChange} required className={`p-2 border rounded w-full ${validationErrors.apellidoPaterno ? 'border-red-500' : 'border-gray-300'}`} />
            {validationErrors.apellidoPaterno && <p className="text-red-500 text-xs mt-1">{validationErrors.apellidoPaterno}</p>}
          </div>
          
          <div className="col-span-1">
            <input name="apellidoMaterno" placeholder="Apellido Materno" value={form.apellidoMaterno || ""} onChange={handleChange} required className="p-2 border rounded w-full" />
          </div>

          <div className="col-span-1">
            <input name="dni" placeholder="DNI" value={form.dni || ""} onChange={handleChange} required maxLength={8} className={`p-2 border rounded w-full ${validationErrors.dni ? 'border-red-500' : 'border-gray-300'}`} />
            {validationErrors.dni && <p className="text-red-500 text-xs mt-1">{validationErrors.dni}</p>}
          </div>
          
          <input name="correo" type="email" placeholder="Correo" value={form.correo || ""} onChange={handleChange} required className="col-span-2 p-2 border rounded" />
          
          <div className="col-span-2">
            <input name="celular" placeholder="Celular (9 dígitos)" value={form.celular || ""} onChange={handleChange} required maxLength={9} className={`p-2 border rounded w-full ${validationErrors.celular ? 'border-red-500' : 'border-gray-300'}`} />
            {validationErrors.celular && <p className="text-red-500 text-xs mt-1">{validationErrors.celular}</p>}
          </div>

          
          {/* Datos del Estudiante */}
          <label className="col-span-1">Fecha Nacimiento:
            <input name="fechaNacimiento" type="date" value={form.fechaNacimiento || ""} onChange={handleChange} required className={`p-2 border rounded w-full ${validationErrors.fechaNacimiento ? 'border-red-500' : 'border-gray-300'}`} />
             {validationErrors.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{validationErrors.fechaNacimiento}</p>}
          </label>
          
          <input name="nombreApoderado" placeholder="Nombre Apoderado" value={form.nombreApoderado || ""} onChange={handleChange} className="col-span-1 p-2 border rounded" />
          
          <div className="col-span-2">
            <input name="telefonoApoderado" placeholder="Teléfono Apoderado (Opcional)" value={form.telefonoApoderado || ""} onChange={handleChange} maxLength={9} className={`p-2 border rounded w-full ${validationErrors.telefonoApoderado ? 'border-red-500' : 'border-gray-300'}`} />
            {validationErrors.telefonoApoderado && <p className="text-red-500 text-xs mt-1">{validationErrors.telefonoApoderado}</p>}
          </div>


          {/* Contraseña */}
          <div className="col-span-2">
            <input 
                name="password" 
                type="password" 
                placeholder={isEditMode ? "Nueva Contraseña (Dejar vacío)" : "Contraseña (Obligatoria)"} 
                value={form.password || ""} 
                onChange={handleChange} 
                // 🛑 Contraseña es obligatoria en modo CREACIÓN
                required={!isEditMode} 
                className={`p-2 border rounded w-full ${validationErrors.password ? 'border-red-500' : 'border-gray-300'}`} 
            />
            {validationErrors.password && <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>}
          </div>

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? "Guardando..." : (isEditMode ? "Guardar Cambios" : "Crear Estudiante")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}