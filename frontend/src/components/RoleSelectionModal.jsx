import { useNavigate } from "react-router-dom";
import "./RoleSelectionModal.css";

export default function RoleSelectionModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRoleSelection = (role) => {
    onClose();
    navigate("/login", { state: { selectedRole: role } });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">
          ×
        </button>

        <div className="modal-header">
          <h2>Selecciona tu perfil</h2>
          <p>Elige cómo deseas ingresar al sistema</p>
        </div>

        <div className="modal-body">
          <button
            className="role-card role-student"
            onClick={() => handleRoleSelection("ESTUDIANTE")}
          >
            <div className="role-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z"/>
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </div>
            <h3>Estudiante</h3>
            <p>Accede a tus clases, materiales y matrícula</p>
          </button>

          <button
            className="role-card role-teacher"
            onClick={() => handleRoleSelection("DOCENTE")}
          >
            <div className="role-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
            <h3>Docente</h3>
            <p>Gestiona tus clases, horarios y estudiantes</p>
          </button>

          <button
            className="role-card role-admin"
            onClick={() => handleRoleSelection("ADMIN")}
          >
            <div className="role-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            </div>
            <h3>Administrador</h3>
            <p>Gestiona usuarios, matrículas y configuración</p>
          </button>
        </div>
      </div>
    </div>
  );
}
