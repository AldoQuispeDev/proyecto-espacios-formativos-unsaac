import React from "react";
import "./PasoConfirmacion.css";

export default function PasoConfirmacion({ formData, onBack, onSubmit }) {
  return (
    <div className="confirmacion-container">
      <h2>Confirmación de Datos</h2>
      <p className="subtitle">
        Verifica que toda tu información esté correcta antes de enviar tu matrícula.
      </p>

      <div className="confirmacion-datos">
        {/* DATOS PERSONALES */}
        <h3>Datos Personales</h3>
        <div className="datos-section">
          <p>
            <strong>Nombre:</strong>{" "}
            {formData.nombre} {formData.apellidoPaterno} {formData.apellidoMaterno}
          </p>
          <p><strong>DNI:</strong> {formData.dni || "—"}</p>
          <p><strong>Teléfono:</strong> {formData.telefono || "—"}</p>
          <p><strong>Apoderado:</strong> {formData.nombreApoderado || "—"}</p>
          <p><strong>Teléfono del Apoderado:</strong> {formData.telefonoApoderado || "—"}</p>
        </div>

        {/* DATOS ACADÉMICOS */}
        <h3>Datos Académicos</h3>
        <div className="datos-section">
          <p><strong>Modalidad:</strong> {formData.modalidadNombre || "—"}</p>
          <p><strong>Grupo:</strong> {formData.grupoNombre || "—"}</p>
          <p><strong>Carrera Principal:</strong> {formData.carreraPrincipalNombre || "—"}</p>
          <p><strong>Carrera Secundaria:</strong> {formData.carreraSecundariaNombre || "—"}</p>
        </div>

        {/* DATOS DE PAGO */}
        <h3>Pago</h3>
        <div className="datos-section">
          <p><strong>Tipo de pago:</strong> {formData.tipoPago || "—"}</p>

          {/* Vista previa del comprobante */}
          {formData.comprobante && (
            <div className="comprobante-preview">
              <strong>Comprobante de pago:</strong>
              {formData.comprobante.type.includes("image") ? (
                <img
                  src={URL.createObjectURL(formData.comprobante)}
                  alt="Comprobante"
                  className="comprobante-img"
                />
              ) : (
                <a
                  href={URL.createObjectURL(formData.comprobante)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="comprobante-link"
                >
                  Ver comprobante PDF
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BOTONES */}
      <div className="button-container">
        <button onClick={onBack} className="btn-back">
          ← Atrás
        </button>
        <button onClick={onSubmit} className="btn-next">
          Confirmar y Enviar
        </button>
      </div>
    </div>
  );
}
