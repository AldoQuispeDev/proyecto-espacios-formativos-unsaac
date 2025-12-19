import { useState, useEffect } from "react";
import { getAulas, createAula, updateAula, deleteAula } from "../api/horarios";
import Icon from "./Icon";
import "./AulaFormModal.css";

export default function AulaFormModal({ isOpen, onClose }) {
  const [aulas, setAulas] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    piso: "",
    capacidad: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // CARGAR AULAS
  // =========================
  useEffect(() => {
    if (isOpen) {
      fetchAulas();
    }
  }, [isOpen]);

  const fetchAulas = async () => {
    try {
      const res = await getAulas();
      setAulas(res.data);
    } catch (err) {
      console.error("❌ Error al cargar aulas:", err);
      setError("Error al cargar las aulas");
    }
  };

  // =========================
  // HANDLERS
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        piso: Number(formData.piso),
        capacidad: formData.capacidad ? Number(formData.capacidad) : 40,
      };

      if (!payload.nombre || !payload.piso) {
        throw new Error("Nombre y piso son obligatorios");
      }

      if (editingId) {
        await updateAula(editingId, payload);
      } else {
        await createAula(payload);
      }

      resetForm();
      fetchAulas();
    } catch (err) {
      console.error("❌ Error al guardar aula:", err);
      setError(err.response?.data?.error || err.message || "Error al guardar el aula");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (aula) => {
    setFormData({
      nombre: aula.nombre,
      piso: aula.piso.toString(),
      capacidad: aula.capacidad?.toString() || "",
    });
    setEditingId(aula.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta aula?")) return;

    try {
      await deleteAula(id);
      fetchAulas();
    } catch (err) {
      console.error("❌ Error al eliminar aula:", err);
      alert(err.response?.data?.error || "Error al eliminar el aula");
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      piso: "",
      capacidad: "",
    });
    setEditingId(null);
    setError("");
  };

  if (!isOpen) return null;

  // =========================
  // RENDER
  // =========================
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content aula-modal">
        {/* HEADER */}
        <div className="modal-header">
          <h2>
            <Icon name="building" size="md" /> Gestión de Aulas
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="aula-modal-body">
          {/* ================= FORMULARIO ================= */}
          <div className="aula-form-section">
            <h3>{editingId ? "Editar Aula" : "Nueva Aula"}</h3>

            <form onSubmit={handleSubmit} className="aula-form">
              {error && <div className="form-error">{error}</div>}

              <div className="form-group">
                <label>
                  Nombre del Aula <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Aula 101"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Piso <span className="required">*</span>
                </label>
                <select
                  name="piso"
                  value={formData.piso}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar piso</option>
                  <option value="1">Piso 1</option>
                  <option value="2">Piso 2</option>
                  <option value="3">Piso 3</option>
                </select>
              </div>

              <div className="form-group">
                <label>Capacidad (opcional)</label>
                <input
                  type="number"
                  name="capacidad"
                  value={formData.capacidad}
                  onChange={handleChange}
                  placeholder="Ej: 40"
                  min="1"
                />
              </div>

              <div className="form-actions">
                {editingId && (
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={resetForm}
                  >
                    Cancelar
                  </button>
                )}
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading
                    ? "Guardando..."
                    : editingId
                    ? "Actualizar Aula"
                    : "Crear Aula"}
                </button>
              </div>
            </form>
          </div>

          {/* ================= LISTA ================= */}
          <div className="aula-list-section">
            <h3>Aulas Registradas ({aulas.length})</h3>

            <div className="aula-list">
              {aulas.length === 0 ? (
                <div className="empty-state">
                  <p>No hay aulas registradas</p>
                </div>
              ) : (
                aulas.map((aula) => (
                  <div key={aula.id} className="aula-item">
                    <div className="aula-item-info">
                      <h4>{aula.nombre}</h4>
                      <p>Piso {aula.piso}</p>
                      <p>Capacidad: {aula.capacidad}</p>
                    </div>

                    <div className="aula-item-actions">
                      <button
                        className="btn-edit-small"
                        onClick={() => handleEdit(aula)}
                        title="Editar"
                      >
                        <Icon name="pencil" size="sm" />
                      </button>
                      <button
                        className="btn-delete-small"
                        onClick={() => handleDelete(aula.id)}
                        title="Eliminar"
                      >
                        <Icon name="trash" size="sm" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
