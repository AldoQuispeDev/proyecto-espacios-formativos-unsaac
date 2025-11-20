// src/components/AdminSidebarLayout.jsx

import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Layout from './Layout';

// Definición de enlaces de navegación lateral
const AdminNavLinks = [
  { name: 'Dashboard', path: '/admin', icon: '🏠' },
  { name: 'Validar Matrículas', path: '/admin/validarMatricula', icon: '📝' },
  { name: 'Gestión de Docentes', path: '/admin/docentes', icon: '👨‍🏫' },
  // 🛑 NUEVO MÓDULO: GESTIÓN DE ESTUDIANTES
  { name: 'Gestión de Estudiantes', path: '/admin/estudiantes', icon: '🎓' }, 
  { name: 'Catálogos Académicos', path: '/admin/catalogos', icon: '📚' },
];

export default function AdminSidebarLayout({ title, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cerrarSesion } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  return (
    <Layout onLogout={cerrarSesion} fullWidth={true} title={title}>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex w-full bg-white shadow-lg rounded-xl min-h-[80vh]">

        {/* SIDEBAR */}
        <aside className="w-64 bg-gray-800 text-white p-4 flex-shrink-0 rounded-l-xl">
          <h3 className="text-2xl font-bold mb-6 text-yellow-400">Panel Admin</h3>

          <nav>
            <p className="text-gray-400 text-xs uppercase mb-2">Administrador</p>
            <ul>
              {AdminNavLinks.map((link) => (
                <li key={link.path} className="mb-1">
                  <button
                    onClick={() => navigate(link.path)}
                    className={`
                      flex items-center w-full p-2 rounded-lg text-left transition duration-150 ease-in-out
                      ${isActive(link.path)
                        ? 'bg-yellow-500 text-gray-900 font-semibold'
                        : 'hover:bg-gray-700'}
                    `}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-grow p-8 bg-gray-50">
          <h1 className="text-3xl font-light text-gray-800 mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </Layout>
  );
}
