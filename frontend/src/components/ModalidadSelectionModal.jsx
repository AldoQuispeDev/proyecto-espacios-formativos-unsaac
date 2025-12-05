import { useState, useEffect } from "react";
import { obtenerModalidades } from "../api/catalogos";
import MatriculaRapidaModal from "./MatriculaRapidaModal";
import "./ModalidadSelectionModal.css";

export default function ModalidadSelectionModal({ isOpen, onClose }) {
  const [modalidades, setModalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMatriculaModalOpen, setIsMatriculaModalOpen] = useState(false);
  const [selectedModalidad, setSelectedModalidad] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchModalidades();
    }
  }, [isOpen]);

  const fetchModalidades = async () => {
    setLoading(true);
    try {
      const res = await obtenerModalidades();
      setModalidades(res.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar modalidades:", err);
      setError("Error al cargar las modalidades");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectModalidad = (modalidad) => {
    setSelectedModalidad(modalidad);
    setIsMatriculaModalOpen(true);
  };

  const handleCloseMatriculaModal = () => {
    setIsMatriculaModalOpen(false);
    setSelectedModalidad(null);
    onClose(); // También cierra el modal de modalidades
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Configuración de iconos y colores por tipo de modalidad
  const getModalidadConfig = (nombre) => {
    const nombreLower = nombre.toLowerCase();
    
    if (nombreLower.includes("dirimencia")) {
      return {
        icon: "🎯",
        color: "gold",
        description: "Para alumnos destacados de las I.E.",
        duracion: "3 semanas",
        precio: "S/ 200",
        turno: "07:00-13:00, 16:00-20:00"
      };
    }
    
    if (nombreLower.includes("ordinario") && !nombreLower.includes("cepru")) {
      return {
        icon: "📘",
        color: "blue",
        description: "Rumbo al examen de admisión ordinario",
        duracion: "7 semanas",
        precio: "S/ 400",
        turno: "07:00-13:00, 16:00-20:00"
      };
    }
    
    if (nombreLower.includes("cepru") && nombreLower.includes("primera")) {
      return {
        icon: "🎓",
        color: "green",
        description: "Preparación para CEPRU - Primera Oportunidad",
        duracion: "8 semanas",
        precio: "S/ 450",
        turno: "07:00-13:00, 16:00-20:00"
      };
    }
    
    if (nombreLower.includes("cepru") && nombreLower.includes("ordinario")) {
      return {
        icon: "📚",
        color: "purple",
        description: "Preparación para CEPRU - Ordinario",
        duracion: "10 semanas",
        precio: "S/ 500",
        turno: "07:00-13:00, 16:00-20:00"
      };
    }
    
    if (nombreLower.includes("primera")) {
      return {
        icon: "⭐",
        color: "orange",
        description: "Primera Oportunidad - Examen de admisión",
        duracion: "6 semanas",
        precio: "S/ 350",
        turno: "07:00-13:00, 16:00-20:00"
      };
    }
    
    // Default
    return {
      icon: "📖",
      color: "gray",
      description: "Ciclo de preparación académica",
      duracion: "Variable",
      precio: "Consultar",
      turno: "Consultar horarios"
    };
  };

  return (
    <div className="modalidad-modal-overlay" onClick={handleBackdropClick}>
      <div className="modalidad-modal-content">
        <button className="modalidad-modal-close" onClick={onClose} aria-label="Cerrar modal">
          ×
        </button>

        <div className="modalidad-modal-header">
          <h2>Elige tu Modalidad de Ingreso</h2>
          <p>Selecciona el ciclo que mejor se adapte a tus objetivos académicos</p>
        </div>

        {loading ? (
          <div className="modalidad-loading">
            <div className="spinner"></div>
            <p>Cargando modalidades...</p>
          </div>
        ) : error ? (
          <div className="modalidad-error">
            <p>⚠️ {error}</p>
            <button onClick={fetchModalidades} className="btn-retry">
              Reintentar
            </button>
          </div>
        ) : (
          <div className="modalidad-modal-body">
            {modalidades.length === 0 ? (
              <div className="modalidad-empty">
                <p>No hay modalidades disponibles en este momento</p>
              </div>
            ) : (
              modalidades.map((modalidad) => {
                const config = getModalidadConfig(modalidad.nombre);
                return (
                  <button
                    key={modalidad.id}
                    className={`modalidad-card modalidad-card-${config.color}`}
                    onClick={() => handleSelectModalidad(modalidad)}
                  >
                    <div className="modalidad-card-header">
                      <div className="modalidad-icon">{config.icon}</div>
                      <span className="modalidad-badge">PRESENCIAL</span>
                    </div>

                    <h3 className="modalidad-title">{modalidad.nombre}</h3>
                    <p className="modalidad-description">{config.description}</p>

                    <div className="modalidad-details">
                      <div className="modalidad-detail-item">
                        <span className="detail-icon">📅</span>
                        <div className="detail-text">
                          <span className="detail-label">Duración</span>
                          <span className="detail-value">{config.duracion}</span>
                        </div>
                      </div>

                      <div className="modalidad-detail-item">
                        <span className="detail-icon">🕐</span>
                        <div className="detail-text">
                          <span className="detail-label">Turno</span>
                          <span className="detail-value">{config.turno}</span>
                        </div>
                      </div>
                    </div>

                    <div className="modalidad-price">
                      <span className="price-label">Inversión</span>
                      <span className="price-value">{config.precio}</span>
                    </div>

                    <div className="modalidad-cta">
                      <span>Matricularme →</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}

        <div className="modalidad-modal-footer">
          <p>¿Necesitas más información? Contáctanos al WhatsApp: <strong>+51 999 999 999</strong></p>
        </div>
      </div>

      {/* Modal de Matrícula Rápida */}
      <MatriculaRapidaModal
        isOpen={isMatriculaModalOpen}
        onClose={handleCloseMatriculaModal}
        modalidad={selectedModalidad}
      />
    </div>
  );
}
