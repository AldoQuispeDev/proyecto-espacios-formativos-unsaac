// src/pages/admin/GestionModalidades.jsx

import React, { useState, useEffect } from 'react';
import { getModalidadesAdmin, createModalidad, updateModalidad, deleteModalidad } from '../../api/catalogos';

export default function GestionModalidades() {
    const [modalidades, setModalidades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nombre, setNombre] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);

    const fetchModalidades = async () => {
        setLoading(true);
        try {
            const res = await getModalidadesAdmin();
            setModalidades(res.data);
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

    const handleCreateUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        if (nombre.trim() === '') {
            setError("El nombre no puede estar vacío.");
            return;
        }

        try {
            if (editingId) {
                // Modo Edición
                await updateModalidad(editingId, nombre.trim());
                alert("Modalidad actualizada.");
            } else {
                // Modo Creación
                await createModalidad(nombre.trim());
                alert("Modalidad creada.");
            }
            
            setNombre('');
            setEditingId(null);
            fetchModalidades();
        } catch (err) {
            setError(err.response?.data?.error || "Error de operación.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Está seguro de eliminar esta modalidad? Se eliminará permanentemente si no tiene grupos asociados.")) return;
        
        try {
            await deleteModalidad(id);
            alert("Modalidad eliminada.");
            fetchModalidades();
        } catch (err) {
            setError(err.response?.data?.error || "Error al eliminar. Verifique que no tenga grupos asociados.");
        }
    };

    const startEdit = (modalidad) => {
        setEditingId(modalidad.id);
        setNombre(modalidad.nombre);
    };

    return (
        <div className="p-4">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Gestión de Modalidades</h3>

            {/* Formulario de Creación/Edición */}
            <form onSubmit={handleCreateUpdate} className="flex space-x-3 mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder={editingId ? "Editar nombre..." : "Nueva modalidad (Ej: Ordinario)"}
                    className="p-2 border rounded flex-grow"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 text-white rounded transition ${editingId ? 'bg-indigo-600' : 'bg-green-600'} hover:opacity-80`}
                >
                    {loading ? "Procesando..." : editingId ? "Guardar Cambios" : "Crear Modalidad"}
                </button>
                {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setNombre(''); }} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
                        Cancelar
                    </button>
                )}
            </form>

            {error && <div className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</div>}

            {/* Tabla de Listado */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupos Asoc.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {modalidades.map((m) => (
                            <tr key={m.id} className={editingId === m.id ? 'bg-yellow-50' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap">{m.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{m.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{m.grupos?.length || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button onClick={() => startEdit(m)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                                    <button 
                                        onClick={() => handleDelete(m.id)} 
                                        disabled={m.grupos?.length > 0} 
                                        className={`text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && <p className="p-4 text-center text-gray-500">Cargando datos...</p>}
            </div>
        </div>
    );
}