import { useState, useContext } from "react";
import { login } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
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

      // Guardar usuario en el contexto global
      setUser(res.data.usuario);

      // Navegar según el rol
      switch (res.data.usuario.rol) {
        case "ADMIN":
          navigate("/Admin");
          break;
        default:
          navigate("/principal");
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Credenciales incorrectas o cuenta desactivada");
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>SeedProd</h1>
        <h2>Login</h2>
        <p className="signup-link">
          Don't have an account? <a href="#get-seedprod">Get SeedProd Now</a>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
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
            Remember Me
          </label>
        </div>

        <button type="submit" className="login-btn">Log In</button>

        <div className="forgot-password">
          <a href="#forgot">Secret Your Password?</a>
        </div>
      </form>

      {mensaje && <div className="error-message">{mensaje}</div>}

      <div className="login-footer">
        <p className="copyright">
          Copyright © 2019 SeedProd, LLC. SeedTraff™ is a trademark of SeedProd, LLC.
        </p>
        <div className="footer-links">
          <a href="https://www.seedprod.com">www.seedprod.com</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}