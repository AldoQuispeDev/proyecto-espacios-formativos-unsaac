import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerGrupos,
  obtenerCarrerasPorGrupo,
} from "../api/catalogos";
import { crearMatricula } from "../api/matriculas";
import "./MatriculaRapidaModal.css";

export default function MatriculaRapidaModal({ isOpen, onClose, modalidad }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    dni: "",
    email: "",
    telefono: "",
    colegioProcedencia: "",
    grupoId: "",
    carreraPrincipalId: "",
    carreraSecundariaId: "",
    tipoPago: "",
    comprobante: null,
  });

  const [grupos, setGrupos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Datos personales, 2: Datos académicos, 3: Confirmación, 4: Estado
  const [comprobantePreview, setComprobantePreview] = useState(null);
  const [matriculaCreada, setMatriculaCreada] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchGrupos();
      // Reset form cuando se abre
      setStep(1);
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.grupoId) {
      fetchCarreras(formData.grupoId);
    }
  }, [formData.grupoId]);

  const fetchGrupos = async () => {
    try {
      const res = await obtenerGrupos();
      setGrupos(res.data);
    } catch (err) {
      console.error("Error al cargar grupos:", err);
      setError("Error al cargar los grupos");
    }
  };

  const fetchCarreras = async (grupoId) => {
    try {
      const res = await obtenerCarrerasPorGrupo(grupoId);
      setCarreras(res.data);
    } catch (err) {
      console.error("Error al cargar carreras:", err);
      setError("Error al cargar las carreras");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("El archivo no debe superar los 5MB");
        return;
      }

      // Validar tipo
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        setError("Solo se permiten archivos JPG, PNG o PDF");
        return;
      }

      setFormData({
        ...formData,
        comprobante: file,
      });

      // Crear preview si es imagen
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setComprobantePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setComprobantePreview(null);
      }

      setError("");
    }
  };

  const validateStep1 = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }
    if (!formData.apellidoPaterno.trim()) {
      setError("El apellido paterno es obligatorio");
      return false;
    }
    if (!formData.apellidoMaterno.trim()) {
      setError("El apellido materno es obligatorio");
      return false;
    }
    if (!formData.dni.trim() || formData.dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos");
      return false;
    }
    if (!formData.email.trim()) {
      setError("El correo electrónico es obligatorio");
      return false;
    }
    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("El correo electrónico no es válido");
      return false;
    }
    if (!formData.telefono.trim() || formData.telefono.length !== 9) {
      setError("El teléfono debe tener 9 dígitos");
      return false;
    }
    if (!formData.colegioProcedencia.trim()) {
      setError("La procedencia del colegio es obligatoria");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.grupoId) {
      setError("Debe seleccionar un grupo");
      return false;
    }
    if (!formData.carreraPrincipalId) {
      setError("Debe seleccionar una carrera principal");
      return false;
    }
    if (!formData.tipoPago) {
      setError("Debe seleccionar un tipo de pago");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError("");
  };

  const validateStep3 = () => {
    if (!formData.comprobante) {
      setError("Debe subir el comprobante de pago");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep3()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const dataToSend = new FormData();
      
      // Datos personales
      dataToSend.append("nombre", formData.nombre);
      dataToSend.append("apellidoPaterno", formData.apellidoPaterno);
      dataToSend.append("apellidoMaterno", formData.apellidoMaterno);
      dataToSend.append("dni", formData.dni);
      dataToSend.append("email", formData.email);
      dataToSend.append("telefono", formData.telefono);
      dataToSend.append("colegioProcedencia", formData.colegioProcedencia);
      
      // Datos académicos
      dataToSend.append("modalidadId", modalidad.id);
      dataToSend.append("grupoId", formData.grupoId);
      dataToSend.append("carreraPrincipalId", formData.carreraPrincipalId);
      if (formData.carreraSecundariaId) {
        dataToSend.append("carreraSecundariaId", formData.carreraSecundariaId);
      }
      dataToSend.append("tipoPago", formData.tipoPago);

      // Comprobante
      if (formData.comprobante) {
        dataToSend.append("comprobante", formData.comprobante);
      }

      const response = await crearMatricula(dataToSend);

      // Guardar matrícula creada y pasar al paso 4
      setMatriculaCreada(response.data.data);
      setStep(4);
    } catch (err) {
      console.error("❌ Error al crear matrícula:", err);
      console.error("❌ Response:", err.response);
      console.error("❌ Data:", err.response?.data);
      
      const errorMsg = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || "Error al registrar la matrícula. Por favor, intenta nuevamente.";
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizar = () => {
    onClose();
    navigate("/");
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !modalidad) return null;

  return (
    <div className="matricula-rapida-overlay" onClick={handleBackdropClick}>
      <div className="matricula-rapida-content">
        <button className="matricula-rapida-close" onClick={onClose}>
          ×
        </button>

        {/* Header */}
        <div className="matricula-rapida-header">
          <h2>Matrícula Rápida</h2>
          <div className="modalidad-selected">
            <span className="modalidad-badge-small">{modalidad.nombre}</span>
          </div>
          <div className="progress-bar">
            <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
              <div className="step-number">1</div>
              <span>Datos Personales</span>
            </div>
            <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
              <div className="step-number">2</div>
              <span>Datos Académicos</span>
            </div>
            <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <span>Confirmación</span>
            </div>
            <div className={`progress-step ${step >= 4 ? "active" : ""}`}>
              <div className="step-number">4</div>
              <span>Estado</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="matricula-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Step 1: Datos Personales */}
        {step === 1 && (
          <div className="matricula-rapida-body">
            <h3>Datos Personales</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label>
                  Nombre <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Apellido Paterno <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleChange}
                  placeholder="Ej: Pérez"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Apellido Materno <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleChange}
                  placeholder="Ej: García"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  DNI <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder="8 dígitos"
                  maxLength="8"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Correo Electrónico <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Teléfono/Celular <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="9 dígitos"
                  maxLength="9"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Colegio de Procedencia <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="colegioProcedencia"
                  value={formData.colegioProcedencia}
                  onChange={handleChange}
                  placeholder="Nombre del colegio"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Datos Académicos */}
        {step === 2 && (
          <div className="matricula-rapida-body">
            <h3>Datos Académicos</h3>
            <div className="form-grid-1">
              <div className="form-group">
                <label>
                  Grupo <span className="required">*</span>
                </label>
                <select
                  name="grupoId"
                  value={formData.grupoId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar grupo</option>
                  {grupos.map((grupo) => (
                    <option key={grupo.id} value={grupo.id}>
                      Grupo {grupo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {carreras.length > 0 && (
                <>
                  <div className="form-group">
                    <label>
                      Carrera Principal <span className="required">*</span>
                    </label>
                    <select
                      name="carreraPrincipalId"
                      value={formData.carreraPrincipalId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar carrera principal</option>
                      {carreras.map((carrera) => (
                        <option key={carrera.id} value={carrera.id}>
                          {carrera.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Carrera Secundaria (opcional)</label>
                    <select
                      name="carreraSecundariaId"
                      value={formData.carreraSecundariaId}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar segunda opción</option>
                      {carreras.map((carrera) => (
                        <option key={carrera.id} value={carrera.id}>
                          {carrera.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>
                  Tipo de Pago <span className="required">*</span>
                </label>
                <div className="tipo-pago-options">
                  <label className={`radio-option-card ${formData.tipoPago === "Efectivo" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="tipoPago"
                      value="Efectivo"
                      checked={formData.tipoPago === "Efectivo"}
                      onChange={handleChange}
                    />
                    <div className="radio-card-content">
                      <span className="radio-icon">💵</span>
                      <span className="radio-title">Efectivo</span>
                      <span className="radio-description">
                        Acérquese a oficina, pague el monto que eligió y pida la boleta
                      </span>
                    </div>
                  </label>

                  <label className={`radio-option-card ${formData.tipoPago === "Transferencia" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="tipoPago"
                      value="Transferencia"
                      checked={formData.tipoPago === "Transferencia"}
                      onChange={handleChange}
                    />
                    <div className="radio-card-content">
                      <span className="radio-icon">🏦</span>
                      <span className="radio-title">Transferencia</span>
                      <span className="radio-description">
                        <strong>Banco:</strong> BCP<br />
                        <strong>Cuenta:</strong> 123-456789-0-12<br />
                        <strong>Titular:</strong> Academia Pre Universitaria
                      </span>
                    </div>
                  </label>

                  <label className={`radio-option-card ${formData.tipoPago === "Yape/Plin" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="tipoPago"
                      value="Yape/Plin"
                      checked={formData.tipoPago === "Yape/Plin"}
                      onChange={handleChange}
                    />
                    <div className="radio-card-content">
                      <span className="radio-icon">📱</span>
                      <span className="radio-title">Yape/Plin</span>
                      <span className="radio-description">
                        <strong>Número:</strong> 999 999 999<br />
                        <strong>Nombre:</strong> Academia Pre
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmación */}
        {step === 3 && (
          <div className="matricula-rapida-body">
            <h3>Confirma tus Datos y Sube tu Comprobante</h3>
            
            <div className="confirmacion-grid">
              <div className="confirmacion-section">
                <h4>📋 Datos Personales</h4>
                <div className="confirmacion-item">
                  <span className="label">Nombre Completo:</span>
                  <span className="value">
                    {formData.nombre} {formData.apellidoPaterno} {formData.apellidoMaterno}
                  </span>
                </div>
                <div className="confirmacion-item">
                  <span className="label">DNI:</span>
                  <span className="value">{formData.dni}</span>
                </div>
                <div className="confirmacion-item">
                  <span className="label">Teléfono:</span>
                  <span className="value">{formData.telefono}</span>
                </div>
                <div className="confirmacion-item">
                  <span className="label">Colegio:</span>
                  <span className="value">{formData.colegioProcedencia}</span>
                </div>
              </div>

              <div className="confirmacion-section">
                <h4>🎓 Datos Académicos</h4>
                <div className="confirmacion-item">
                  <span className="label">Modalidad:</span>
                  <span className="value">{modalidad.nombre}</span>
                </div>
                <div className="confirmacion-item">
                  <span className="label">Grupo:</span>
                  <span className="value">
                    Grupo {grupos.find((g) => g.id === parseInt(formData.grupoId))?.nombre}
                  </span>
                </div>
                <div className="confirmacion-item">
                  <span className="label">Carrera Principal:</span>
                  <span className="value">
                    {carreras.find((c) => c.id === parseInt(formData.carreraPrincipalId))?.nombre}
                  </span>
                </div>
                {formData.carreraSecundariaId && (
                  <div className="confirmacion-item">
                    <span className="label">Carrera Secundaria:</span>
                    <span className="value">
                      {carreras.find((c) => c.id === parseInt(formData.carreraSecundariaId))?.nombre}
                    </span>
                  </div>
                )}
                <div className="confirmacion-item">
                  <span className="label">Tipo de Pago:</span>
                  <span className="value">{formData.tipoPago}</span>
                </div>
              </div>
            </div>

            {/* Subir Comprobante */}
            <div className="comprobante-section">
              <h4>📎 Comprobante de Pago</h4>
              <p className="comprobante-instruction">
                Sube una foto o captura de tu comprobante de pago (boleta, voucher o captura de Yape/Plin)
              </p>
              
              <div className="comprobante-upload">
                <input
                  type="file"
                  id="comprobante"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="comprobante" className="comprobante-upload-btn">
                  {formData.comprobante ? (
                    <>
                      <span className="upload-icon">✓</span>
                      <span>{formData.comprobante.name}</span>
                    </>
                  ) : (
                    <>
                      <span className="upload-icon">📤</span>
                      <span>Seleccionar archivo</span>
                    </>
                  )}
                </label>

                {comprobantePreview && (
                  <div className="comprobante-preview">
                    <img src={comprobantePreview} alt="Preview" />
                  </div>
                )}

                {formData.comprobante && (
                  <button
                    type="button"
                    className="btn-remove-file"
                    onClick={() => {
                      setFormData({ ...formData, comprobante: null });
                      setComprobantePreview(null);
                    }}
                  >
                    ✕ Quitar archivo
                  </button>
                )}
              </div>

              <p className="comprobante-note">
                <small>Formatos permitidos: JPG, PNG, PDF (máximo 5MB)</small>
              </p>
            </div>

            {/* Mensajes Informativos */}
            <div className="confirmacion-alerts">
              <div className="alert alert-info">
                <span className="alert-icon">📱</span>
                <div className="alert-content">
                  <strong>Recibirás un mensaje de WhatsApp</strong>
                  <p>Te enviaremos la confirmación de tu matrícula al número {formData.telefono}</p>
                </div>
              </div>

              <div className="alert alert-warning">
                <span className="alert-icon">⏳</span>
                <div className="alert-content">
                  <strong>Estado de tu matrícula</strong>
                  <p>El administrador revisará tu solicitud y te notificará si fue aprobada o rechazada</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Estado de Matrícula */}
        {step === 4 && matriculaCreada && (
          <div className="matricula-rapida-body">
            <div className="estado-success-container">
              <div className="success-icon-large">✅</div>
              <h2 className="success-title">¡Matrícula Registrada Exitosamente!</h2>
              
              <div className="estado-badge-large estado-pendiente">
                <span className="estado-icon-large">⏳</span>
                <div className="estado-info">
                  <span className="estado-label">Estado Actual</span>
                  <span className="estado-value">PENDIENTE</span>
                </div>
              </div>

              <div className="matricula-resumen">
                <h3>Resumen de tu Matrícula</h3>
                
                <div className="resumen-item">
                  <span className="resumen-icon">👤</span>
                  <div className="resumen-content">
                    <span className="resumen-label">Nombre Completo</span>
                    <span className="resumen-value">
                      {formData.nombre} {formData.apellidoPaterno} {formData.apellidoMaterno}
                    </span>
                  </div>
                </div>

                <div className="resumen-item">
                  <span className="resumen-icon">🆔</span>
                  <div className="resumen-content">
                    <span className="resumen-label">DNI</span>
                    <span className="resumen-value">{formData.dni}</span>
                  </div>
                </div>

                <div className="resumen-item">
                  <span className="resumen-icon">📱</span>
                  <div className="resumen-content">
                    <span className="resumen-label">Teléfono</span>
                    <span className="resumen-value">{formData.telefono}</span>
                  </div>
                </div>

                <div className="resumen-item">
                  <span className="resumen-icon">🎓</span>
                  <div className="resumen-content">
                    <span className="resumen-label">Modalidad</span>
                    <span className="resumen-value">{modalidad.nombre}</span>
                  </div>
                </div>
              </div>

              <div className="estado-alerts">
                <div className="alert alert-info-estado">
                  <span className="alert-icon">📱</span>
                  <div className="alert-content">
                    <strong>Recibirás un mensaje de WhatsApp</strong>
                    <p>Te enviaremos la confirmación al número {formData.telefono}</p>
                  </div>
                </div>

                <div className="alert alert-warning-estado">
                  <span className="alert-icon">⏳</span>
                  <div className="alert-content">
                    <strong>Tu matrícula está en revisión</strong>
                    <p>El administrador revisará tu solicitud y te notificará cuando sea aprobada o rechazada</p>
                  </div>
                </div>

                <div className="alert alert-success-estado">
                  <span className="alert-icon">🔍</span>
                  <div className="alert-content">
                    <strong>Consulta tu estado en cualquier momento</strong>
                    <p>Ingresa tu DNI en "Consultar Estado" desde la página principal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer con botones */}
        <div className="matricula-rapida-footer">
          {step > 1 && step < 4 && (
            <button className="btn-back-modal" onClick={handleBack} disabled={loading}>
              ← Atrás
            </button>
          )}
          {step < 3 ? (
            <button className="btn-next-modal" onClick={handleNext}>
              Siguiente →
            </button>
          ) : step === 3 ? (
            <button
              className="btn-submit-modal"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Confirmar Matrícula ✓"}
            </button>
          ) : step === 4 ? (
            <button className="btn-finalizar-modal" onClick={handleFinalizar}>
              Finalizar
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
