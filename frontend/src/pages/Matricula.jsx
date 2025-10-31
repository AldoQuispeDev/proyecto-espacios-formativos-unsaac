import { useEffect, useState, useContext } from "react";
import { crearMatricula } from "../api/matriculas";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
// 🔹 Importar los pasos
import PasoDatosPersonales from "../components/PasoDatosPersonales";
import PasoDatosAcademicos from "../components/PasoDatosAcademicos";
import PasoPago from "../components/PasoPago";
import PasoConfirmacion from "../components/PasoConfirmacion";

export default function Matricula() {
  const { user, cerrarSesion } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔹 Control de pasos
  const [step, setStep] = useState(1);

  // 🔹 Datos acumulados de todos los pasos
  const [formData, setFormData] = useState({});

  // 🔹 Mensaje de estado (éxito / error)
  const [mensaje, setMensaje] = useState("");

  // 🔹 Verificar autenticación
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // 🔹 Envío final de matrícula
const handleSubmit = async () => {
  try {
    const formDataToSend = new FormData();

    // 🔹 ID del usuario autenticado
    formDataToSend.append("estudianteId", user.id);

    // 🔹 Datos personales
    formDataToSend.append("nombre", formData.nombre || "");
    formDataToSend.append("apellidoPaterno", formData.apellidoPaterno || "");
    formDataToSend.append("apellidoMaterno", formData.apellidoMaterno || "");
    formDataToSend.append("dni", formData.dni || "");
    formDataToSend.append("telefono", formData.telefono || "");
    formDataToSend.append("nombreApoderado", formData.nombreApoderado || "");
    formDataToSend.append("telefonoApoderado", formData.telefonoApoderado || "");

    // 🔹 Datos académicos
    formDataToSend.append("grupoId", formData.grupoId);
    formDataToSend.append("modalidadId", formData.modalidadId);
    formDataToSend.append("carreraPrincipalId", formData.carreraPrincipalId);
    if (formData.carreraSecundariaId)
      formDataToSend.append("carreraSecundariaId", formData.carreraSecundariaId);
    formDataToSend.append("tipoPago", formData.tipoPago);

    // 🔹 Comprobante (archivo)
    if (formData.comprobante) {
      formDataToSend.append("comprobante", formData.comprobante);
    }

    console.log("📦 Enviando matrícula:", Object.fromEntries(formDataToSend));

    await crearMatricula(formDataToSend);

    setMensaje("✅ Matrícula enviada correctamente");
    setStep(5);
  } catch (error) {
    console.error("❌ Error al enviar matrícula:", error);
    setMensaje("❌ Error al enviar la matrícula");
  }
};


  return (
    <div className="matricula-container">
      {/* 🔹 Paso 1: Datos personales */}
      {step === 1 && (
        <PasoDatosPersonales
          formData={formData}
          setFormData={setFormData}
          onNext={() => setStep(2)}
        />
      )}

      {/* 🔹 Paso 2: Datos académicos */}
      {step === 2 && (
        <PasoDatosAcademicos
          formData={formData}
          setFormData={setFormData}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {/* 🔹 Paso 3: Pago y comprobante */}
      {step === 3 && (
        <PasoPago
          formData={formData}
          setFormData={setFormData}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {/* 🔹 Paso 4: Confirmación de datos */}
      {step === 4 && (
        <PasoConfirmacion
          formData={formData}
          onBack={() => setStep(3)}
          onSubmit={handleSubmit}
        />
      )}

      {/* 🔹 Paso 5: Matrícula enviada */}
      {step === 5 && (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2>🎉 Matrícula enviada</h2>
          <p>
            Tu matrícula fue registrada correctamente. <br />
            Una vez sea aprobada, se te notificará por WhatsApp o podrás volver
            aquí para descargar tu constancia.
          </p>
          <button
            onClick={() => navigate("/principal")}
            style={{
              marginTop: "20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 18px",
              cursor: "pointer",
            }}
          >
            Volver al inicio
          </button>
        </div>
      )}

      {/* 🔹 Mensaje de estado */}
      {mensaje && (
        <p
          style={{
            textAlign: "center",
            color: mensaje.startsWith("✅") ? "green" : "red",
            fontWeight: "600",
            marginTop: "15px",
          }}
        >
          {mensaje}
        </p>
      )}

      {/* 🔹 Botón cerrar sesión */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={cerrarSesion}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
