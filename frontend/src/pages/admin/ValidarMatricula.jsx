import { useEffect, useState } from "react";
import AdminSidebarLayout from "../../components/AdminSidebarLayout"; 
import Icon from "../../components/Icon";
import api from "../../api/client";
import "./ValidarMatricula.css";

export default function ValidarMatricula() {
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cargar matrículas pendientes
  const fetchMatriculas = async () => {
    setLoading(true);
    try {
      const res = await api.get("/matriculas"); 
      const pendientes = res.data.filter(
        (m) => m.estado?.trim().toUpperCase() === "PENDIENTE"
      );
      setMatriculas(pendientes);
    } catch (error) {
      console.error("Error al obtener matrículas:", error);
      alert("Error al cargar matrículas. Asegúrate de estar logueado como Admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatriculas();
  }, []);

  // Aprobar matrícula
  const aprobarMatricula = async (id, telefono) => {
    const mensaje = prompt(
      `Mensaje que se enviará al WhatsApp ${telefono}:`,
      `¡Felicitaciones! Tu matrícula ha sido APROBADA. Pronto recibirás tus credenciales de acceso.`
    );
    
    if (!mensaje) return;

    try {
      await api.put(`/matriculas/${id}/aprobar`, {});
      alert(`Matrícula aprobada\n\nMensaje para enviar:\n${mensaje}\n\nWhatsApp: ${telefono}`);
      setMatriculas((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error al aprobar matrícula:", error);
      alert("Error al aprobar matrícula");
    }
  };

  // Rechazar matrícula
  const rechazarMatricula = async (id, telefono) => {
    const motivo = prompt("Ingrese el motivo del rechazo:");
    if (!motivo) return;

    const mensaje = `Tu matrícula ha sido RECHAZADA. Motivo: ${motivo}. Por favor, contacta con la administración para más información.`;

    try {
      await api.put(`/matriculas/${id}/rechazar`, { motivo });
      alert(`Matrícula rechazada\n\nMensaje para enviar:\n${mensaje}\n\nWhatsApp: ${telefono}`);
      setMatriculas((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error al rechazar matrícula:", error);
      alert("Error al rechazar matrícula");
    }
  };

  if (loading) {
    return (
      <AdminSidebarLayout title="Validar Matrículas">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando matrículas...</p>
        </div>
      </AdminSidebarLayout>
    );
  }

  return (
    <AdminSidebarLayout title="Validar Matrículas">
      <div className="validar-matricula-container">
        <div className="validar-header mb-4">
          <h1 className="mb-2">Matrículas Pendientes</h1>
          <p className="text-muted mb-0">Revisa y valida las solicitudes de matrícula</p>
        </div>

        {matriculas.length === 0 ? (
          <div className="empty-state">
            <Icon name="emoji-smile" size="xl" className="empty-state-icon" />
            <h2>No hay matrículas pendientes</h2>
            <p>Todas las solicitudes han sido procesadas</p>
          </div>
        ) : (
          <div className="row g-4">
            {matriculas.map((m, i) => (
              <div key={m.id} className="col-12 col-lg-6 col-xl-4">
              <div className="matricula-card h-100">
                <div className="card-header">
                  <div className="card-number">{i + 1}</div>
                  <div className="card-estado pendiente">Pendiente</div>
                </div>

                <div className="card-body">
                  <div className="info-row mb-3">
                    <Icon name="person" className="info-icon" />
                    <div className="info-content flex-grow-1">
                      <div className="info-label">Nombre Completo</div>
                      <div className="info-value">
                        {m.nombre} {m.apellidoPaterno} {m.apellidoMaterno}
                      </div>
                    </div>
                  </div>

                  <div className="info-row mb-3">
                    <Icon name="card-text" className="info-icon" />
                    <div className="info-content flex-grow-1">
                      <div className="info-label">DNI</div>
                      <div className="info-value">{m.dni}</div>
                    </div>
                  </div>

                  <div className="info-row mb-3">
                    <Icon name="telephone" className="info-icon" />
                    <div className="info-content flex-grow-1">
                      <div className="info-label">Teléfono</div>
                      <div className="info-value">{m.telefono}</div>
                    </div>
                  </div>

                  <div className="info-row mb-3">
                    <Icon name="envelope" className="info-icon" />
                    <div className="info-content flex-grow-1">
                      <div className="info-label">Email</div>
                      <div className="info-value">{m.email || "No proporcionado"}</div>
                    </div>
                  </div>

                  <div className="info-row mb-3">
                    <Icon name="building" className="info-icon" />
                    <div className="info-content flex-grow-1">
                      <div className="info-label">Colegio de Procedencia</div>
                      <div className="info-value">{m.colegioProcedencia || "No proporcionado"}</div>
                    </div>
                  </div>

                  <div className="info-row mb-3">
                    <Icon name="mortarboard" className="info-icon" />
                    <div className="info-content flex-grow-1">
                      <div className="info-label">Modalidad / Grupo</div>
                      <div className="info-value">
                        {m.modalidad?.nombre} - Grupo {m.grupo?.nombre}
                      </div>
                    </div>
                  </div>

                  <div className="info-row mb-3">
                    <Icon name="book" className="info-icon" />
                    <div className="info-content flex-grow-1">
                      <div className="info-label">Carrera Principal</div>
                      <div className="info-value">{m.carreraPrincipal?.nombre}</div>
                    </div>
                  </div>

                  <div className="info-row mb-3">
                    <Icon name="credit-card" className="info-icon" />
                    <div className="info-content flex-grow-1">
                      <div className="info-label">Tipo de Pago</div>
                      <div className="info-value">{m.tipoPago}</div>
                    </div>
                  </div>

                  {/* Comprobante */}
                  <div className="comprobante-section mt-3">
                    <h4 className="mb-3"><Icon name="paperclip" /> Comprobante de Pago</h4>
                    {m.comprobanteUrl ? (
                      <button
                        className="btn-ver-comprobante w-100"
                        onClick={() => window.open(`http://localhost:4000${m.comprobanteUrl}`, "_blank")}
                      >
                        <Icon name="eye" />
                        Ver Comprobante
                      </button>
                    ) : (
                      <div className="no-comprobante">
                        Sin comprobante
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-actions d-flex gap-3 mt-3">
                  <button
                    onClick={() => aprobarMatricula(m.id, m.telefono)}
                    className="btn-action btn-aprobar flex-fill"
                  >
                    <Icon name="check-lg" />
                    Aprobar
                  </button>
                  <button
                    onClick={() => rechazarMatricula(m.id, m.telefono)}
                    className="btn-action btn-rechazar flex-fill"
                  >
                    <Icon name="x-lg" />
                    Rechazar
                  </button>
                </div>
              </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminSidebarLayout>
  );
}
