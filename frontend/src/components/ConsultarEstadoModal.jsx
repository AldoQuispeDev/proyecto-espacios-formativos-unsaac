import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { consultarEstadoMatricula } from "../api/matriculas";
import Icon from "./Icon";
import "./ConsultarEstadoModal.css";

export default function ConsultarEstadoModal({ isOpen, onClose, onContinueMatricula }) {
  const navigate = useNavigate();
  const [dni, setDni] = useState("");
  const [matricula, setMatricula] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const handleConsultar = async (e) => {
    e.preventDefault();
    
    if (!dni || dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos");
      return;
    }

    setLoading(true);
    setError("");
    setNotFound(false);
    setMatricula(null);

    try {
      const res = await consultarEstadoMatricula(dni);
      const matriculaData = res.data;
      
      // Si la matrícula está pendiente, redirigir al paso 3 para subir voucher
      if (matriculaData.estado === 'PENDIENTE' && onContinueMatricula) {
        onContinueMatricula(matriculaData);
        onClose();
        resetForm();
        return;
      }
      
      setMatricula(matriculaData);
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError("Error al consultar. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setDni("");
    setMatricula(null);
    setError("");
    setNotFound(false);
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      PENDIENTE: { color: "warning", icon: "hourglass-split", text: "Pendiente" },
      APROBADA: { color: "success", icon: "check-circle-fill", text: "Aprobada" },
      RECHAZADA: { color: "danger", icon: "x-circle-fill", text: "Rechazada" },
    };
    return estados[estado] || estados.PENDIENTE;
  };

  if (!isOpen) return null;

  return (
    <div className="consultar-estado-overlay" onClick={handleBackdropClick}>
      <div className="consultar-estado-content">
        <button className="consultar-estado-close" onClick={() => { onClose(); resetForm(); }}>
          ×
        </button>

        <div className="consultar-estado-header">
          <h2>Consultar Estado de Matrícula</h2>
          <p>Ingresa tu DNI para ver el estado de tu solicitud</p>
        </div>

        {!matricula && !notFound && (
          <form onSubmit={handleConsultar} className="consultar-form">
            <div className="form-group">
              <label htmlFor="dni">
                <span className="label-icon"><Icon name="person-vcard" size="sm" /></span>
                Número de DNI
              </label>
              <input
                type="text"
                id="dni"
                value={dni}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 8) {
                    setDni(value);
                    setError("");
                  }
                }}
                placeholder="Ingresa 8 dígitos"
                maxLength="8"
                required
              />
            </div>

            {error && (
              <div className="alert alert-error">
                <span className="alert-icon"><Icon name="exclamation-triangle" size="sm" /></span>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-consultar" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Consultando...
                </>
              ) : (
                <>
                  <Icon name="search" size="sm" />
                  Consultar Estado
                </>
              )}
            </button>
          </form>
        )}

        {notFound && (
          <div className="resultado-container">
            <div className="resultado-not-found">
              <div className="not-found-icon"><Icon name="search" size="xl" /></div>
              <h3>No se encontró matrícula</h3>
              <p>No existe una matrícula registrada con el DNI <strong>{dni}</strong></p>
              <p className="hint">Verifica que el DNI sea correcto o matricúlate si aún no lo has hecho.</p>
              <button className="btn-secondary" onClick={resetForm}>
                Intentar con otro DNI
              </button>
            </div>
          </div>
        )}

        {matricula && (
          <div className="resultado-container">
            <div className={`estado-badge estado-${getEstadoBadge(matricula.estado).color}`}>
              <span className="estado-icon"><Icon name={getEstadoBadge(matricula.estado).icon} size="sm" /></span>
              <span className="estado-text">{getEstadoBadge(matricula.estado).text}</span>
            </div>

            <div className="matricula-info">
              <h3>Información de tu Matrícula</h3>

              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label"><Icon name="person" size="sm" /> Nombre Completo</span>
                  <span className="info-value">
                    {matricula.nombre} {matricula.apellidoPaterno} {matricula.apellidoMaterno}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label"><Icon name="person-vcard" size="sm" /> DNI</span>
                  <span className="info-value">{matricula.dni}</span>
                </div>

                <div className="info-item">
                  <span className="info-label"><Icon name="telephone" size="sm" /> Teléfono</span>
                  <span className="info-value">{matricula.telefono}</span>
                </div>

                <div className="info-item">
                  <span className="info-label"><Icon name="envelope" size="sm" /> Email</span>
                  <span className="info-value">{matricula.email || "No proporcionado"}</span>
                </div>

                <div className="info-item">
                  <span className="info-label"><Icon name="mortarboard" size="sm" /> Modalidad</span>
                  <span className="info-value">{matricula.modalidad?.nombre || "—"}</span>
                </div>

                <div className="info-item">
                  <span className="info-label"><Icon name="people" size="sm" /> Grupo</span>
                  <span className="info-value">Grupo {matricula.grupo?.nombre || "—"}</span>
                </div>

                <div className="info-item">
                  <span className="info-label"><Icon name="book" size="sm" /> Carrera Principal</span>
                  <span className="info-value">{matricula.carreraPrincipal?.nombre || "—"}</span>
                </div>

                <div className="info-item">
                  <span className="info-label"><Icon name="credit-card" size="sm" /> Tipo de Pago</span>
                  <span className="info-value">{matricula.tipoPago}</span>
                </div>

                <div className="info-item">
                  <span className="info-label"><Icon name="calendar3" size="sm" /> Fecha de Registro</span>
                  <span className="info-value">
                    {new Date(matricula.createdAt).toLocaleDateString("es-PE")}
                  </span>
                </div>
              </div>

              {matricula.estado === "PENDIENTE" && (
                <div className="alert alert-info">
                  <span className="alert-icon"><Icon name="hourglass-split" size="sm" /></span>
                  <div>
                    <strong>Tu matrícula está en revisión</strong>
                    <p>El administrador está revisando tu solicitud. Te notificaremos por WhatsApp cuando haya una respuesta.</p>
                  </div>
                </div>
              )}

              {matricula.estado === "APROBADA" && (
                <div className="alert alert-success">
                  <span className="alert-icon"><Icon name="emoji-smile" size="sm" /></span>
                  <div>
                    <strong>¡Felicitaciones! Tu matrícula fue aprobada</strong>
                    <p>Ya puedes ingresar al aula virtual con tu correo y DNI como contraseña.</p>
                    <button 
                      className="btn-registro-link"
                      onClick={() => {
                        onClose();
                        navigate("/login", { state: { selectedRole: "ESTUDIANTE" } });
                      }}
                    >
                      <Icon name="mortarboard" size="sm" /> Ingresar al Aula Virtual →
                    </button>
                  </div>E
                </div>
              )}

              {matricula.estado === "RECHAZADA" && (
                <div className="alert alert-danger">
                  <span className="alert-icon"><Icon name="x-circle-fill" size="sm" /></span>
                  <div>
                    <strong>Tu matrícula fue rechazada</strong>
                    <p>Por favor, contacta con la administración para más información.</p>
                  </div>
                </div>
              )}
            </div>

            <button className="btn-secondary" onClick={resetForm}>
              Consultar otro DNI
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
