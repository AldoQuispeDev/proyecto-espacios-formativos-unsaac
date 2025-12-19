import { useEffect, useState } from "react";
import AdminSidebarLayout from "../../components/AdminSidebarLayout";
import HorarioFormModal from "../../components/HorarioFormModal";
import AulaFormModal from "../../components/AulaFormModal";
import { getClases, deleteClase } from "../../api/horarios";
import Icon from "../../components/Icon";
import "./GestionHorarios.css";

const UI_DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const DIA_ENUM = {
  Lunes: "LUNES",
  Martes: "MARTES",
  Miércoles: "MIERCOLES",
  Jueves: "JUEVES",
  Viernes: "VIERNES",
};

const HORAS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "16:00", "17:00", "18:00", "19:00",
];

const hhmmToMin = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const formatMin = (min) => {
  const h = Math.floor(min / 60).toString().padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

export default function GestionHorarios() {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [vista, setVista] = useState("calendario");
  const [isHorarioModalOpen, setIsHorarioModalOpen] = useState(false);
  const [isAulaModalOpen, setIsAulaModalOpen] = useState(false);
  const [claseEdit, setClaseEdit] = useState(null);

  const fetchClases = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getClases();
      setClases(res.data);
    } catch (err) {
      console.error("❌ Error al cargar horarios:", err);
      setError("Error al cargar el horario");
      setClases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClases();
  }, []);

  const getClasesForCelda = (diaUI, horaUI) => {
    const diaSemana = DIA_ENUM[diaUI];
    const minuto = hhmmToMin(horaUI);

    return clases.filter(
      (c) => c.diaSemana === diaSemana && minuto >= c.horaInicio && minuto < c.horaFin
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta clase?")) return;
    try {
      await deleteClase(id);
      fetchClases();
    } catch (err) {
      alert(err.response?.data?.error || "Error al eliminar");
    }
  };

  return (
    <AdminSidebarLayout title="Gestión de Horarios">
      <div className="horarios-header">
        <div>
          <h2>Control de Clases y Horarios</h2>
          <p>Administra horarios, docentes y aulas</p>
        </div>

        <div className="horarios-actions">
          <button className="btn-secondary" onClick={() => setIsAulaModalOpen(true)}>
            <Icon name="building" /> Gestionar Aulas
          </button>

          <button
            className="btn-primary"
            onClick={() => {
              setClaseEdit(null);
              setIsHorarioModalOpen(true);
            }}
          >
            <Icon name="plus-circle" /> Nueva Clase
          </button>
        </div>
      </div>

      <div className="horarios-toolbar">
        <button className={vista === "calendario" ? "active" : ""} onClick={() => setVista("calendario")}>
          <Icon name="calendar3" /> Calendario
        </button>
        <button className={vista === "lista" ? "active" : ""} onClick={() => setVista("lista")}>
          <Icon name="list-ul" /> Lista
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <Icon name="exclamation-triangle" /> {error}
          <button onClick={fetchClases}>Reintentar</button>
        </div>
      )}

      {vista === "calendario" && !loading && (
        <div className="horario-calendario">
          <div className="calendario-header">
            <div className="hora-header">Hora</div>
            {UI_DIAS.map((d) => (
              <div key={d} className="dia-header">{d}</div>
            ))}
          </div>

          {HORAS.map((hora) => (
            <div key={hora} className="calendario-row">
              <div className="hora-cell">{hora}</div>

              {UI_DIAS.map((dia) => (
                <div key={dia + hora} className="clase-cell">
                  {getClasesForCelda(dia, hora).map((clase) => (
                    <div
                      key={clase.id}
                      className="clase-card"
                      onClick={() => {
                        setClaseEdit(clase);
                        setIsHorarioModalOpen(true);
                      }}
                    >
                      <strong>{clase.asignatura.nombre}</strong>

                      <div className="small">
                        {clase.grupo.modalidad.nombre} · Grupo {clase.grupo.letra}
                      </div>

                      <div className="small">
                        <Icon name="person-video3" />{" "}
                        {clase.docente.usuario.nombre} {clase.docente.usuario.apellidoPaterno}
                      </div>

                      <div className="small">
                        <Icon name="building" /> {clase.aula.nombre} (Piso {clase.aula.piso})
                      </div>

                      <div className="small">
                        <Icon name="clock" /> {formatMin(clase.horaInicio)} - {formatMin(clase.horaFin)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {vista === "lista" && !loading && (
        <table className="horario-table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Horario</th>
              <th>Asignatura</th>
              <th>Grupo</th>
              <th>Docente</th>
              <th>Aula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clases.length === 0 ? (
              <tr><td colSpan="7">No hay clases registradas</td></tr>
            ) : (
              clases.map((c) => (
                <tr key={c.id}>
                  <td>{c.diaSemana}</td>
                  <td>{formatMin(c.horaInicio)} - {formatMin(c.horaFin)}</td>
                  <td>{c.asignatura.nombre}</td>
                  <td>{c.grupo.modalidad.nombre} · Grupo {c.grupo.letra}</td>
                  <td>{c.docente.usuario.nombre} {c.docente.usuario.apellidoPaterno}</td>
                  <td>{c.aula.nombre}</td>
                  <td>
                    <button onClick={() => { setClaseEdit(c); setIsHorarioModalOpen(true); }}>
                      <Icon name="pencil" />
                    </button>
                    <button onClick={() => handleDelete(c.id)}>
                      <Icon name="trash" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {isHorarioModalOpen && (
        <HorarioFormModal
          isOpen={isHorarioModalOpen}
          onClose={() => setIsHorarioModalOpen(false)}
          onSuccess={fetchClases}
          clase={claseEdit}
        />
      )}

      {isAulaModalOpen && (
        <AulaFormModal isOpen={isAulaModalOpen} onClose={() => setIsAulaModalOpen(false)} />
      )}
    </AdminSidebarLayout>
  );
}
