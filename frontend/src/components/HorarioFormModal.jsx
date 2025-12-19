import { useEffect, useMemo, useState } from "react";
import {
  createClase,
  updateClase,
  getAulas,
  getModalidades,
  getGrupos,
  getAsignaturas,
  getTurnos,
  getDocentesPorAsignatura,
} from "../api/horarios";
import "./HorarioFormModal.css";

const UI_DIAS = [
  { label: "Lunes", value: "LUNES" },
  { label: "Martes", value: "MARTES" },
  { label: "Miércoles", value: "MIERCOLES" },
  { label: "Jueves", value: "JUEVES" },
  { label: "Viernes", value: "VIERNES" },
];

const HORAS_VALIDAS = ["07:00", "09:00", "11:00", "16:00", "18:00"];

export default function HorarioFormModal({ isOpen, onClose, onSuccess, clase }) {
  const isEditMode = !!clase;

  const [form, setForm] = useState({
    modalidadId: "",
    grupoId: "",
    turnoId: "",
    asignaturaId: "",
    docenteId: "",
    diaSemana: "",
    horaInicio: "",
    aulaId: "",
  });

  const [modalidades, setModalidades] = useState([]);
  const [grupos, setGruposState] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [asignaturas, setAsignaturasState] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [aulas, setAulasState] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const modalidadSeleccionada = useMemo(
    () => modalidades.find((m) => String(m.id) === String(form.modalidadId)),
    [modalidades, form.modalidadId]
  );

  const pisosSugeridos = useMemo(() => {
    if (!modalidadSeleccionada) return [];
    const pisos = [modalidadSeleccionada.pisoPreferido];
    if (modalidadSeleccionada.pisoAlterno) pisos.push(modalidadSeleccionada.pisoAlterno);
    pisos.push(3);
    return [...new Set(pisos)];
  }, [modalidadSeleccionada]);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setError("");
      const [m, t, a] = await Promise.all([getModalidades(), getTurnos(), getAsignaturas()]);
      setModalidades(m.data);
      setTurnos(t.data);
      setAsignaturasState(a.data);
    })().catch((e) => setError(e.response?.data?.error || "Error al cargar datos"));
  }, [isOpen]);

  // Edit preload
  useEffect(() => {
    if (!isOpen || !isEditMode || !clase) return;

    const modalidadId = String(clase.grupo?.modalidad?.id || "");
    const grupoId = String(clase.grupoId || clase.grupo?.id || "");
    const turnoId = String(clase.turnoId || clase.turno?.id || "");
    const asignaturaId = String(clase.asignaturaId || clase.asignatura?.id || "");
    const docenteId = String(clase.docenteId || clase.docente?.id || "");
    const aulaId = String(clase.aulaId || clase.aula?.id || "");
    const diaSemana = clase.diaSemana || "";

    const hh = Math.floor(clase.horaInicio / 60).toString().padStart(2, "0");
    const mm = (clase.horaInicio % 60).toString().padStart(2, "0");
    const horaInicio = `${hh}:${mm}`;

    setForm({
      modalidadId,
      grupoId,
      turnoId,
      asignaturaId,
      docenteId,
      diaSemana,
      horaInicio,
      aulaId,
    });
  }, [isOpen, isEditMode, clase]);

  // Modalidad -> grupos
  useEffect(() => {
    if (!form.modalidadId) {
      setGruposState([]);
      return;
    }
    (async () => {
      const res = await getGrupos({ modalidadId: form.modalidadId });
      setGruposState(res.data);
    })().catch(() => {});
  }, [form.modalidadId]);

  // Aulas sugeridas por piso
  useEffect(() => {
    if (!pisosSugeridos.length) {
      setAulasState([]);
      return;
    }
    (async () => {
      const all = [];
      for (const piso of pisosSugeridos) {
        const res = await getAulas({ piso });
        all.push(...res.data);
      }
      const map = new Map(all.map((x) => [x.id, x]));
      setAulasState([...map.values()]);
    })().catch(() => {});
  }, [pisosSugeridos]);

  // Asignatura -> docentes
  useEffect(() => {
    if (!form.asignaturaId) {
      setDocentes([]);
      return;
    }
    (async () => {
      const res = await getDocentesPorAsignatura({ asignaturaId: form.asignaturaId });
      setDocentes(res.data);
    })().catch(() => {});
  }, [form.asignaturaId]);

  const horaFinUI = useMemo(() => {
    if (!form.horaInicio) return "";
    const [h, m] = form.horaInicio.split(":").map(Number);
    const total = h * 60 + m + 120;
    const hh = Math.floor(total / 60).toString().padStart(2, "0");
    const mm = (total % 60).toString().padStart(2, "0");
    return `${hh}:${mm}`;
  }, [form.horaInicio]);

  const set = (name) => (e) => setForm((p) => ({ ...p, [name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!HORAS_VALIDAS.includes(form.horaInicio)) {
        throw new Error("Hora inválida. Usa 07:00, 09:00, 11:00, 16:00 o 18:00");
      }

      const payload = {
        grupoId: Number(form.grupoId),
        asignaturaId: Number(form.asignaturaId),
        docenteId: Number(form.docenteId),
        aulaId: Number(form.aulaId),
        turnoId: Number(form.turnoId),
        diaSemana: form.diaSemana,
        horaInicio: form.horaInicio,
      };

      if (isEditMode) await updateClase(clase.id, payload);
      else await createClase(payload);

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Error al guardar la clase");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content horario-modal">
        <div className="modal-header">
          <h2>{isEditMode ? "Editar Clase" : "Nueva Clase"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="horario-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label>Modalidad *</label>
              <select value={form.modalidadId} onChange={set("modalidadId")} required>
                <option value="">Seleccionar modalidad</option>
                {modalidades.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} (Piso pref: {m.pisoPreferido}{m.pisoAlterno ? ` / alt: ${m.pisoAlterno}` : ""})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Grupo *</label>
              <select value={form.grupoId} onChange={set("grupoId")} required disabled={!form.modalidadId}>
                <option value="">Seleccionar grupo</option>
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>Grupo {g.letra}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Turno *</label>
              <select value={form.turnoId} onChange={set("turnoId")} required>
                <option value="">Seleccionar turno</option>
                {turnos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre} ({String(Math.floor(t.horaInicio/60)).padStart(2,"0")}:{String(t.horaInicio%60).padStart(2,"0")} - {String(Math.floor(t.horaFin/60)).padStart(2,"0")}:{String(t.horaFin%60).padStart(2,"0")})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Asignatura *</label>
              <select value={form.asignaturaId} onChange={set("asignaturaId")} required>
                <option value="">Seleccionar asignatura</option>
                {asignaturas.map((a) => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Docente (por especialidad) *</label>
              <select value={form.docenteId} onChange={set("docenteId")} required disabled={!form.asignaturaId}>
                <option value="">Seleccionar docente</option>
                {docentes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.usuario?.nombre} {d.usuario?.apellidoPaterno} {d.usuario?.apellidoMaterno}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Día *</label>
              <select value={form.diaSemana} onChange={set("diaSemana")} required>
                <option value="">Seleccionar día</option>
                {UI_DIAS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Hora Inicio *</label>
              <select value={form.horaInicio} onChange={set("horaInicio")} required>
                <option value="">Seleccionar</option>
                {HORAS_VALIDAS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              {horaFinUI && <small>Hora fin automática: <b>{horaFinUI}</b></small>}
            </div>

            <div className="form-group">
              <label>Aula (sugerida por piso) *</label>
              <select value={form.aulaId} onChange={set("aulaId")} required disabled={!form.modalidadId}>
                <option value="">Seleccionar aula</option>
                {aulas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre} (Piso {a.piso}){a.capacidad ? ` - Cap: ${a.capacidad}` : ""}
                  </option>
                ))}
              </select>
              {pisosSugeridos.length > 0 && (
                <small>Pisos sugeridos: <b>{pisosSugeridos.join(", ")}</b></small>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Guardando..." : isEditMode ? "Actualizar" : "Crear Clase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
