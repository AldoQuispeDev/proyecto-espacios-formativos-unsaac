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
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // 🔍 Validación de cada campo
  const validarCampo = (name, value) => {
    let error = "";

    switch (name) {
      case "nombre":
      case "apellidoP":
      case "apellidoM":
        if (!value.trim()) error = "Campo obligatorio";
        break;

      case "dni":
        if (!/^\d{8}$/.test(value)) error = "Debe tener 8 dígitos numéricos";
        break;

      case "celular":
        if (value && !/^\d{9}$/.test(value))
          error = "Debe tener 9 dígitos numéricos";
        break;

      case "nacimiento":
        if (value && new Date(value) > new Date())
          error = "La fecha no puede ser futura";
        break;

      case "correo":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Correo no válido";
        break;

      case "password":
        if (value.length < 8)
          error = "Debe tener al menos 8 caracteres";
        break;

      default:
        break;
    }

    setErrores((prev) => ({ ...prev, [name]: error }));
  };

  // 🧠 Al escribir, validar en tiempo real
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validarCampo(name, value);
  };

  const formValido = () => {
    return Object.values(form).every((v) => v.trim() !== "") &&
           Object.values(errores).every((v) => !v);
  };

  // 🚀 Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos antes de enviar
    Object.entries(form).forEach(([name, value]) => validarCampo(name, value));

    if (!formValido()) {
      setMensaje("❌ Corrige los campos marcados en rojo");
      return;
    }

    try {
      await register(form);
      setMensaje("✅ Registro exitoso, ahora inicia sesión");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al registrarse o correo ya existente");
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro de Usuario</h2>

      <form onSubmit={handleSubmit} className="registro-form" noValidate>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className={errores.nombre ? "error" : "success"}
          required
        />
        {errores.nombre && <span className="error-text">{errores.nombre}</span>}

        <input
          name="apellidoP"
          placeholder="Apellido Paterno"
          value={form.apellidoP}
          onChange={handleChange}
          className={errores.apellidoP ? "error" : "success"}
          required
        />
        {errores.apellidoP && (
          <span className="error-text">{errores.apellidoP}</span>
        )}

        <input
          name="apellidoM"
          placeholder="Apellido Materno"
          value={form.apellidoM}
          onChange={handleChange}
          className={errores.apellidoM ? "error" : "success"}
          required
        />
        {errores.apellidoM && (
          <span className="error-text">{errores.apellidoM}</span>
        )}

        <input
          name="dni"
          placeholder="DNI (8 dígitos)"
          value={form.dni}
          onChange={handleChange}
          className={errores.dni ? "error" : "success"}
          required
        />
        {errores.dni && <span className="error-text">{errores.dni}</span>}

        <input
          name="celular"
          placeholder="Celular (9 dígitos)"
          value={form.celular}
          onChange={handleChange}
          className={errores.celular ? "error" : "success"}
        />
        {errores.celular && <span className="error-text">{errores.celular}</span>}

        <label>Fecha de Nacimiento:</label>
        <input
          name="nacimiento"
          type="date"
          value={form.nacimiento}
          onChange={handleChange}
          className={errores.nacimiento ? "error" : "success"}
        />
        {errores.nacimiento && (
          <span className="error-text">{errores.nacimiento}</span>
        )}

        <input
          name="correo"
          type="email"
          placeholder="Correo electrónico"
          value={form.correo}
          onChange={handleChange}
          className={errores.correo ? "error" : "success"}
          required
        />
        {errores.correo && <span className="error-text">{errores.correo}</span>}

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className={errores.password ? "error" : "success"}
          required
        />
        {errores.password && (
          <span className="error-text">{errores.password}</span>
        )}

        <button type="submit">Registrarse</button>
      </form>

      {mensaje && (
        <p
          className={
            mensaje.startsWith("✅") ? "success-message" : "error-message"
          }
        >
          {mensaje}
        </p>
      )}

      <p>
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="link-login">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
