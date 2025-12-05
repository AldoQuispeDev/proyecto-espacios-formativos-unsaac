// src/components/Layout.jsx
import "./Layout.css";

export default function Layout({ title, children, onLogout, onBack, fullWidth = false }) {
  return (
    <div className="layout-container">

      {/* ENCABEZADO */}
      <header className="layout-header">
        <h1 className="layout-title">{title}</h1>

        <div className="layout-header-buttons">
          {onBack && (
            <button
              onClick={onBack}
              className="layout-btn-back"
            >
              ← Retroceder
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="layout-btn-logout"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </header>

      {/* CONTENIDO */}
      <main className={`layout-main ${!fullWidth ? 'layout-main-card' : ''}`}>
        {children}
      </main>

      {/* FOOTER */}
      <footer className="layout-footer">
        Sistema de Matrículas © {new Date().getFullYear()} — Academia Preuniversitaria
      </footer>

    </div>
  );
}
