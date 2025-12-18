import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PasoPago.css";

export default function PasoPago({ formData, setFormData, onNext, onBack }) {
  const navigate = useNavigate();
  const [archivo, setArchivo] = useState(formData.comprobante || null);
  const [aviso, setAviso] = useState("");
  const [error, setError] = useState("");
  const [mostrarModalPago, setMostrarModalPago] = useState(false);

  const validar = () => {
    let msg = "";
    if (!formData.tipoPago) msg = "Seleccione un tipo de pago.";
    else if (!archivo) msg = "Debe subir un comprobante de pago.";
    setError(msg);
    return !msg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value === "CUOTAS") {
      setAviso("Debe subir su comprobante de la primera cuota (S/300).");
    } else if (value === "CONTADO") {
      setAviso("Suba el comprobante del pago completo (S/600).");
    } else {
      setAviso("");
    }

    setError("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tiposPermitidos = ["image/jpeg", "image/png", "application/pdf"];
    if (!tiposPermitidos.includes(file.type)) {
      setError("Formato no permitido. Solo se aceptan JPG, PNG o PDF.");
      setArchivo(null);
      return;
    }

    setArchivo(file);
    setFormData({ ...formData, comprobante: file });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validar()) onNext();
  };

  const handleIrAPagar = () => {
    setMostrarModalPago(true);
  };

  const handleCerrarModal = () => {
    setMostrarModalPago(false);
    navigate("/principal");
  };

  const formValido = formData.tipoPago && archivo && !error;

  return (
    <div className="step-container">
      <h2>Pago y Comprobante</h2>
      <p className="subtitle">
        Selecciona tu tipo de pago y sube el comprobante correspondiente.
      </p>

      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        {/* Tipo de pago */}
        <div className="form-group">
          <label>Tipo de pago:</label>
          <select
            name="tipoPago"
            value={formData.tipoPago || ""}
            onChange={handleChange}
            className={error && !formData.tipoPago ? "error" : "success"}
            required
          >
            <option value="">Seleccione opción</option>
            <option value="CONTADO">Pago al contado (S/600)</option>
            <option value="CUOTAS">Pago en cuotas (S/650)</option>
          </select>
        </div>

        {/* Aviso según tipo de pago */}
        {aviso && <p className="pago-aviso">{aviso}</p>}

        {/* Información de pago */}
        {formData.tipoPago && (
          <div className="info-pago-banco">
            <h3>📋 Información para el Pago</h3>
            <p><strong>Banco:</strong> Banco de la Nación</p>
            <p><strong>Cuenta:</strong> 1234-5678-9012-3456</p>
            <p><strong>Titular:</strong> Academia Preuniversitaria UNSAAC</p>
            <p className="nota-importante">
              ⚠️ Después de realizar el pago, regresa aquí con tu voucher para completar tu matrícula.
            </p>
          </div>
        )}

        {/* Botón Ir a Pagar */}
        {formData.tipoPago && !archivo && (
          <div className="form-group">
            <button 
              type="button" 
              className="btn-ir-pagar"
              onClick={handleIrAPagar}
            >
              🏦 Ir a Pagar
            </button>
          </div>
        )}

        {/* Subir comprobante */}
        <div className="form-group">
          <label>Subir comprobante:</label>
          <input
            type="file"
            accept=".jpg,.png,.pdf"
            onChange={handleFileUpload}
            className={error && !archivo ? "error" : "success"}
            required
          />
          {archivo && (
            <p className="file-name">
              Archivo seleccionado: <strong>{archivo.name}</strong>
            </p>
          )}
        </div>

        {/* Mensaje de error */}
        {error && <p className="error-text">{error}</p>}

        {/* Botones */}
        <div className="button-container">
          <button type="button" className="btn-back" onClick={onBack}>
            ← Atrás
          </button>
          <button type="submit" className="btn-next" disabled={!formValido}>
            Siguiente →
          </button>
        </div>
      </form>

      {/* Modal de confirmación de pago */}
      {mostrarModalPago && (
        <div className="modal-overlay" onClick={handleCerrarModal}>
          <div className="modal-pago" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🏦 Instrucciones de Pago</h3>
            </div>
            <div className="modal-body">
              <p className="modal-message">
                Por favor, realiza el pago en el banco con los datos proporcionados.
              </p>
              <p className="modal-instruction">
                <strong>Después de obtener tu voucher:</strong>
              </p>
              <ol className="modal-steps">
                <li>Vuelve a ingresar a la página principal</li>
                <li>Ingresa con tu DNI: <strong>{formData.dni}</strong></li>
                <li>Sube tu comprobante de pago</li>
              </ol>
              <p className="modal-note">
                ⚠️ Guarda bien tu voucher, lo necesitarás para completar tu matrícula.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cerrar" onClick={handleCerrarModal}>
                Entendido, volver al inicio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
