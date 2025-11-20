// src/pages/admin/GestionCatalogos.jsx

import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AdminSidebarLayout from '../../components/AdminSidebarLayout';

// 🛑 IMPORTAR EL COMPONENTE FUNCIONAL DE MODALIDADES (CRUD IMPLEMENTADO)
import GestionModalidades from "./GestionModalidades"; 

// Componentes de sub-módulos (PENDIENTES: Se crearán a continuación)
const GestionGrupos = () => 
    <div className="p-4 text-gray-600">Gestión de Grupos (CRUD Pendiente)</div>;
const GestionCarreras = () => 
    <div className="p-4 text-gray-600">Gestión de Carreras (CRUD Pendiente)</div>;
const GestionAsignaturas = () => 
    <div className="p-4 text-gray-600">Gestión de Asignaturas (CRUD Pendiente)</div>;
const GestionAulas = () => 
    <div className="p-4 text-gray-600">Gestión de Aulas (CRUD Pendiente)</div>;


// --- Componente Principal de Gestión de Catálogos ---

export default function GestionCatalogos() {
  const navigate = useNavigate();
  const location = useLocation();

  const getBasePath = () => {
      // Retorna '/admin/catalogos'
      return '/admin/catalogos';
  };
  
  // Definición de enlaces internos para las pestañas
  const catalogLinks = [
      { name: 'Modalidades', path: `${getBasePath()}/modalidades` },
      { name: 'Grupos', path: `${getBasePath()}/grupos` },
      { name: 'Carreras', path: `${getBasePath()}/carreras` },
      { name: 'Asignaturas', path: `${getBasePath()}/asignaturas` },
      { name: 'Aulas', path: `${getBasePath()}/aulas` },
  ];

  const isActiveLink = (path) => location.pathname === path;

  return (
    <AdminSidebarLayout title="Catálogos Académicos">
      
      {/* Barra de Navegación de Pestañas */}
      <div className="flex border-b border-gray-300 mb-6 space-x-4">
        {catalogLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => navigate(link.path)}
            className={`py-2 px-4 text-sm font-medium transition duration-150 ease-in-out 
              ${isActiveLink(link.path) 
                ? 'border-b-2 border-indigo-600 text-indigo-600' 
                : 'text-gray-500 hover:text-indigo-600 hover:border-indigo-600 hover:border-b-2'
              }`
            }
          >
            {link.name}
          </button>
        ))}
      </div>

      {/* Contenido Dinámico de Rutas Internas */}
      <div className="p-4 border border-gray-200 rounded-lg bg-white">
        <Routes>
            {/* Rutas con path relativo al elemento padre */}
            <Route path="modalidades" element={<GestionModalidades />} />
            <Route path="grupos" element={<GestionGrupos />} />
            <Route path="carreras" element={<GestionCarreras />} />
            <Route path="asignaturas" element={<GestionAsignaturas />} />
            <Route path="aulas" element={<GestionAulas />} />
            
            {/* Ruta por defecto o índice: redirige a Modalidades */}
            <Route path="*" element={<GestionModalidades />} /> 
        </Routes>
      </div>

    </AdminSidebarLayout>
  );
}