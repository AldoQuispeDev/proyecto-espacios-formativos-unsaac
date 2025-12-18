import { useState, useEffect } from "react";
import { getAulas, createAula, updateAula, deleteAula } from "../api/horarios";
import Icon from "./Icon";
import "./AulaFormModal.css";

export default function AulaFormModal({ isOpen, onClose }) {
  const [aulas, setAulas] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    capacidad: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      console.error("Error al cargar aulas:", err);
      setError("Error al cargar las aulas");
    }
  };

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
      if (editingId) {
        await updateAula(editingId, formData);
      } else {
        await createAula(formData);
      }

      setFormData({ nombre: "", capacidad: "" });
      setEditingId(null);
      fetchAulas();
    } catch (err) {
      console.error("Error al guardar aula:", err);
      setError(err.response?.data?.error || "Error al guardar el aula");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (aula) => {
    setFormData({
      nombre: aula.nombre,
      capacidad: aula.capacidad || "",
    });
    setEditingId(aula.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta aula?")) return;

    try {
      await deleteAula(id);
      fetchAulas();
    } catch (err) {
      console.error("Error al eliminar aula:", err);
      alert(err.response?.data?.error || "Error al eliminar el aula");
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: "", capacidad: "" });
    setEditingId(null);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content aula-modal">
        <div className="modal-header">
          <h2><Icon name="building" size="md" /> Gestión de Aulas</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="aula-modal-body">
          {/* FORMULARIO */}
          <div className="aula-form-section">
            <h3>{editingId ? "Editar Aula" : "Nueva Aula"}</h3>
            <form onSubmit={handleSubmit} className="aula-form">
              {error && <div className="form-error">{error}</div>}

              <div className="form-group">
                <label htmlFor="nombre">
                  Nombre del Aula <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Aula A-101, Virtual 1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacidad">Capacidad (opcional)</label>
                <input
                  type="number"
                  id="capacidad"
                  name="capacidad"
                  value={formData.capacidad}
                  onChange={handleChange}
                  placeholder="Ej: 30"
                  min="1"
                />
              </div>

              <div className="form-actions">
                {editingId && (
                  <button type="button" className="btn-cancel" onClick={handleCancel}>
                    Cancelar
                  </button>
                )}
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Guardando..." : editingId ? "Actualizar" : "Crear Aula"}
                </button>
              </div>
            </form>
          </div>

          {/* LISTA DE AULAS */}
          <div className="aula-list-section">
            <h3>Aulas Registradas ({aulas.length})</h3>
            <div className="aula-list">
              {aulas.length === 0 ? (
                <div className="empty-state">
                  <p>No hay aulas registradas</p>
                  <p className="empty-hint">Crea la primera aula usando el formulario</p>
                </div>
              ) : (
                aulas.map((aula) => (
                  <div key={aula.id} className="aula-item">
                    <div className="aula-item-info">
                      <h4>{aula.nombre}</h4>
                      {aula.capacidad && (
                        <p className="aula-capacidad">Capacidad: {aula.capacidad} personas</p>
                      )}
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
