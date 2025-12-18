// src/components/DocenteHeader.jsx

import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./DocenteHeader.css";

export default function DocenteHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, cerrarSesion } = useContext(AuthContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/docente', icon: '🏠' },
    { name: 'Mis Horarios', path: '/docente/horarios', icon: '📅' },
    { name: 'Mis Estudiantes', path: '/docente/estudiantes', icon: '🎓' },
    { name: 'Mi Perfil', path: '/docente/perfil', icon: '👤' },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    cerrarSesion();
    navigate("/");
  };

  return (
    <header className="docente-header">
      <div className="docente-header-content">
        {/* LOGO */}
        <div className="header-brand" onClick={() => navigate("/docente")}>
          <div className="brand-logo">👨‍🏫</div>
          <div className="brand-info">
            <h1 className="brand-title">Panel de Docente</h1>
            <p className="brand-subtitle">Academia Pre UNSAAC</p>
          </div>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="header-nav">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-text">{link.name}</span>
            </button>
          ))}
        </nav>

        {/* USUARIO */}
        <div className="header-actions">
          <div className="user-menu-container">
            <button
              className="btn-user-menu"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                <span className="avatar-icon">👨‍🏫</span>
              </div>
              <div className="user-info">
                <span className="user-name">{user?.nombre || "Docente"}</span>
                <span className="user-role">Profesor</span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-avatar-large">👨‍🏫</div>
                  <div className="user-details">
                    <p className="user-fullname">
                      {user?.nombre} {user?.apellidoPaterno}
                    </p>
                    <p className="user-email">{user?.correo}</p>
                  </div>
                </div>
                <div className="user-dropdown-menu">
                  <button className="menu-item" onClick={() => navigate("/docente/perfil")}>
                    <span className="menu-icon">👤</span>
                    Mi Perfil
                  </button>
                  <div className="menu-divider"></div>
                  <button className="menu-item logout" onClick={handleLogout}>
                    <span className="menu-icon">🚪</span>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
