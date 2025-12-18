// src/pages/admin/GestionEstudiantes.jsx

import { useState, useEffect } from "react";
import AdminSidebarLayout from "../../components/AdminSidebarLayout";
import EstudianteFormModal from "../../components/EstudianteFormModal"; 
import { getEstudiantes, toggleEstudianteActive } from "../../api/estudiantes";
import Icon from "../../components/Icon";
import './GestionEstudiantes.css';

export default function GestionEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState('true'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estudianteToEdit, setEstudianteToEdit] = useState(null);

  const fetchEstudiantes = async () => {
    setLoading(true);
    try {
      const res = await getEstudiantes(searchQuery, filterActive);
      setEstudiantes(res.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar estudiantes:", err);
      setError("Error al cargar la lista de estudiantes.");
      setEstudiantes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
        fetchEstudiantes();
    }, 400); 

    return () => clearTimeout(handler);
  }, [searchQuery, filterActive]);

  const handleToggleActive = async (usuarioId, currentState) => {
    const newState = !currentState;
    const action = newState ? "activar" : "desactivar";
    if (!window.confirm(`¿Estás seguro de ${action} a este estudiante?`)) return;

    try {
      await toggleEstudianteActive(usuarioId, newState); 
      fetchEstudiantes(); 
    } catch (err) {
      console.error(`Error al ${action}:`, err);
      setError(`Error al ${action} el estudiante.`);
    }
  };

  const handleOpenEditModal = (estudiante) => {
    setEstudianteToEdit(estudiante);
    setIsModalOpen(true);
  };
  
  const handleOpenCreateModal = () => {
    setEstudianteToEdit(null);
    setIsModalOpen(true);
  };

  // Calcular estadísticas
  const activeCount = estudiantes.filter(e => e.usuario.activo).length;
  const inactiveCount = estudiantes.filter(e => !e.usuario.activo).length;

  return (
    <AdminSidebarLayout title="Gestión de Estudiantes">
      <div className="gestion-estudiantes-container">
        
        {/* HEADER */}
        <div className="estudiantes-header mb-4">
          <h2 className="estudiantes-title mb-3 mb-lg-0">
            <Icon name="mortarboard" size="lg" className="title-icon" />
            Control de Perfiles
          </h2>
          <div className="estudiantes-stats d-flex flex-column flex-lg-row gap-3">
            <div className="stat-badge">
              <Icon name="bar-chart" />
              Total: {estudiantes.length}
            </div>
            <div className="stat-badge active">
              <Icon name="check-circle-fill" />
              Activos: {activeCount}
            </div>
            <div className="stat-badge inactive">
              <Icon name="x-circle-fill" />
              Inactivos: {inactiveCount}
            </div>
          </div>
        </div>
        
        {/* BARRA DE FILTROS */}
        <div className="filters-bar mb-4">
          <div className="filters-group flex-grow-1">
            <div className="search-wrapper flex-grow-1">
              <Icon name="search" className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por nombre, DNI o correo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-100"
              />
            </div>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="filter-select"
            >
              <option value="true"><Icon name="check-circle-fill" size="sm" /> Activos</option>
              <option value="false"><Icon name="x-circle-fill" size="sm" /> Desactivados</option>
              <option value="all"><Icon name="file-text" size="sm" /> Todos</option>
            </select>
          </div>

          <button
            onClick={handleOpenCreateModal} 
            className="btn-add-student"
          >
            <Icon name="plus-circle" />
            Añadir Estudiante
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="error-message mb-4">
            <Icon name="exclamation-triangle" className="error-icon" />
            {error}
          </div>
        )}

        {/* TABLA */}
        {loading && estudiantes.length === 0 ? (
          <div className="loading-container text-center py-5">
            <div className="spinner mx-auto mb-3"></div>
            <p className="mb-0">Cargando estudiantes...</p>
          </div>
        ) : estudiantes.length === 0 ? (
          <div className="empty-state text-center py-5">
            <Icon name="inbox" size="xl" className="empty-icon" />
            <h3 className="empty-title mb-2">
              {searchQuery ? 'No se encontraron resultados' : 'No hay estudiantes registrados'}
            </h3>
            <p className="empty-description mb-0">
              {searchQuery ? 'Intenta con otro término de búsqueda' : 'Añade tu primer estudiante usando el botón de arriba'}
            </p>
          </div>
        ) : (
          <div className="table-container table-responsive">
            <table className="estudiantes-table table table-hover mb-0">
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>DNI / Correo</th>
                  <th>Apoderado</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((e) => (
                  <tr key={e.usuarioId} className={!e.usuario.activo ? 'inactive-row' : ''}>
                    <td>
                      <div className="student-name">
                        {`${e.usuario.nombre} ${e.usuario.apellidoPaterno} ${e.usuario.apellidoMaterno}`}
                      </div>
                    </td>
                    <td>
                      <div className="student-info d-flex flex-column gap-1">
                        <span className="info-primary"><Icon name="file-text" size="sm" /> {e.usuario.dni}</span>
                        <span className="info-secondary"><Icon name="envelope" size="sm" /> {e.usuario.correo}</span>
                      </div>
                    </td>
                    <td>
                      <div className="student-info d-flex flex-column gap-1">
                        <span className="info-primary">
                          {e.nombreApoderado ? <><Icon name="person" size="sm" /> {e.nombreApoderado}</> : '—'}
                        </span>
                        {e.telefonoApoderado && (
                          <span className="info-secondary"><Icon name="telephone" size="sm" /> {e.telefonoApoderado}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${e.usuario.activo ? 'active' : 'inactive'}`}>
                        <Icon name={e.usuario.activo ? "check-circle-fill" : "x-circle-fill"} size="sm" />
                        {e.usuario.activo ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions d-flex gap-2">
                        <button
                          onClick={() => handleOpenEditModal(e)}
                          className="btn-action btn-edit"
                        >
                          <Icon name="pencil" size="sm" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleToggleActive(e.usuario.id, e.usuario.activo)}
                          className={`btn-action btn-toggle ${!e.usuario.activo ? 'activate' : ''}`}
                        >
                          <Icon name={e.usuario.activo ? "lock" : "unlock"} size="sm" />
                          {e.usuario.activo ? "Desactivar" : "Activar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal para Editar/Crear Estudiante */}
        {isModalOpen && (
          <EstudianteFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchEstudiantes}
            estudiante={estudianteToEdit}
          />
        )}
      </div>
    </AdminSidebarLayout>
  );
}
