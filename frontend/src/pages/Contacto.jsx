// src/pages/Contacto.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import "./Contacto.css";

export default function Contacto() {
  const navigate = useNavigate();
  const [copiedText, setCopiedText] = useState("");

  // Datos de contacto centralizados (fácil de actualizar)
  const contactInfo = {
    whatsapp: {
      numero: "+51 984 123 456",
      numeroLimpio: "51984123456",
      mensaje: "Hola, me gustaría obtener más información sobre la Academia Pre UNSAAC",
    },
    telefono: {
      principal: "084-123456",
      secundario: "+51 984 123 456",
    },
    email: {
      principal: "info@academiapre.edu.pe",
      admisiones: "admisiones@academiapre.edu.pe",
    },
    redes: {
      facebook: "https://facebook.com/academiapre",
      tiktok: "https://tiktok.com/@academiapre",
      instagram: "https://instagram.com/academiapre",
      youtube: "https://youtube.com/@academiapre",
    },
    direccion: {
      calle: "Av. La Cultura 123",
      distrito: "Cusco",
      referencia: "Frente al Parque de la Madre",
    },
    horarios: {
      lunesViernes: "8:00 AM - 8:00 PM",
      sabado: "8:00 AM - 2:00 PM",
      domingo: "Cerrado",
    },
  };

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${contactInfo.whatsapp.numeroLimpio}?text=${encodeURIComponent(contactInfo.whatsapp.mensaje)}`;
    window.open(url, "_blank");
  };

  const handleCopyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const handleSocialClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="contacto-container">
      {/* HEADER */}
      <header className="contacto-header">
        <button onClick={() => navigate("/")} className="btn-volver">
          ← Volver al Inicio
        </button>
        <h1>Contáctanos</h1>
      </header>

      {/* HERO SECTION */}
      <section className="contacto-hero">
        <div className="hero-overlay">
          <h2>¿Tienes alguna pregunta?</h2>
          <p>Estamos aquí para ayudarte. Contáctanos por cualquiera de nuestros canales</p>
        </div>
      </section>

      {/* MÉTODOS DE CONTACTO PRINCIPALES */}
      <section className="metodos-contacto">
        <div className="metodos-grid">
          {/* WHATSAPP */}
          <div className="metodo-card whatsapp-card" onClick={handleWhatsAppClick}>
            <div className="metodo-icon icon-3xl text-success">
              <Icon name="whatsapp" title="WhatsApp" />
            </div>
            <h3>WhatsApp</h3>
            <p className="metodo-valor">{contactInfo.whatsapp.numero}</p>
            <p className="metodo-descripcion">Respuesta inmediata</p>
            <button className="btn-metodo">
              Chatear Ahora
            </button>
          </div>

          {/* TELÉFONO */}
          <div className="metodo-card telefono-card">
            <div className="metodo-icon icon-3xl text-primary">
              <Icon name="telephone" title="Teléfono" />
            </div>
            <h3>Teléfono</h3>
            <p className="metodo-valor">{contactInfo.telefono.principal}</p>
            <p className="metodo-descripcion">Llámanos directamente</p>
            <button 
              className="btn-metodo"
              onClick={() => handleCopyToClipboard(contactInfo.telefono.principal, "teléfono")}
            >
              {copiedText === "teléfono" ? <><Icon name="check" className="icon-sm text-success" /> Copiado</> : "Copiar Número"}
            </button>
          </div>

          {/* EMAIL */}
          <div className="metodo-card email-card">
            <div className="metodo-icon icon-3xl text-danger">
              <Icon name="envelope" title="Correo Electrónico" />
            </div>
            <h3>Correo Electrónico</h3>
            <p className="metodo-valor">{contactInfo.email.principal}</p>
            <p className="metodo-descripcion">Te respondemos en 24h</p>
            <button 
              className="btn-metodo"
              onClick={() => window.location.href = `mailto:${contactInfo.email.principal}`}
            >
              Enviar Email
            </button>
          </div>
        </div>
      </section>

      {/* REDES SOCIALES */}
      <section className="redes-sociales-section">
        <h2 className="section-title">Síguenos en Redes Sociales</h2>
        <div className="redes-grid">
          <div 
            className="red-card facebook-card"
            onClick={() => handleSocialClick(contactInfo.redes.facebook)}
          >
            <div className="red-icon icon-3xl text-primary">
              <Icon name="facebook" title="Facebook" />
            </div>
            <h3>Facebook</h3>
            <p>@academiapre</p>
            <span className="red-badge">Síguenos</span>
          </div>

          <div 
            className="red-card tiktok-card"
            onClick={() => handleSocialClick(contactInfo.redes.tiktok)}
          >
            <div className="red-icon icon-3xl text-dark">
              <Icon name="music-note-beamed" title="TikTok" />
            </div>
            <h3>TikTok</h3>
            <p>@academiapre</p>
            <span className="red-badge">Síguenos</span>
          </div>

          <div 
            className="red-card instagram-card"
            onClick={() => handleSocialClick(contactInfo.redes.instagram)}
          >
            <div className="red-icon icon-3xl text-danger">
              <Icon name="instagram" title="Instagram" />
            </div>
            <h3>Instagram</h3>
            <p>@academiapre</p>
            <span className="red-badge">Síguenos</span>
          </div>

          <div 
            className="red-card youtube-card"
            onClick={() => handleSocialClick(contactInfo.redes.youtube)}
          >
            <div className="red-icon icon-3xl text-danger">
              <Icon name="youtube" title="YouTube" />
            </div>
            <h3>YouTube</h3>
            <p>@academiapre</p>
            <span className="red-badge">Suscríbete</span>
          </div>
        </div>
      </section>

      {/* INFORMACIÓN ADICIONAL */}
      <section className="info-adicional-section">
        <div className="info-grid">
          {/* DIRECCIÓN */}
          <div className="info-card">
            <div className="info-icon icon-2xl text-danger">
              <Icon name="geo-alt" title="Ubicación" />
            </div>
            <h3>Nuestra Ubicación</h3>
            <p className="info-principal">{contactInfo.direccion.calle}</p>
            <p className="info-secundaria">{contactInfo.direccion.distrito}</p>
            <p className="info-referencia">
              <em>{contactInfo.direccion.referencia}</em>
            </p>
            <button 
              className="btn-info"
              onClick={() => window.open("https://maps.google.com", "_blank")}
            >
              Ver en Mapa
            </button>
          </div>

          {/* HORARIOS */}
          <div className="info-card">
            <div className="info-icon icon-2xl text-primary">
              <Icon name="clock" title="Horario" />
            </div>
            <h3>Horario de Atención</h3>
            <div className="horarios-lista">
              <div className="horario-item">
                <span className="horario-dia">Lunes - Viernes:</span>
                <span className="horario-hora">{contactInfo.horarios.lunesViernes}</span>
              </div>
              <div className="horario-item">
                <span className="horario-dia">Sábado:</span>
                <span className="horario-hora">{contactInfo.horarios.sabado}</span>
              </div>
              <div className="horario-item">
                <span className="horario-dia">Domingo:</span>
                <span className="horario-hora">{contactInfo.horarios.domingo}</span>
              </div>
            </div>
          </div>

          {/* CORREOS ADICIONALES */}
          <div className="info-card">
            <div className="info-icon icon-2xl text-info">
              <Icon name="envelope-fill" title="Correos" />
            </div>
            <h3>Correos por Área</h3>
            <div className="correos-lista">
              <div className="correo-item">
                <span className="correo-label">Información General:</span>
                <a href={`mailto:${contactInfo.email.principal}`} className="correo-link">
                  {contactInfo.email.principal}
                </a>
              </div>
              <div className="correo-item">
                <span className="correo-label">Admisiones:</span>
                <a href={`mailto:${contactInfo.email.admisiones}`} className="correo-link">
                  {contactInfo.email.admisiones}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-contacto">
        <h2>¿Listo para comenzar tu preparación?</h2>
        <p>Contáctanos ahora y da el primer paso hacia tu ingreso a la UNSAAC</p>
        <div className="cta-buttons">
          <button onClick={handleWhatsAppClick} className="btn-cta-primary icon-inline icon-text-gap">
            <Icon name="whatsapp" className="icon-md text-success" /> Chatear por WhatsApp
          </button>
          <button onClick={() => navigate("/")} className="btn-cta-secondary">
            Ver Ciclos Disponibles
          </button>
        </div>
      </section>

      {/* NOTIFICACIÓN DE COPIADO */}
      {copiedText && (
        <div className="toast-notification icon-inline icon-text-gap">
          <Icon name="check-circle" className="icon-sm" /> {copiedText} copiado al portapapeles
        </div>
      )}
    </div>
  );
}
