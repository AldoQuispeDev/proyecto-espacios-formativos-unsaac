// src/pages/admin/GestionModalidades.jsx

import { useState, useEffect } from 'react';
import { getModalidadesAdmin, createModalidad, updateModalidad, deleteModalidad } from '../../api/catalogos';
import Icon from '../../components/Icon';
import './GestionModalidades.css';

export default function GestionModalidades() {
    const [modalidades, setModalidades] = useState([]);
    const [filteredModalidades, setFilteredModalidades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nombre, setNombre] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchModalidades = async () => {
        setLoading(true);
        try {
            const res = await getModalidadesAdmin();
            setModalidades(res.data);
            setFilteredModalidades(res.data);
            setError(null);
        } catch (err) {
            setError("Error al cargar las modalidades.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModalidades();
    }, []);

    // Filtrar modalidades por búsqueda
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredModalidades(modalidades);
        } else {
            const filtered = modalidades.filter(m =>
                m.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredModalidades(filtered);
        }
    }, [searchTerm, modalidades]);

    const handleCreateUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        if (nombre.trim() === '') {
            setError("El nombre no puede estar vacío.");
            return;
        }

        setLoading(true);
        try {
            if (editingId) {
                await updateModalidad(editingId, nombre.trim());
            } else {
                await createModalidad(nombre.trim());
            }
            
            setNombre('');
            setEditingId(null);
            await fetchModalidades();
        } catch (err) {
            setError(err.response?.data?.error || "Error de operación.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Está seguro de eliminar esta modalidad? Se eliminará permanentemente si no tiene grupos asociados.")) return;
        
        setLoading(true);
        try {
            await deleteModalidad(id);
            await fetchModalidades();
        } catch (err) {
            setError(err.response?.data?.error || "Error al eliminar. Verifique que no tenga grupos asociados.");
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (modalidad) => {
        setEditingId(modalidad.id);
        setNombre(modalidad.nombre);
        setError(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNombre('');
        setError(null);
    };

    return (
        <div className="gestion-modalidades-container">
            {/* HEADER */}
            <div className="modalidades-header">
                <h3 className="modalidades-title">
                    <Icon name="mortarboard" className="title-icon" />
                    Gestión de Modalidades
                </h3>
                <div className="modalidades-count">
                    <Icon name="bar-chart" />
                    Total: {modalidades.length}
                </div>
            </div>

            {/* FORMULARIO */}
            <div className="form-section">
                <h4 className="form-title">
                    <Icon name={editingId ? "pencil" : "plus-circle"} className="form-icon" />
                    {editingId ? 'Editar Modalidad' : 'Nueva Modalidad'}
                </h4>
                <form onSubmit={handleCreateUpdate}>
                    <div className="form-group">
                        <div className="form-input-wrapper">
                            <Icon name="tag" className="input-icon" />
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder={editingId ? "Editar nombre de la modalidad..." : "Ej: Ordinario, Intensivo, Virtual"}
                                className="form-input"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-actions">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`btn-submit ${editingId ? 'editing' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner" style={{width: '16px', height: '16px', borderWidth: '2px'}}></span>
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <Icon name={editingId ? "save" : "stars"} size="sm" />
                                        {editingId ? 'Guardar Cambios' : 'Crear Modalidad'}
                                    </>
                                )}
                            </button>
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="btn-cancel" disabled={loading}>
                                    <Icon name="x-circle" size="sm" />
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="error-message">
                    <Icon name="exclamation-triangle" className="error-icon" />
                    {error}
                </div>
            )}

            {/* TABLA */}
            <div className="table-section">
                <div className="table-header">
                    <h4 className="table-header-title">
                        <Icon name="list-ul" />
                        Lista de Modalidades
                    </h4>
                    <div className="table-search">
                        <Icon name="search" className="search-icon-table" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar modalidad..."
                            className="table-search-input"
                        />
                    </div>
                </div>

                {loading && modalidades.length === 0 ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Cargando modalidades...</p>
                    </div>
                ) : filteredModalidades.length === 0 ? (
                    <div className="empty-state">
                        <Icon name="inbox" size="xl" className="empty-icon" />
                        <h3 className="empty-title">
                            {searchTerm ? 'No se encontraron resultados' : 'No hay modalidades registradas'}
                        </h3>
                        <p className="empty-description">
                            {searchTerm ? 'Intenta con otro término de búsqueda' : 'Crea tu primera modalidad usando el formulario de arriba'}
                        </p>
                    </div>
                ) : (
                    <table className="modalidades-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre de Modalidad</th>
                                <th>Grupos Asociados</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredModalidades.map((m) => (
                                <tr key={m.id} className={editingId === m.id ? 'editing' : ''}>
                                    <td className="table-id">#{m.id}</td>
                                    <td className="table-name">{m.nombre}</td>
                                    <td>
                                        <span className="table-badge">
                                            <Icon name="people" size="sm" />
                                            {m.grupos?.length || 0}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button 
                                                onClick={() => startEdit(m)} 
                                                className="btn-action btn-edit"
                                                disabled={loading}
                                            >
                                                <Icon name="pencil" size="sm" />
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(m.id)} 
                                                disabled={m.grupos?.length > 0 || loading} 
                                                className="btn-action btn-delete"
                                                title={m.grupos?.length > 0 ? 'No se puede eliminar: tiene grupos asociados' : 'Eliminar modalidad'}
                                            >
                                                <Icon name="trash" size="sm" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
