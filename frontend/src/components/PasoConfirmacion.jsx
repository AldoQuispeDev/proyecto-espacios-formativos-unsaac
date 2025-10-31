import React from "react";

export default function PasoConfirmacion({ formData, onBack, onSubmit }) {
  return (
    <div className="confirmacion-container">
      <h2>📋 Confirmación de Datos</h2>
      <p>Verifica que toda tu información esté correcta antes de enviar tu matrícula.</p>

      <div className="confirmacion-datos">
        {/* 🔹 DATOS PERSONALES */}
        <h3>🧍‍♂️ Datos Personales</h3>
        <p>
          <strong>Nombre:</strong>{" "}
          {formData.nombre} {formData.apellidoPaterno} {formData.apellidoMaterno}
        </p>
        <p><strong>DNI:</strong> {formData.dni || "—"}</p>
        <p><strong>Teléfono:</strong> {formData.telefono || "—"}</p>
        <p><strong>Apoderado:</strong> {formData.nombreApoderado || "—"}</p>
        <p><strong>Teléfono del Apoderado:</strong> {formData.telefonoApoderado || "—"}</p>

        {/* 🔹 DATOS ACADÉMICOS */}
        <h3>🎓 Datos Académicos</h3>
        <p><strong>Modalidad:</strong> {formData.modalidadNombre || "—"}</p>
        <p><strong>Grupo:</strong> {formData.grupoNombre || "—"}</p>
        <p><strong>Carrera Principal:</strong> {formData.carreraPrincipalNombre || "—"}</p>
        <p><strong>Carrera Secundaria:</strong> {formData.carreraSecundariaNombre || "—"}</p>

        {/* 🔹 DATOS DE PAGO */}
        <h3>💳 Pago</h3>
        <p><strong>Tipo de pago:</strong> {formData.tipoPago || "—"}</p>

        {/* 🔹 Vista previa del comprobante */}
        {formData.comprobante && (
          <div style={{ marginTop: "10px" }}>
            <strong>Comprobante de pago:</strong>
            <br />
            {formData.comprobante.type.includes("image") ? (
              <img
                src={URL.createObjectURL(formData.comprobante)}
                alt="Comprobante"
                style={{
                  width: "220px",
                  borderRadius: "8px",
                  marginTop: "8px",
                  border: "1px solid #ccc",
                }}
              />
            ) : (
              <a
                href={URL.createObjectURL(formData.comprobante)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#007bff",
                  textDecoration: "underline",
                  marginTop: "8px",
                  display: "inline-block",
                }}
              >
                📎 Ver comprobante PDF
              </a>
            )}
          </div>
        )}
      </div>

      {/* 🔹 BOTONES */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button
          onClick={onBack}
          style={{
            backgroundColor: "#6c757d",
            color: "white",
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          ← Atrás
        </button>

        <button
          onClick={onSubmit}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Confirmar y Enviar
        </button>
      </div>
    </div>
  );
}
