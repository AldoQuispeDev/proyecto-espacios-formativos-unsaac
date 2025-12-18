// src/components/AdminFooter.jsx

import { useState, useEffect } from "react";
import Icon from "./Icon";
import "./AdminFooter.css";

export default function AdminFooter() {
  const [systemStatus, setSystemStatus] = useState("online");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simular actualización de estado del sistema
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, []);

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Soporte Técnico", url: "/admin/soporte", icon: "tools" },
    { name: "Documentación", url: "/admin/docs", icon: "book-half" },
    { name: "Términos de Uso", url: "/admin/terminos", icon: "file-earmark-text" },
    { name: "Política de Privacidad", url: "/admin/privacidad", icon: "lock" },
  ];

  const socialLinks = [
    { name: "Facebook", url: "https://facebook.com/academiapre", icon: "facebook" },
    { name: "Instagram", url: "https://instagram.com/academiapre", icon: "instagram" },
    { name: "YouTube", url: "https://youtube.com/@academiapre", icon: "youtube" },
  ];

  const formatLastUpdate = () => {
    return lastUpdate.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <footer className="admin-footer">
      <div className="admin-footer-content">
        {/* COLUMNA 1: INFORMACIÓN */}
        <div className="footer-section">
          <h3 className="footer-title">Academia Pre UNSAAC</h3>
          <p className="footer-description">
            Sistema de Gestión Académica - Panel de Administración
          </p>
          <div className="footer-contact">
            <p className="contact-item">
              <span className="contact-icon">
                <Icon name="envelope" size="md" />
              </span>
              info@academiapre.edu.pe
            </p>
            <p className="contact-item">
              <span className="contact-icon">
                <Icon name="telephone" size="md" />
              </span>
              +51 984 123 456
            </p>
            <p className="contact-item">
              <span className="contact-icon">
                <Icon name="geo-alt" size="md" />
              </span>
              Av. La Cultura 123, Cusco
            </p>
          </div>
        </div>

        {/* COLUMNA 2: ENLACES RÁPIDOS */}
        <div className="footer-section">
          <h3 className="footer-title">Enlaces Rápidos</h3>
          <ul className="footer-links">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <a href={link.url} className="footer-link">
                  <span className="link-icon">
                    <Icon name={link.icon} size="sm" />
                  </span>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMNA 3: REDES SOCIALES */}
        <div className="footer-section">
          <h3 className="footer-title">Síguenos</h3>
          <div className="social-links">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title={social.name}
              >
                <span className="social-icon">
                  <Icon name={social.icon} size="lg" />
                </span>
              </a>
            ))}
          </div>
          <div className="footer-newsletter">
            <p className="newsletter-text">Mantente informado</p>
            <button className="btn-newsletter">Suscribirse</button>
          </div>
        </div>

        {/* COLUMNA 4: ESTADO DEL SISTEMA */}
        <div className="footer-section">
          <h3 className="footer-title">Estado del Sistema</h3>
          <div className="system-status">
            <div className={`status-indicator ${systemStatus}`}>
              <span className="status-dot"></span>
              <span className="status-text">
                {systemStatus === "online" ? "Sistema Operativo" : "Mantenimiento"}
              </span>
            </div>
            <p className="status-update">
              Última actualización: {formatLastUpdate()}
            </p>
          </div>
          <div className="footer-version">
            <p className="version-text">Versión 2.0.0</p>
            <p className="version-date">Actualizado: Diciembre 2025</p>
          </div>
        </div>
      </div>

      {/* BARRA INFERIOR */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            © {currentYear} Academia Pre UNSAAC. Todos los derechos reservados.
          </p>
          <p className="developer">
            Desarrollado con <Icon name="heart-fill" size="sm" color="danger" /> por el Equipo de Desarrollo
          </p>
        </div>
      </div>
    </footer>
  );
}
