import React, { useState } from "react";
import "./PasoPago.css";

export default function PasoPago({ formData, setFormData, onNext, onBack }) {
  const [archivo, setArchivo] = useState(formData.comprobante || null);
  const [aviso, setAviso] = useState("");
  const [error, setError] = useState("");

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
    </div>
  );
}
