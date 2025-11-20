// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// Componentes de Página
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Matricula from "./pages/Matricula";
import Principal from "./pages/Principal";

// Componentes de Administración
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import ValidarMatricula from "./pages/admin/ValidarMatricula";
import GestionDocentes from "./pages/admin/GestionDocentes"; 
// 🛑 CORRECCIÓN: Usamos GestionEstudiantes para mayor claridad y consistencia.
import GestionEstudiantes from "./pages/admin/GestionEstudiantes"
import GestionCatalogos from "./pages/admin/GestionCatalogos" 

import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* PAGINA DE ATERRIZAJE PUBLICA */}
          <Route path="/" element={<Principal />} />
          <Route path="/principal" element={<Principal />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* RUTAS PROTEGIDAS ESTUDIANTE */}
          <Route
            path="/matricula"
            element={
              <PrivateRoute role="ESTUDIANTE">
                <Matricula />
              </PrivateRoute>
            }
          />

          {/* RUTAS PROTEGIDAS DOCENTE */}
          <Route 
            path="/docente/panel" 
            element={
              <PrivateRoute role="DOCENTE">
                 <h1>Panel Docente (En construcción)</h1>
              </PrivateRoute>
            } 
          />

          {/* RUTAS ADMIN */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role="ADMIN">
                <DashboardAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/validarMatricula"
            element={
              <PrivateRoute role="ADMIN">
                <ValidarMatricula />
              </PrivateRoute>
            }
          />
            {/* ⬅️ RUTA DE GESTIÓN DE DOCENTES (HU016) */}
          <Route
            path="/admin/docentes" 
            element={
              <PrivateRoute role="ADMIN">
                <GestionDocentes />
              </PrivateRoute>
            }
          />
          {/* 🛑 NUEVA RUTA DE GESTIÓN DE ESTUDIANTES */}
          <Route
            path="/admin/estudiantes" 
            element={
              <PrivateRoute role="ADMIN">
                <GestionEstudiantes />
              </PrivateRoute>
            }
          />

        {/* DE GESTIÓN DE CATELOGO */}
                  <Route
                    path="/admin/catalogos" 
                    element={
                      <PrivateRoute role="ADMIN">
                        <GestionCatalogos />
                      </PrivateRoute>
                    }
                  />



        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}