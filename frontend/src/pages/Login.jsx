import { useState, useContext } from "react";
import { login } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Icon from "../components/Icon";
import "./Login.css";

export default function Login() {
  const location = useLocation();
  const selectedRole = location.state?.selectedRole;
  
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ correo, password });
      const usuario = res.data.usuario;

      // Validar que el rol del usuario coincida con el seleccionado
      if (selectedRole && usuario.rol !== selectedRole) {
        setMensaje(`Esta cuenta no tiene permisos de ${selectedRole === "ADMIN" ? "Administrador" : "Alumno"}`);
        return;
      }

      // Guardar usuario en el contexto global
      setUser(usuario);

      // Navegar según el rol
      switch (usuario.rol) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "ESTUDIANTE":
          navigate("/estudiante/aula");
          break;
        case "DOCENTE":
          navigate("/docente/panel");
          break;
        default:
          navigate("/principal");
      }
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Respuesta del servidor:", error.response?.data);
      const errorMsg = error.response?.data?.error || "Credenciales incorrectas o cuenta desactivada";
      setMensaje(errorMsg);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="login-container">
      <button className="login-close-btn" onClick={handleClose} aria-label="Cerrar">
        ×
      </button>
      <div className="login-header">
        <h1>Academia Preuniversitaria</h1>
        <h2>Iniciar Sesión</h2>
        {selectedRole && (
          <div className="role-badge">
            {selectedRole === "ADMIN" ? (
              <>
                <Icon name="person-badge" size="md" /> Administrador
              </>
            ) : (
              <>
                <Icon name="mortarboard" size="md" /> Alumno
              </>
            )}
          </div>
        )}
        {selectedRole === "ESTUDIANTE" && (
          <div className="info-box">
            <p className="info-text">
              <strong><Icon name="envelope" size="sm" /> Correo:</strong> El que usaste al matricularte<br/>
              <strong><Icon name="key" size="sm" /> Contraseña:</strong> Tu número de DNI
            </p>
          </div>
        )}
        {!selectedRole && (
          <p className="signup-link">
            ¿No tienes una cuenta?{" "}
            <Link to="/registro" className="register-link">
              Regístrate aquí
            </Link>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="checkmark"></span>
            Recuérdame
          </label>
        </div>

        <button type="submit" className="login-btn">Iniciar Sesión</button>

        <div className="forgot-password">
          <a href="#forgot">¿Olvidaste tu contraseña?</a>
        </div>
      </form>

      {mensaje && <div className="error-message">{mensaje}</div>}

      <div className="login-footer">
        <p className="copyright">
          © {new Date().getFullYear()} Academia Preuniversitaria - Todos los derechos reservados.
        </p>
        <div className="footer-links">
          <a href="#privacy">Política de privacidad</a>
        </div>
      </div>
    </div>
  );
}
