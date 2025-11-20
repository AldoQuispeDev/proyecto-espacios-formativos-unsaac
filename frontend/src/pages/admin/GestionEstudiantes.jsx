// src/pages/admin/GestionEstudiantes.jsx

import React, { useState, useEffect } from "react";
import AdminSidebarLayout from "../../components/AdminSidebarLayout";
import EstudianteFormModal from "../../components/EstudianteFormModal"; 
import { getEstudiantes, toggleEstudianteActive } from "../../api/estudiantes";

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
      alert(`Estudiante ${action} correctamente.`);
      fetchEstudiantes(); 
    } catch (err) {
      console.error(`Error al ${action}:`, err);
      alert(`Error al ${action} el estudiante.`);
    }
  };

  const handleOpenEditModal = (estudiante) => {
    setEstudianteToEdit(estudiante); // Modo: Edición
    setIsModalOpen(true);
  };
  
  // 🛑 NUEVA FUNCIÓN PARA ABRIR EL MODAL EN MODO CREACIÓN
  const handleOpenCreateModal = () => {
    setEstudianteToEdit(null); // Pasa null para indicar modo creación
    setIsModalOpen(true);
  };
  
  if (loading && estudiantes.length === 0 && searchQuery === '') return <AdminSidebarLayout title="Gestión de Estudiantes"><p className="text-gray-500">Cargando estudiantes...</p></AdminSidebarLayout>;

  return (
    <AdminSidebarLayout title="Gestión de Estudiantes">
      <h2 className="text-xl font-semibold mb-4">Control de Perfiles</h2>
      
      {/* BARRA DE FILTROS, BÚSQUEDA Y AÑADIR */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
        
        <div className="flex space-x-3 w-2/3">
          <input
            type="text"
            placeholder="Buscar por nombre, DNI o correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-md w-1/2"
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

        {/* 🛑 BOTÓN DE AÑADIR */}
        <button
          onClick={handleOpenCreateModal} 
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          ➕ Añadir Estudiante
        </button>
      </div>

      {error && <div className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</div>}

      {/* Tabla de Estudiantes */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 bg-white tabla-estudiantes">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI / Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apoderado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {estudiantes.map((e) => (
              <tr key={e.usuarioId} className={e.usuario.activo ? "" : "bg-red-50"}>
                <td className="px-6 py-4 whitespace-nowrap">{`${e.usuario.nombre} ${e.usuario.apellidoPaterno} ${e.usuario.apellidoMaterno}`}</td>
                <td className="px-6 py-4 whitespace-nowrap">{`${e.usuario.dni} / ${e.usuario.correo}`}</td>
                <td className="px-6 py-4 whitespace-nowrap">{e.nombreApoderado || "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${e.usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {e.usuario.activo ? "ACTIVO" : "INACTIVO"}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(e)}
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleActive(e.usuario.id, e.usuario.activo)}
                    className={`font-medium ${e.usuario.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                  >
                    {e.usuario.activo ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Editar Estudiante */}
      {isModalOpen && (
        <EstudianteFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchEstudiantes}
          estudiante={estudianteToEdit}
        />
      )}
    </AdminSidebarLayout>
  );
}