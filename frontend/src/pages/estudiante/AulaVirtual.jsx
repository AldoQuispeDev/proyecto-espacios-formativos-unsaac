import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import "./AulaVirtual.css";

export default function AulaVirtual() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [estudiante, setEstudiante] = useState(null);

  useEffect(() => {
    if (!user || user.rol !== "ESTUDIANTE") {
      navigate("/login");
      return;
    }
    
    // Simular carga de datos
    setTimeout(() => {
      setEstudiante({
        nombre: user.nombre || "Estudiante",
        email: user.email,
      });
      setLoading(false);
    }, 500);
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="aula-loading">
        <div className="spinner"></div>
        <p>Cargando tu aula virtual...</p>
      </div>
    );
  }

  return (
    <div className="aula-virtual-container">
      <header className="aula-header">
        <div className="header-content">
          <h1><Icon name="mortarboard" size="lg" /> Mi Aula Virtual</h1>
          <div className="user-info">
            <span>Bienvenido, {estudiante?.nombre}</span>
            <button 
              className="btn-logout"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="aula-content">
        <div className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-icon"><Icon name="emoji-smile" size="xl" /></div>
            <h2>¡Bienvenido a tu Aula Virtual!</h2>
            <p>Tu matrícula ha sido aprobada exitosamente.</p>
            <p className="email-info"><Icon name="envelope" size="sm" /> {estudiante?.email}</p>
          </div>
        </div>

        <div className="modules-grid">
          <div className="module-card">
            <div className="module-icon"><Icon name="book" size="xl" /></div>
            <h3>Mis Cursos</h3>
            <p>Accede a tus materiales de estudio</p>
            <button className="btn-module">Próximamente</button>
          </div>

          <div className="module-card">
            <div className="module-icon"><Icon name="calendar3" size="xl" /></div>
            <h3>Horarios</h3>
            <p>Consulta tu horario de clases</p>
            <button className="btn-module">Próximamente</button>
          </div>

          <div className="module-card">
            <div className="module-icon"><Icon name="person-video3" size="xl" /></div>
            <h3>Docentes</h3>
            <p>Información de tus profesores</p>
            <button className="btn-module">Próximamente</button>
          </div>

          <div className="module-card">
            <div className="module-icon"><Icon name="bar-chart" size="xl" /></div>
            <h3>Calificaciones</h3>
            <p>Revisa tus notas y progreso</p>
            <button className="btn-module">Próximamente</button>
          </div>

          <div className="module-card">
            <div className="module-icon"><Icon name="file-text" size="xl" /></div>
            <h3>Tareas</h3>
            <p>Entrega tus trabajos</p>
            <button className="btn-module">Próximamente</button>
          </div>

          <div className="module-card">
            <div className="module-icon"><Icon name="chat-dots" size="xl" /></div>
            <h3>Mensajes</h3>
            <p>Comunícate con tus profesores</p>
            <button className="btn-module">Próximamente</button>
          </div>
        </div>
      </main>
    </div>
  );
}
