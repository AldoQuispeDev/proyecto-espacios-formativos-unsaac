import React, { useState, useEffect } from "react";
import "./PasoDatosPersonales.css";
// ⚠️ IMPORTAR CLIENTES API NECESARIOS
import { getDatosPersonales, updateDatosPersonales } from "../api/usuario"; 

export default function PasoDatosPersonales({ formData, setFormData, onNext }) {
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // ==========================================================
  // 1. LÓGICA DE CARGA INICIAL (GET)
  // ==========================================================
  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true);
      try {
        const res = await getDatosPersonales();
        const user = res.data;
        
        // Formatear la fecha para el input type="date" (YYYY-MM-DD)
        const fechaNacimiento = user.estudiante?.fechaNacimiento 
            ? user.estudiante.fechaNacimiento.substring(0, 10) 
            : "";
        
        // Mapear los datos de Usuario a los campos del formulario
        setFormData(prevData => ({
          ...prevData,
          nombre: user.nombre || "",
          apellidoPaterno: user.apellidoPaterno || "",
          apellidoMaterno: user.apellidoMaterno || "",
          dni: user.dni || "",
          telefono: user.celular || "", // Asumiendo que 'celular' es 'telefono'
          fechaNacimiento: fechaNacimiento,
          // Los campos de apoderado mantienen su estado si ya fueron llenados
        }));

      } catch (error) {
        console.error("Error al cargar datos de Usuario:", error);
        setMensaje("❌ Error al cargar tus datos iniciales.");
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, [setFormData]); // Dependencia del setter para evitar warnings, se ejecuta solo al montar

  // ==========================================================
  // 2. LÓGICA DE VALIDACIÓN
  // ==========================================================
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
        if (!value) error = "Campo obligatorio";
        else if (new Date(value) > new Date())
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
    setMensaje(""); // Limpiar mensajes al escribir
  };

  // ==========================================================
  // 3. LÓGICA DE SUBMIT (ACTUALIZACIÓN PUT)
  // ==========================================================
  const formValido =
    Object.values(errores).every((e) => !e) &&
    formData.nombre &&
    formData.apellidoPaterno &&
    formData.apellidoMaterno &&
    formData.dni &&
    formData.fechaNacimiento &&
    formData.telefono;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValido) {
        setMensaje("❌ Por favor, revisa y completa todos los campos obligatorios.");
        return;
    }
    
    setLoading(true);
    setMensaje("Guardando cambios y validando...");
    
    try {
        // 1. Preparar los datos que se actualizarán en la tabla Usuario y Estudiante
        const datosUsuarioAActualizar = {
            nombre: formData.nombre,
            apellidoPaterno: formData.apellidoPaterno,
            apellidoMaterno: formData.apellidoMaterno,
            dni: formData.dni,
            celular: formData.telefono, 
            fechaNacimiento: formData.fechaNacimiento, // El servicio lo usa para Estudiante
        };

        // 2. Ejecutar la actualización (PUT)
        await updateDatosPersonales(datosUsuarioAActualizar);
        
        // 3. Si la actualización fue exitosa, avanzamos
        setMensaje("✅ Datos personales validados y actualizados. Continuamos.");
        setTimeout(() => onNext(), 500);

    } catch (error) {
        console.error("Error al validar y actualizar tus datos:", error);
        setMensaje("❌ Error al actualizar los datos personales. Verifica tu DNI o inténtalo más tarde.");
    } finally {
        setLoading(false);
    }
  };

  // ==========================================================
  // 4. RENDERIZADO
  // ==========================================================
  if (loading) {
    return (
        <div className="step-container">
            <h2>Datos Personales del Estudiante</h2>
            <p className="subtitle">Cargando datos del perfil...</p>
            <div className="loading-spinner"></div>
        </div>
    );
  }

  return (
    <div className="step-container">
      <h2>Datos Personales del Estudiante</h2>
      <p className="subtitle">
        Verifica y actualiza tus datos antes de continuar con la matrícula. Estos datos serán los oficiales.
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
          {errores.fechaNacimiento && (
            <span className="error-text">{errores.fechaNacimiento}</span>
          )}
        </div>

        {/* Teléfonos */}
        <div className="form-group">
          <label>Teléfono del estudiante (Celular):</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono || ""}
            onChange={handleChange}
            className={errores.telefono ? "error" : "success"}
            required
            disabled={loading}
          />
          {errores.telefono && (
            <span className="error-text">{errores.telefono}</span>
          )}
        </div>

        {/* Apoderados (Opcional) */}
        <div className="form-group">
          <label>Nombre del apoderado (opcional):</label>
          <input
            type="text"
            name="nombreApoderado"
            value={formData.nombreApoderado || ""}
            onChange={handleChange}
            className="success"
            disabled={loading}
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
            disabled={loading}
          />
          {errores.telefonoApoderado && (
            <span className="error-text">{errores.telefonoApoderado}</span>
          )}
        </div>

        {/* Mensaje de estado */}
        {mensaje && (
            <div className={`message ${mensaje.startsWith("✅") ? 'success' : 'error'}`}>
                {mensaje}
            </div>
        )}

        {/* Botón siguiente */}
        <div className="button-container">
          <button
            type="submit"
            className="btn-next"
            disabled={!formValido || loading}
          >
            {loading ? 'Validando...' : 'Siguiente →'}
          </button>
        </div>
      </form>
    </div>
  );
}