import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Registro.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Registro() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // success, error, warning
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setTipoMensaje("");

    // Validaciones frontend
    if (!correo || !password || !confirmPassword) {
      setMensaje("Por favor completa todos los campos");
      setTipoMensaje("error");
      return;
    }

    if (password !== confirmPassword) {
      setMensaje("Las contraseñas no coinciden");
      setTipoMensaje("error");
      return;
    }

    if (password.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres");
      setTipoMensaje("error");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/auth/registro-estudiante`,
        { correo, password },
        { withCredentials: true }
      );

      setMensaje("✅ " + response.data.message);
      setTipoMensaje("success");

      // Redirigir al aula virtual después de 1.5 segundos
      setTimeout(() => {
        navigate("/estudiante/aula");
      }, 1500);
    } catch (error) {
      console.error("Error en registro:", error);
      const errorMsg = error.response?.data?.error || "Error al registrarse";
      const status = error.response?.status;

      if (status === 404) {
        setMensaje("❌ No se encontró una matrícula con este correo");
        setTipoMensaje("error");
      } else if (status === 403) {
        setMensaje("⏳ Tu matrícula aún no ha sido aprobada. Por favor espera la validación del administrador.");
        setTipoMensaje("warning");
      } else if (status === 409) {
        setMensaje("❌ Este correo ya está registrado. Intenta iniciar sesión.");
        setTipoMensaje("error");
      } else {
        setMensaje("❌ " + errorMsg);
        setTipoMensaje("error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <div className="icon-circle">
            <span>🎓</span>
          </div>
          <h2>Registro de Estudiante</h2>
          <p>Ingresa con tu correo de matrícula aprobada</p>
        </div>

        <form onSubmit={handleSubmit} className="registro-form">
          <div className="form-group">
            <label htmlFor="correo">
              <span className="label-icon">📧</span>
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu-correo@ejemplo.com"
              required
              disabled={loading}
              autoComplete="email"
            />
            <small className="form-hint">
              Usa el mismo correo que registraste en tu matrícula
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <span className="label-icon">🔒</span>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <span className="label-icon">🔒</span>
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              required
              disabled={loading}
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {mensaje && (
            <div className={`mensaje-alerta ${tipoMensaje}`}>
              <span className="mensaje-texto">{mensaje}</span>
            </div>
          )}

          <button type="submit" className="btn-registrar" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Verificando...
              </>
            ) : (
              <>
                <span>✨</span>
                Crear Cuenta
              </>
            )}
          </button>
        </form>

        <div className="registro-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
          <p>
            ¿No te has matriculado? <Link to="/">Matricúlate aquí</Link>
          </p>
        </div>

        <div className="info-box">
          <span className="info-icon">ℹ️</span>
          <div>
            <strong>Importante:</strong>
            <p>Solo puedes registrarte si tu matrícula fue aprobada por el administrador.</p>
          </div>
        </div>
      </div>
    </div>
  );
}