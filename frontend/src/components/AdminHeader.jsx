// src/components/AdminHeader.jsx

import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Icon from "./Icon";
import "./AdminHeader.css";

export default function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, cerrarSesion } = useContext(AuthContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);

  // Menú de navegación
  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: 'house' },
    { name: 'Validar Matrículas', path: '/admin/validarMatricula', icon: 'file-text' },
    { name: 'Gestión de Docentes', path: '/admin/docentes', icon: 'person-video3' },
    { name: 'Gestión de Estudiantes', path: '/admin/estudiantes', icon: 'mortarboard' },
    { name: 'Gestión de Horarios', path: '/admin/horarios', icon: 'calendar3' },
    { name: 'Catálogos Académicos', path: '/admin/catalogos', icon: 'book' },
  ];

  const isActive = (path) => location.pathname === path;

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container') && 
          !event.target.closest('.notifications-container') &&
          !event.target.closest('.nav-menu-container')) {
        setShowUserMenu(false);
        setShowNotifications(false);
        setShowNavMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const formatTime = () => {
    return currentTime.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLogout = () => {
    cerrarSesion();
    navigate("/");
  };

  // Notificaciones de ejemplo (pueden venir del backend)
  const notifications = [
    { id: 1, type: "info", message: "3 nuevas matrículas pendientes", time: "Hace 5 min" },
    { id: 2, type: "success", message: "Horario actualizado correctamente", time: "Hace 1 hora" },
    { id: 3, type: "warning", message: "Revisar comprobantes rechazados", time: "Hace 2 horas" },
  ];

  const unreadCount = notifications.length;

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        {/* LOGO Y TÍTULO */}
        <div className="header-brand" onClick={() => navigate("/admin")}>
          <div className="brand-logo">
            <Icon name="mortarboard" size="xl" />
          </div>
          <div className="brand-info">
            <h1 className="brand-title">Academia Pre UNSAAC</h1>
            <p className="brand-subtitle">Panel de Admin</p>
          </div>
        </div>

        {/* CENTRO: MENÚ DE NAVEGACIÓN */}
        <nav className="header-nav">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              title={link.name}
            >
              <span className="nav-icon">
                <Icon name={link.icon} size="md" />
              </span>
              <span className="nav-text">{link.name}</span>
            </button>
          ))}
        </nav>

        {/* MENÚ MÓVIL (HAMBURGUESA) */}
        <div className="nav-menu-container">
          <button
            className="btn-nav-menu"
            onClick={() => setShowNavMenu(!showNavMenu)}
          >
            <span className="hamburger-icon">
              <Icon name="list" size="lg" />
            </span>
          </button>

          {showNavMenu && (
            <div className="nav-dropdown">
              <div className="nav-dropdown-header">
                <h3>Menú de Navegación</h3>
              </div>
              <div className="nav-dropdown-menu">
                {navLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => {
                      navigate(link.path);
                      setShowNavMenu(false);
                    }}
                    className={`nav-dropdown-item ${isActive(link.path) ? 'active' : ''}`}
                  >
                    <span className="nav-dropdown-icon">
                      <Icon name={link.icon} size="md" />
                    </span>
                    {link.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DERECHA: NOTIFICACIONES Y USUARIO */}
        <div className="header-actions">
          {/* NOTIFICACIONES */}
          <div className="notifications-container">
            <button
              className="btn-notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="notification-icon">
                <Icon name="bell" size="md" />
              </span>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notificaciones</h3>
                  <span className="notifications-count">{unreadCount} nuevas</span>
                </div>
                <div className="notifications-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`notification-item ${notif.type}`}>
                      <div className="notification-content">
                        <p className="notification-message">{notif.message}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notifications-footer">
                  <button className="btn-view-all">Ver todas</button>
                </div>
              </div>
            )}
          </div>

          {/* MENÚ DE USUARIO */}
          <div className="user-menu-container">
            <button
              className="btn-user-menu"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                <span className="avatar-icon">
                  <Icon name="person-badge" size="lg" />
                </span>
              </div>
              <div className="user-info">
                <span className="user-name">
                  {usuario?.nombre || "Administrador"}
                </span>
                <span className="user-role">Administrador</span>
              </div>
              <span className="dropdown-arrow">
                <Icon name="chevron-down" size="sm" />
              </span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-avatar-large">
                    <Icon name="person-badge" size="xl" />
                  </div>
                  <div className="user-details">
                    <p className="user-fullname">
                      {usuario?.nombre} {usuario?.apellidoPaterno}
                    </p>
                    <p className="user-email">{usuario?.correo}</p>
                  </div>
                </div>
                <div className="user-dropdown-menu">
                  <button className="menu-item" onClick={() => navigate("/admin")}>
                    <span className="menu-icon">
                      <Icon name="house" size="md" />
                    </span>
                    Dashboard
                  </button>
                  <button className="menu-item" onClick={() => navigate("/admin/perfil")}>
                    <span className="menu-icon">
                      <Icon name="person" size="md" />
                    </span>
                    Mi Perfil
                  </button>
                  <button className="menu-item" onClick={() => navigate("/admin/configuracion")}>
                    <span className="menu-icon">
                      <Icon name="gear" size="md" />
                    </span>
                    Configuración
                  </button>
                  <div className="menu-divider"></div>
                  <button className="menu-item logout" onClick={handleLogout}>
                    <span className="menu-icon">
                      <Icon name="box-arrow-right" size="md" />
                    </span>
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
