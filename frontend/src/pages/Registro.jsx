import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    apellidoP: "",
    apellidoM: "",
    correo: "",
    password: "",
  });
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      setMensaje("✅ Registro exitoso, ahora inicia sesión");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al registrarse");
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="registro-form">
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <input
          placeholder="Apellido Paterno"
          value={form.apellidoP}
          onChange={(e) => setForm({ ...form, apellidoP: e.target.value })}
          required
        />
        <input
          placeholder="Apellido Materno"
          value={form.apellidoM}
          onChange={(e) => setForm({ ...form, apellidoM: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button type="submit">Registrarse</button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      <p>
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="link-login">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
