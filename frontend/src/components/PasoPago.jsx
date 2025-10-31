import React, { useState } from "react";
import "./PasoPago.css";

export default function PasoPago({ formData, setFormData, onNext, onBack }) {
  const [archivo, setArchivo] = useState(null);
  const [aviso, setAviso] = useState("");

  // 🔹 Manejar el cambio del tipo de pago
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value === "CUOTAS") {
      setAviso("Debe subir su comprobante de pago de la primera cuota (S/300).");
    } else if (value === "CONTADO") {
      setAviso("Suba el comprobante de pago completo (S/600).");
    } else {
      setAviso("");
    }
  };

  // 🔹 Manejar la selección del archivo (no lo sube todavía)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setArchivo(file);
    setFormData({ ...formData, comprobante: file }); // 👈 se guarda en memoria para enviarse al final
  };

  // 🔹 Validar antes de continuar
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tipoPago || !archivo) {
      alert("Seleccione un tipo de pago y suba el comprobante antes de continuar.");
      return;
    }
    onNext(); // pasa al siguiente paso del formulario
  };

  return (
    <div className="step-container">
      <h2>💳 Pago y Comprobante</h2>
      <p className="subtitle">
        Selecciona tu tipo de pago y sube el comprobante correspondiente.
      </p>

      <form className="form-grid" onSubmit={handleSubmit}>
        {/* Tipo de pago */}
        <div className="form-group">
          <label>Tipo de pago:</label>
          <select
            name="tipoPago"
            value={formData.tipoPago || ""}
            onChange={handleChange}
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
            required
          />
          {archivo && <p className="file-name">📎 {archivo.name}</p>}
        </div>

        {/* Botones */}
        <div className="button-container">
          <button type="button" className="btn-back" onClick={onBack}>
            ← Atrás
          </button>
          <button type="submit" className="btn-next">
            Siguiente →
          </button>
        </div>
      </form>
    </div>
  );
}
