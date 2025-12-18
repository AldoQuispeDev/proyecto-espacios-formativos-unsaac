// src/pages/admin/GestionDocentes.jsx

import React, { useState, useEffect } from "react";
import AdminSidebarLayout from "../../components/AdminSidebarLayout";
import DocenteFormModal from "../../components/DocenteFormModal";
import { getDocentes, deactivateDocente } from "../../api/docentes";
import Icon from "../../components/Icon";

export default function GestionDocentes() {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState('true');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docenteToEdit, setDocenteToEdit] = useState(null); 

  const fetchDocentes = async () => {
    setLoading(true);
    try {
      const res = await getDocentes(searchQuery, filterActive);
      setDocentes(res.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar docentes:", err);
      setError("Error al cargar la lista de docentes. Revise la consola.");
      setDocentes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
        fetchDocentes();
    }, 400); 

    return () => clearTimeout(handler);
  }, [searchQuery, filterActive]);


  const handleOpenCreateModal = () => {
    setDocenteToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (docente) => {
    setDocenteToEdit(docente);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (usuarioId, currentState) => {
    const newState = !currentState;
    const action = newState ? "activar" : "desactivar";
    if (!window.confirm(`¿Estás seguro de ${action} a este docente?`)) return;

    try {
      await deactivateDocente(usuarioId); 
      alert(`Docente ${action} correctamente.`);
      fetchDocentes();
    } catch (err) {
      console.error(`Error al ${action}:`, err);
      alert(`Error al ${action} el docente.`);
    }
  };

  if (loading && docentes.length === 0 && searchQuery === '') return <AdminSidebarLayout title="Gestión de Docentes"><p className="text-gray-500">Cargando docentes...</p></AdminSidebarLayout>;

  return (
    <AdminSidebarLayout title="Gestión de Docentes">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Lista de Docentes</h2>
        <button
          onClick={handleOpenCreateModal}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          <Icon name="plus-circle" size="sm" className="me-1" /> Añadir Docente
        </button>
      </div>

      {/* BARRA DE FILTROS Y BÚSQUEDA */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
        <input
          type="text"
          placeholder="Buscar por nombre, DNI o correo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-md w-1/3"
        />
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="true">Activos</option>
          <option value="false">Desactivados</option>
          <option value="all">Todos</option>
        </select>
      </div>

      {error && <div className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</div>}

      <div className="overflow-x-auto shadow-lg rounded-lg tabla-docentes-container">

        <table className="min-w-full divide-y divide-gray-200 bg-white tabla-docentes">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {docentes.map((d) => (
              <tr key={d.usuarioId} className={d.usuario.activo ? "" : "bg-red-50"}>
                <td className="px-6 py-4 whitespace-nowrap">{`${d.usuario.nombre} ${d.usuario.apellidoPaterno} ${d.usuario.apellidoMaterno}`}</td>
                <td className="px-6 py-4 whitespace-nowrap">{d.usuario.correo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{d.especialidad}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${d.usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {d.usuario.activo ? "ACTIVO" : "INACTIVO"}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(d)}
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleActive(d.usuario.id, d.usuario.activo)}
                    className={`font-medium ${d.usuario.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                  >
                    {d.usuario.activo ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear/Editar */}
      {isModalOpen && (
        <DocenteFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchDocentes}
          docente={docenteToEdit}
        />
      )}
    </AdminSidebarLayout>
  );
}
