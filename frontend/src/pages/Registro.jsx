import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import "./Registro.css";

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    apellidoP: "",
    apellidoM: "",
    dni: "",
    celular: "",
    nacimiento: "",
    correo: "",
    password: "",
    rol: "ESTUDIANTE", // Valor por defecto
    especialidad: "", // Solo para docentes
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    
    // Validacion simple frontend
    if(form.dni.length !== 8) {
        setMensaje("El DNI debe tener 8 dígitos");
        return;
    }

    try {
      await register(form);
      setMensaje("✅ Registro exitoso. Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      setMensaje("❌ " + (error.response?.data?.error || "Error al registrarse"));
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2>Crear Cuenta</h2>
        <p>Únete a nuestra comunidad académica</p>

        <form onSubmit={handleSubmit} className="registro-form">
            
          {/* SELECTOR DE TIPO DE USUARIO */}
          <div className="form-group-full">
            <label>Quiero registrarme como:</label>
            <div className="rol-selector">
                <label>
                    <input 
                        type="radio" 
                        name="rol" 
                        value="ESTUDIANTE" 
                        checked={form.rol === "ESTUDIANTE"} 
                        onChange={handleChange}
                    /> Estudiante
                </label>
                <label>
                    <input 
                        type="radio" 
                        name="rol" 
                        value="DOCENTE" 
                        checked={form.rol === "DOCENTE"} 
                        onChange={handleChange}
                    /> Docente
                </label>
            </div>
          </div>

          <div className="grid-2">
              <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
              <input name="apellidoP" placeholder="Apellido Paterno" onChange={handleChange} required />
              <input name="apellidoM" placeholder="Apellido Materno" onChange={handleChange} required />
              <input name="dni" placeholder="DNI" onChange={handleChange} required maxLength={8} />
          </div>

          <input name="celular" placeholder="Celular" onChange={handleChange} required maxLength={9} />
          <input name="correo" type="email" placeholder="Correo Electrónico" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />

          {/* CAMPOS DINÁMICOS SEGÚN ROL */}
          {form.rol === "ESTUDIANTE" && (
              <div className="campo-condicional">
                  <label>Fecha de Nacimiento:</label>
                  <input name="nacimiento" type="date" onChange={handleChange} required />
              </div>
          )}

          {form.rol === "DOCENTE" && (
              <div className="campo-condicional">
                  <input name="especialidad" placeholder="Especialidad (Ej. Matemáticas)" onChange={handleChange} required />
              </div>
          )}

          <button type="submit" className="btn-submit">Registrarse</button>
        </form>

        {mensaje && <div className="mensaje-alerta">{mensaje}</div>}

        <p className="login-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}